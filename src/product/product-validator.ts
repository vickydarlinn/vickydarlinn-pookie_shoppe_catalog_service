import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .exists()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name should be a string"),
  body("description").exists().withMessage("Description is required"),
  body("priceConfiguration")
    .exists()
    .withMessage("Price configuration is required"),
  body("attributes").exists().withMessage("Attributes field is required"),
  body("restaurantId").exists().withMessage("Restaurant id field is required"),
  body("categoryId").exists().withMessage("Category id field is required"),
  // todo: uncomment this line
  body("image").custom((value, { req }) => {
    if (!req.file) throw new Error("Product image is required");
    return true;
  })
];

export const updateProductValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Product name should be a string"),
  body("description").optional(),
  body("priceConfiguration").optional(),
  body("attributes").optional(),
  body("restaurantId").optional(),
  body("categoryId").optional(),
  body("image")
    .optional()
    .custom((value, { req }) => {
      if (req.file === undefined) {
        throw new Error("Product image is required when provided");
      }
      return true;
    })
];
