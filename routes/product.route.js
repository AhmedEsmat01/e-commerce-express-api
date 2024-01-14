import { Router } from "express";

import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/product.validator.js";

import * as ProductService from "../services/product.service.js";
import * as AuthService from "../services/auth.service.js";
import { protect, allowedTo } from "../middlewares/auth.middleware.js";

import { uploadMultipleImages } from "../middlewares/multer.middleware.js";

const uploadImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const router = Router();

router
  .route("/")
  .get(ProductService.getProducts)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadImages,
    ProductService.preprocessImages,
    createProductValidator,
    ProductService.createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, ProductService.getProduct)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadImages,
    ProductService.preprocessImages,
    updateProductValidator,
    ProductService.updateProduct
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteProductValidator,
    ProductService.deleteProduct
  );

export default router;
