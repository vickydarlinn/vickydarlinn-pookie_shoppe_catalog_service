import express from "express";
import { authenticate } from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductService } from "./product-service";
import { ProductModel } from "./product-model";
import logger from "../common/config/logger";
import { ProductController } from "./product-controller";
import { asyncWrapper } from "../common/utils/wrapper";
import { uploadMiddleware } from "../common/middlewares/upload";
import {
  createProductValidator,
  updateProductValidator
} from "./product-validator";
import { S3Storage } from "../common/services/S3Storage";

const router = express.Router();

const productService = new ProductService(ProductModel);
const s3Storage = new S3Storage();
const productController = new ProductController(
  productService,
  s3Storage,
  logger
);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  uploadMiddleware,
  createProductValidator,
  asyncWrapper(productController.create)
);
router.put(
  "/:productId",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  uploadMiddleware,
  updateProductValidator,
  asyncWrapper(productController.update)
);

router.get("/", asyncWrapper(productController.getAll));

router.delete(
  "/:productId",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(productController.delete)
);

export default router;
