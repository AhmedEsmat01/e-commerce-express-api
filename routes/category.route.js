import { Router } from "express";

import * as CategoryService from "../services/category.service.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/category.validators.js";
import subCategoryRoute from "./subcategory.route.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import * as AuthService from "../services/auth.service.js";
import { protect, allowedTo } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/:categoryId/subcategory", subCategoryRoute);

router
  .route("/")
  .get(CategoryService.getCategories)
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadSingleImage("image"),
    CategoryService.preprocessImage,
    createCategoryValidator,
    CategoryService.createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, CategoryService.getCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadSingleImage("image"),
    CategoryService.preprocessImage,
    updateCategoryValidator,
    CategoryService.updateCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteCategoryValidator,
    CategoryService.deleteCategory
  );

export default router;
