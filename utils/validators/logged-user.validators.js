import { check } from "express-validator";
import bcrypt from "bcryptjs";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import UserModel from "../../models/user.model.js";
import ApiError from "../ApiError.js";
import slugify from "slugify";

export const changeLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("you must provide your current password")
    .custom(async (val, { req }) => {
      const id = req.user._id;

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

export const updateLoggedUserValidator = [
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

  validatorMiddleware,
];
