import SubCategoryModel from "../models/subcategory.model.js";
import * as factory from "./handlers.factory.js";

export const setCategoryIdInBody = (req, res, next) => {
  if (!req.body.cateogry) {
    req.body.category = req.params.categoryId;
  }
  next();
};

export const createFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.filterObject = filter;
  next();
};

// @desc    Create SubCategory
// @route   POST /api/subcategory
// @access Private
export const createSubCategory = factory.createOne(SubCategoryModel);

// @desc    Get SubCategory
// @route   GET /api/subcategory
// @access Public
export const getSubCategories = factory.getAll(SubCategoryModel);

// @desc    Get specific Subcategory
// @route   GET /api/subcategory/:id
// @access Public
export const getSubCategory = factory.getOne(SubCategoryModel);

// @desc    Update specific Subcategory
// @route   PUT /api/subcategory/:id
// @access Private
export const updateSubCategory = factory.updateOne(SubCategoryModel);

// @desc    Delete specific Subcategory
// @route   DELETE /api/subcategory/:id
// @access Private
export const deleteSubCategory = factory.deleteOne(SubCategoryModel);
