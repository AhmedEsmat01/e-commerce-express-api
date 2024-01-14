import asyncHandler from "express-async-handler";
import sharp from "sharp";

import ProductModel from "../models/product.model.js";
import * as factory from "./handlers.factory.js";

export const preprocessImages = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc    Create product
// @route   POST /api/product
// @access Private
export const createProduct = factory.createOne(ProductModel);

// @desc    Get product
// @route   GET /api/product
// @access Public
export const getProducts = factory.getAll(ProductModel);

// @desc    Get specific product
// @route   GET /api/product/:id
// @access Public
export const getProduct = factory.getOne(ProductModel);

// @desc    Update specific product
// @route   PUT /api/product/:id
// @access Private
export const updateProduct = factory.updateOne(ProductModel);

// @desc    Delete specific product
// @route   DELETE /api/product/:id
// @access Private
export const deleteProduct = factory.deleteOne(ProductModel);
