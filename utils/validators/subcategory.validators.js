import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import slugify from "slugify";

export const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category").notEmpty().isMongoId().withMessage("Invalid id format"),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid id Format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 32 })
    .withMessage("name length should be between 3 and 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category").isMongoId().withMessage("Invalid id format").optional(),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid id Format"),
  validatorMiddleware,
];
