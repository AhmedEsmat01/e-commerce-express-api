import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import slugify from "slugify";

export const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];
