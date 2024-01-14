import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError.js";
import UserModel from "../models/user.model.js";

export const extractTokenFromHeadersAsBearer = (req) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};

const isPasswordChangedAfterTokenCreation = (user, decodedToken) => {
  // convert date to time stamp in seconds
  const passwordChangedAtTimeStamp = parseInt(
    user.passwordChangedAt.getTime() / 1000,
    10
  );

  return passwordChangedAtTimeStamp > decodedToken.iat;
};

// @desc    check authorization roles
export const allowedTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(`You are not allowed to access this route`, 403)
      );
    }

    next();
  });
};

// @ desc   make sure user is logged in
export const protect = asyncHandler(async (req, res, next) => {
  // check if token exist
  const token = extractTokenFromHeadersAsBearer(req);

  if (!token) {
    return next(new ApiError(`Token not provided`, 401));
  }

  const decodedToken = verifyToken(token);

  // check if user exist
  const user = await UserModel.findById(decodedToken.userId);

  if (!user) {
    return next(new ApiError(`user not found`, 404));
  }

  if (!user.isActive) {
    return next(new ApiError(`Activate your account, check your email`, 401));
  }

  // check if user change password after token is created
  if (isPasswordChangedAfterTokenCreation(user, decodedToken)) {
    return next(new ApiError(`password has changed, please login again`, 401));
  }

  req.user = user;
  next();
});
