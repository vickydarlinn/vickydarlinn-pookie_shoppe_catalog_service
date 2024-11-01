import express from "express";
import { asyncWrapper } from "../common/utils/wrapper";
import { authenticate } from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { S3Storage } from "../common/services/S3Storage";
import { ToppingService } from "./topping-service";
import { ToppingController } from "./topping-controller";
import { uploadMiddleware } from "../common/middlewares/upload";
import {
  createToppingValidator,
  updateToppingValidator
} from "./topping-validator";
import logger from "../common/config/logger";
import { ToppingModel } from "./topping-model";

const router = express.Router();

const toppingService = new ToppingService(ToppingModel);
const s3Storage = new S3Storage();
const toppingController = new ToppingController(
  toppingService,
  s3Storage,
  logger
);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  uploadMiddleware,
  createToppingValidator,
  asyncWrapper(toppingController.create)
);

router.put(
  "/:toppingId",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  uploadMiddleware,
  updateToppingValidator,
  asyncWrapper(toppingController.update)
);

router.get("/", asyncWrapper(toppingController.getAll));

router.get("/:toppingId", asyncWrapper(toppingController.getOne));
router.delete(
  "/:toppingId",
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  asyncWrapper(toppingController.delete)
);

export default router;
