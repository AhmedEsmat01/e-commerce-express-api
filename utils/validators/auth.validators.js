import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";
import ApiError from "../ApiError.js";
import {
  extractTokenFromHeadersAsBearer,
  verifyToken,
} from "../../middlewares/auth.middleware.js";
import asyncHandler from "express-async-handler";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];

export const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val) => {
      const user = await UserModel.findOne({ email: val });
      if (user) {
        throw new ApiError("Email already registered", 400);
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("minimum password length is 6"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new ApiError(`password and password confirm doesn't match`, 400);
      }
      return true;
    }),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("minimum password length is 6"),

  validatorMiddleware,
];

export const verifyEmailValidator = [
  check("token")
    .notEmpty()
    .withMessage("token is required")
    .custom(
      asyncHandler(async (val, { req }) => {
        const decodedToken = verifyToken(val);
        req.userId = decodedToken.userId;
        return true;
      })
    ),
  validatorMiddleware,
];

export const forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("enter correct email format")
    .custom(
      asyncHandler(async (val, { req }) => {
        // check if user exists
        const user = await UserModel.findOne({ email: val });

        if (!user) {
          throw new ApiError(`no user found for ${email}`, 404);
        }

        req.userId = user._id;
        return true;
      })
    ),
  validatorMiddleware,
];

export const verifyResetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("reset code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("invalid code")
    .custom(
      asyncHandler(async (val, { req }) => {
        let token = extractTokenFromHeadersAsBearer(req);

        if (!token) {
          throw new ApiError("Token not Provided", 404);
        }

        const decodedToken = verifyToken(token);
        const user = await UserModel.findById(decodedToken.userId);

        if (!user) {
          throw new ApiError("User Not Found", 404);
        }

        req.user = user;
        return true;
      })
    ),
  validatorMiddleware,
];

export const changePasswordValidator = [
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must be between 6 and 20"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password length must be between 6 and 20")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        throw new ApiError("password and confirm password not match", 400);
      }

      return true;
    })
    .custom(
      asyncHandler(async (val, { req }) => {
        const token = extractTokenFromHeadersAsBearer(req);

        if (!token) {
          throw new ApiError("Token not Provided", 404);
        }

        const decodedToken = verifyToken(token);

        const user = await UserModel.findById(decodedToken.userId);

        if (!user || !user.resetPasswordCodeVerified) {
          throw new ApiError(`Failed to change password`, 400);
        }

        req.userId = user._id;

        return true;
      })
    ),

  validatorMiddleware,
];
