import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcryptjs";

import UserModel from "../models/user.model.js";
import * as factory from "./handlers.factory.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "./auth.service.js";

export const preprocessImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    // save image name in database
    req.body.profileImage = filename;
  }
  next();
});

// @desc    Create User
// @route   POST /api/user
// @access Private
export const createUser = factory.createOne(UserModel);

// @desc    Get users
// @route   GET /api/user
// @access Private
export const getUsers = factory.getAll(UserModel);

// @desc    Get specific user
// @route   GET /api/user/:id
// @access Private
export const getUser = factory.getOne(UserModel);

// @desc    Update specific User
// @route   PUT /api/user/:id
// @access Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = {
    name: req.body.name,
    phone: req.body.phone,
    slug: req.body.slug,
    profileImage: req.body.profileImage,
    email: req.body.email,
    role: req.body.role,
  };

  const result = await UserModel.findByIdAndUpdate(id, user, {
    new: true,
  });

  if (!result) {
    return next(new ApiError(`result not found for id : ${id}`, 404));
  }
  res.status(200).json({ data: result });
});

// @desc    Delete specific User
// @route   DELETE /api/user/:id
// @access Private
export const deleteUser = factory.deleteOne(UserModel);

// @desc    Change user password
// @route   PATCH /api/user/:id
// @access Private
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const result = await UserModel.findByIdAndUpdate(
    id,
    {
      password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS)),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!result) {
    return next(new ApiError(`result not found for id : ${id}`, 404));
  }
  res.status(200).json({ data: result });
});

// @desc    Get logged user data
// @route   GET /api/user/get-me
// @access Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/user/update-my-password
// @access Private/Protect
export const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const { password } = req.body;

  const result = await UserModel.findByIdAndUpdate(
    id,
    {
      password: bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS)),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!result) {
    return next(new ApiError(`result not found for id : ${id}`, 404));
  }

  // Generate Token
  const payload = { userId: id };
  const token = generateToken(payload);

  res.status(200).json({ data: result, token });
});

// @desc    Update logged user data (without password and role)
// @route   PUT /api/user/update-my-data
// @access Private/Protect
export const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = {
    name: req.body.name,
    phone: req.body.phone,
    slug: req.body.slug,
    profileImage: req.body.profileImage,
    email: req.body.email,
  };

  const result = await UserModel.findByIdAndUpdate(id, user, {
    new: true,
  });

  if (!result) {
    return next(new ApiError(`result not found for id : ${id}`, 404));
  }
  res.status(200).json({ data: result });
});
