import asyncHandler from "express-async-handler";
import sharp from "sharp";

import CategoryModel from "../models/category.model.js";
import * as factory from "./handlers.factory.js";

export const preprocessImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    // save image name in database
    req.body.image = filename;
  }

  next();
});

// @desc    Create Category
// @route   POST /api/category
// @access Private
export const createCategory = factory.createOne(CategoryModel);

// @desc    Get Category
// @route   GET /api/category
// @access Public
export const getCategories = factory.getAll(CategoryModel);

// @desc    Get specific category
// @route   GET /api/category/:id
// @access Public
export const getCategory = factory.getOne(CategoryModel);

// @desc    Update specific category
// @route   PUT /api/category/:id
// @access Private
export const updateCategory = factory.updateOne(CategoryModel);

// @desc    Delete specific category
// @route   DELETE /api/category/:id
// @access Private
export const deleteCategory = factory.deleteOne(CategoryModel);
