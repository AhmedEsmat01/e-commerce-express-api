import { Router } from "express";

import * as AuthService from "../services/auth.service.js";
import {
  changePasswordValidator,
  forgetPasswordValidator,
  loginValidator,
  signupValidator,
  verifyEmailValidator,
  verifyResetCodeValidator,
} from "../utils/validators/auth.validators.js";

const router = Router();

router.post("/signup", signupValidator, AuthService.signup);
router.get("/verify/:token", verifyEmailValidator, AuthService.verifyEmail);
router.post("/login", loginValidator, AuthService.login);
router.post(
  "/forget-password",
  forgetPasswordValidator,
  AuthService.forgetPassword
);
router.patch(
  "/verify-forget-password-code",
  verifyResetCodeValidator,
  AuthService.verifyResetCode
);
router.patch(
  "/change-password",
  changePasswordValidator,
  AuthService.changePassword
);

export default router;
