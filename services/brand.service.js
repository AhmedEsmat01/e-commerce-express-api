import asyncHandler from "express-async-handler";
import BrandModel from "../models/brand.model.js";

import * as factory from "./handlers.factory.js";

export const preprocessImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    // save image name in database
    req.body.image = filename;
  }

  next();
});

// @desc    Create brand
// @route   POST /api/brand
// @access Private
export const createBrand = factory.createOne(BrandModel);

// @desc    Get brand
// @route   GET /api/brand
// @access Public
export const getBrands = factory.getAll(BrandModel);

// @desc    Get specific brand
// @route   GET /api/brand/:id
// @access Public
export const getBrand = factory.getOne(BrandModel);

// @desc    Update specific brand
// @route   PUT /api/brand/:id
// @access Private
export const updateBrand = factory.updateOne(BrandModel);

// @desc    Delete specific brand
// @route   DELETE /api/brand/:id
// @access Private
export const deleteBrand = factory.deleteOne(BrandModel);
