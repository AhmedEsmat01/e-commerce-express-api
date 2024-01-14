import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";
import ApiError from "../ApiError.js";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
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
      if (!user) {
        return true;
      }
      throw new ApiError("Email already registered", 400);
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("minimum password length is 6"),

  check("profileImage").optional(),

  check("role").optional(),

  check("phone")
    .notEmpty()
    .withMessage("phone number is required")
    .isMobilePhone("ar-EG"),

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

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("phone").optional().isMobilePhone("ar-EG"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (val) => {
      const user = await UserModel.findOne({ email: val });
      if (!user) {
        return true;
      }
      throw new ApiError("Email already registered", 400);
    }),

  check("profileImage").optional(),

  check("role").optional(),

  validatorMiddleware,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];

export const changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),

  check("currentPassword")
    .notEmpty()
    .withMessage("you must provide your current password")
    .custom(async (val, { req }) => {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      if (!user) {
        throw new ApiError("user not found", 404);
      }

      const isCorrectPassword = bcrypt.compareSync(val, user.password);

      if (!isCorrectPassword) {
        throw new ApiError("current passwrod is incorrect", 400);
      }
      return true;
    }),

  check("password").notEmpty().withMessage("you must provide new password"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("you must provide password confirmation")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new ApiError(`password and confirm password doesn't match`, 400);
      }

      return true;
    }),

  validatorMiddleware,
];
