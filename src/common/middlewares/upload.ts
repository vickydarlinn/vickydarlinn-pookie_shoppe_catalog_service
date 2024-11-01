import multer from "multer";
import createHttpError from "http-errors";
import { Request } from "express-jwt";
import { NextFunction, Response } from "express";

// Configure multer for memory storage and set limits
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB limit
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (!file.mimetype.startsWith("image/")) {
      // Create an error if the file type is not an image
      return cb(createHttpError(400, "Only image files are allowed!"));
    }
    cb(null, true);
  }
}).single("image");

// Middleware function to handle upload errors
export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // File size error from multer
      const error = createHttpError(400, "File size exceeds the 1 MB limit");
      return next(error);
    } else if (err) {
      return next(err);
    }
    next();
  });
};
