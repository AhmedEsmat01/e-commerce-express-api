import { Router } from "express";

import * as UserService from "../services/user.service.js";
import * as AuthService from "../services/auth.service.js";

import {
  changePasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserValidator,
} from "../utils/validators/user.validators.js";
import { uploadSingleImage } from "../middlewares/multer.middleware.js";
import { protect, allowedTo } from "../middlewares/auth.middleware.js";
import {
  changeLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} from "../utils/validators/logged-user.validators.js";

const router = Router();

const uploadUserImage = uploadSingleImage("image");

// Routes Related to Logged User
router.get(
  "/get-me",
  protect,
  UserService.getLoggedUserData,
  UserService.getUser
);

router.patch(
  "/change-my-password",
  protect,
  changeLoggedUserPasswordValidator,
  UserService.updateLoggedUserPassword
);

router.put(
  "/update-my-data",
  protect,
  uploadUserImage,
  updateLoggedUserValidator,
  UserService.updateLoggedUserData
);

// Routes Related to Admin and manager
router
  .route("/")
  .get(protect, allowedTo("admin", "manager"), UserService.getUsers)
  .post(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    UserService.preprocessImage,
    createUserValidator,
    UserService.createUser
  );

router
  .route("/:id")
  .get(getUserValidator, UserService.getUser)
  .put(
    protect,
    allowedTo("admin"),
    uploadUserImage,
    UserService.preprocessImage,
    updateUserValidator,
    UserService.updateUser
  )
  .delete(
    protect,
    allowedTo("admin"),
    deleteUserValidator,
    UserService.deleteUser
  )
  .patch(changePasswordValidator, UserService.changeUserPassword);

export default router;
