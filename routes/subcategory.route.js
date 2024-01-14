import { Router } from "express";
import * as SubCategoryService from "../services/subcategory.service.js";
import * as AuthService from "../services/auth.service.js";

import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} from "../utils/validators/subcategory.validators.js";
import { deleteCategoryValidator } from "../utils/validators/category.validators.js";
import { protect, allowedTo } from "../middlewares/auth.middleware.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    SubCategoryService.createFilterObject,
    SubCategoryService.getSubCategories
  )
  .post(
    protect,
    allowedTo("admin", "manager"),
    SubCategoryService.setCategoryIdInBody,
    createSubCategoryValidator,
    SubCategoryService.createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, SubCategoryService.getSubCategory)
  .put(
    protect,
    allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    SubCategoryService.updateSubCategory
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteCategoryValidator,
    SubCategoryService.deleteSubCategory
  );

export default router;
