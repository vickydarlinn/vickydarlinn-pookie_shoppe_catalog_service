import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category-service";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { CreateCategoryDTO } from "../common/types";

export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private logger: Logger
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { name, priceConfiguration, attributes } =
      req.body as CreateCategoryDTO;
    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes
    });

    this.logger.info(`Created category`, { id: category._id });
    res.json({ id: category._id });
  };

  getAll = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getAll();
    res.json(categories);
  };
  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Call the service to delete the category by ID
    const deletedCategory = await this.categoryService.delete(id);

    if (!deletedCategory) {
      this.logger.error(`this delete category id not found`, { id });

      return next(createHttpError(404, `Category with id ${id} not found`));
    }

    res.status(200).json({ message: "Category deleted successfully", id });
  };
  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const category = await this.categoryService.getOne(categoryId);
    if (!category) {
      return next(createHttpError(404, "Category not found"));
    }
    this.logger.info(`Getting category`, { id: category._id });
    res.json(category);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { categoryId } = req.params;
    const updateData = req.body as Partial<CreateCategoryDTO>;

    const updatedCategory = await this.categoryService.update(
      categoryId,
      updateData
    );
    if (!updatedCategory) {
      this.logger.info(`Updated category not found`, { id: categoryId });
      return next(createHttpError(404, "Category not found"));
    }
    this.logger.info(`Updated category`, { id: categoryId });
    res.json(updatedCategory);
  };
}
