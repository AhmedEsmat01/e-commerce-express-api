import multer from "multer";
import ApiError from "../utils/ApiError.js";

const multerConfig = () => {
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      const errorMessage = "unsupported file type, only images are allowed";
      cb(new ApiError(errorMessage, 400), false);
    }
  };
  const storage = multer.memoryStorage();

  const upload = multer({ storage, fileFilter });
  return upload;
};

export const uploadSingleImage = (fieldName) =>
  multerConfig().single(fieldName);

export const uploadMultipleImages = (fields) => multerConfig().fields(fields);
