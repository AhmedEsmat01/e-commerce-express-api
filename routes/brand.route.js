import { Router } from "express";
import * as BrandService from "../services/brand.service.js";
import * as AuthService from "../services/auth.service.js";

import {
  createBrandValidator,
  deleteBrandValidator,
  getBrandValidator,
  updateBrandValidator,
} from "../utils/validators/brand.validators.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { protect, allowedTo } from "../middlewares/auth.middleware.js";

const router = Router();

const uploadBrandImage = uploadSingleImage("image");

router
  .route("/")
  .get(BrandService.getBrands)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    BrandService.preprocessImage,
    createBrandValidator,
    BrandService.createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, BrandService.getBrand)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    BrandService.preprocessImage,
    updateBrandValidator,
    BrandService.updateBrand
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteBrandValidator,
    BrandService.deleteBrand
  );

export default router;
