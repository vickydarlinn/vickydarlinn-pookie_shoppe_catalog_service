import { body } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .exists()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name should be a string"),
  body("priceConfiguration")
    .exists()
    .withMessage("Price configuration is required"),
  body("priceConfiguration.*.priceType")
    .exists()
    .withMessage("Price type is required")
    .custom((value: "base" | "additional") => {
      const validKeys = ["base", "additional"];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for priceType field. Possible values are: [${validKeys.join(
            ", "
          )}]`
        );
      }
      return true;
    }),
  body("attributes").exists().withMessage("Attributes field is required")
];

export const updateCategoryValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Category name should be a string"),
  body("priceConfiguration").optional(),
  body("priceConfiguration.*.priceType")
    .optional()
    .custom((value: "base" | "additional") => {
      const validKeys = ["base", "additional"];
      if (!validKeys.includes(value)) {
        throw new Error(
          `${value} is invalid attribute for priceType field. Possible values are: [${validKeys.join(
            ", "
          )}]`
        );
      }
      return true;
    }),
  body("attributes").optional()
];
