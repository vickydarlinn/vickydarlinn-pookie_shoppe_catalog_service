import express from "express";
import { CategoryController } from "./category-controller";
import {
  createCategoryValidator,
  updateCategoryValidator
} from "./category-validator";
import { CategoryService } from "./category-service";
import logger from "../common/config/logger";
import { authenticate } from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { asyncWrapper } from "../common/utils/wrapper";
import { CategoryModel } from "./category-model";

const router = express.Router();

const categoryService = new CategoryService(CategoryModel);
const categoryController = new CategoryController(categoryService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  createCategoryValidator,
  asyncWrapper(categoryController.create)
);

router.get("/", asyncWrapper(categoryController.getAll));
router.get("/:categoryId", asyncWrapper(categoryController.getOne));

router.delete("/:id", authenticate, asyncWrapper(categoryController.delete));
router.put(
  "/:categoryId",
  authenticate,
  canAccess([Roles.ADMIN]),
  updateCategoryValidator, // You may create a separate validator for updates if needed
  asyncWrapper(categoryController.update)
);
export default router;
