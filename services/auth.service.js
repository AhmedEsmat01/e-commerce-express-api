import crypto from "crypto";

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import ApiError from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";
import {
  formConfirmRegistrationEmail,
  formForgetPasswordEmail,
} from "./mail.service.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });
};

const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashCode = (resetCode) => {
  return crypto.createHash("sha256").update(resetCode).digest("hex");
};

const formConfirmationLink = (token, req) => {
  return `${req.protocol}://${req.headers.host}/api/auth/verify/${token}`;
};

// @desc    Signup
// @route   POST /api/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
  // Create User
  const { name, email, password } = req.body;
  const user = { name, email, password };
  const newUser = await UserModel.create(user);

  // Generate Token
  const token = generateToken({ userId: newUser._id });

  const confirmationLink = formConfirmationLink(token, req);

  try {
    await formConfirmRegistrationEmail(email, name, confirmationLink);
  } catch (error) {
    await UserModel.findByIdAndDelete(newUser._id);
    res.status(500).json({ message: "failed to register user", error });
  }

  res.status(201).json({ data: newUser, token });
});

// @desc    verify email
// @route   GET /api/auth/verify/:token
// @access Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.userId,
    { isActive: true },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError("User Not Found", 404);
  }

  res.status(200).json({ status: "success", updatedUser });
});

// @desc    Login
// @route   POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  // check if user not exist or incorrect password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return next(new ApiError(`Invalid email or password`, 401));
  }

  // Generate Token
  const token = generateToken({ userId: user._id });

  res.status(200).json({ data: user, token });
});

// @desc    forget password
// @route   POST /api/auth/forget-password
// @access Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  // generate random code and hash
  const resetCode = generateRandomCode();
  const passwordResetCode = hashCode(resetCode);
  const passwordResetCodeExpiresIn = Date.now() + 10 * 60 * 1000;

  const user = await UserModel.findByIdAndUpdate(req.userId, {
    passwordResetCode,
    passwordResetCodeExpiresIn,
  });

  // send email
  try {
    await formForgetPasswordEmail(resetCode, user.email, user.name);
  } catch (error) {
    await UserModel.findByIdAndUpdate(req.userId, {
      passwordResetCode: undefined,
      passwordResetCodeExpiresIn: undefined,
    });

    return next(new ApiError(`problem in sending email : ${error}`, 500));
  }

  const token = generateToken({ userId: req.userId });

  res.status(200).json({ message: "email sent", token });
});

// @desc    verify reset code
// @route   PATCH /api/auth/verify-forget-password-code
// @access Public
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  const hashedResetCode = hashCode(resetCode);

  if (req.user.passwordResetCode != hashedResetCode) {
    return next(new ApiError("Invalid Code", 400));
  }

  if (Date.now() > req.user.passwordResetCodeExpiresIn) {
    return next(new ApiError("Code Expired, please request a new code", 400));
  }

  await UserModel.findByIdAndUpdate(req.user._id, {
    resetPasswordCodeVerified: true,
  });

  const token = generateToken({ userId: req.user._id });
  res.status(200).json({ status: "success", token });
});

// @desc    change password
// @route   POST /api/auth/change-password
// @access Public
export const changePassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const updatePasswordObject = {
    password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS)),
    resetPasswordCodeVerified: false,
    passwordResetCode: null,
    passwordResetCodeExpiresIn: null,
  };

  await UserModel.findByIdAndUpdate(req.userId, updatePasswordObject);

  res.status(200).json({ message: "success" });
});
