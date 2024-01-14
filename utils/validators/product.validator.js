import { check, body } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import CategoryModel from "../../models/category.model.js";
import SubCategoryModel from "../../models/subcategory.model.js";

export const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat(),
  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to category")
    .isMongoId()
    .withMessage("Invalid id format")
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`category with id : ${categoryId} not found`);
      }
      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom(async (subcategoryIds) => {
      const subCategories = await SubCategoryModel.find({
        _id: { $in: subcategoryIds },
      });
      if (subCategories.length != subcategoryIds.length) {
        throw new Error(`some or all ids [${subcategoryIds}] not exist`);
      }
      return true;
    })
    .custom(async (subcategoryIds, { req }) => {
      const categoryId = req.body.category;
      let subCategories = await SubCategoryModel.find({
        category: categoryId,
      }).select("_id");

      subCategories = subCategories.map((subCategory) =>
        subCategory._id.toString()
      );

      const checker = subcategoryIds.every((id) => subCategories.includes(id));

      if (!checker) {
        throw new Error(
          "some or all subCategories not belong to the specified Category"
        );
      }
      return true;
    }),

  validatorMiddleware,
];

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
