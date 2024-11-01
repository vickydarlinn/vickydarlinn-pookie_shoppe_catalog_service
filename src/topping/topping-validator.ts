import { body } from "express-validator";

export const createToppingValidator = [
  body("name")
    .exists()
    .withMessage("Topping name is required")
    .isString()
    .withMessage("Topping name should be a string"),
  body("price").exists().withMessage("Price is required"),
  // todo: uncomment this line
  body("image").custom((value, { req }) => {
    if (!req.file) throw new Error("Topping image is required");
    return true;
  }),
  body("restaurantId").exists().withMessage("Restaurant Id is required")
];

export const updateToppingValidator = [
  body("name")
    .optional()
    .exists()
    .withMessage("Topping name is required")
    .isString()
    .withMessage("Topping name should be a string"),
  body("price").optional().exists().withMessage("Price is required"),
  // todo: uncomment this line
  body("image")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) throw new Error("Topping image is required");
      return true;
    }),
  body("restaurantId")
    .optional()
    .exists()
    .withMessage("Restaurant Id is required")
];
