import { Logger } from "winston";
import { ProductService } from "./product-service";
import { Request } from "express-jwt";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CreateProductDTO, FileStorage } from "../common/types";
import { v4 as uuidv4 } from "uuid";
import { Roles } from "../common/constants";

export class ProductController {
  constructor(
    private productService: ProductService,
    private storage: FileStorage,
    private logger: Logger
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const {
      attributes,
      categoryId,
      description,
      name,
      isPublish,
      priceConfiguration,
      restaurantId
    } = req.body as CreateProductDTO;

    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (restaurantId != managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to create this product in this restaurant"
          )
        );
      }
    }

    const imageName = uuidv4();
    await this.storage.upload({
      filename: imageName,
      fileData: req.file!.buffer
    });

    const product = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration as unknown as string),
      attributes: JSON.parse(attributes as unknown as string),
      restaurantId,
      categoryId,
      isPublish,
      image: imageName
    };
    const newProduct = await this.productService.create(product);
    res.status(201).json(newProduct);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { productId } = req.params;
    const isProduct = await this.productService.getOne(productId);

    if (!isProduct) {
      return next(createHttpError(400, "Product not found"));
    }

    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (isProduct.restaurantId !== managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to update this product in this restaurant"
          )
        );
      }
    }

    // image updation
    let imageName: string | undefined;
    let oldImageName: string | undefined;

    if (req.file?.buffer) {
      oldImageName = isProduct.image;

      imageName = uuidv4();
      await this.storage.upload({
        filename: imageName,
        fileData: req.file!.buffer
      });

      await this.storage.delete(oldImageName);
    }

    const {
      name,
      description,
      priceConfiguration,
      attributes,
      restaurantId,
      categoryId,
      isPublish
    } = req.body as CreateProductDTO;

    const productToUpdate = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration as unknown as string),
      attributes: JSON.parse(attributes as unknown as string),
      restaurantId,
      categoryId,
      isPublish,
      image: imageName ? imageName : (oldImageName as string)
    };

    const updatedProduct = await this.productService.update(
      productId,
      productToUpdate
    );

    res.json({ data: updatedProduct });
  };

  getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const restaurantId = req.query.restaurantId as string;
    const includeUnpublished = req.query.includeUnpublished === "true";
    const allProducts = await this.productService.getAll(
      page,
      limit,
      restaurantId,
      includeUnpublished
    );

    res.json(allProducts);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const isProduct = await this.productService.getOne(productId);
    if (!isProduct) {
      this.logger.error(`this delete product id not found`, { productId });

      return next(
        createHttpError(404, `product with id ${productId} not found`)
      );
    }
    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (isProduct.restaurantId != managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to delete this product in this restaurant"
          )
        );
      }
    }
    await this.storage.delete(isProduct.image);
    // Call the service to delete the product by ID
    await this.productService.delete(productId);

    res
      .status(200)
      .json({ message: "Product deleted successfully", productId });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const product = await this.productService.getOne(productId);
    if (!product) {
      return next(createHttpError(404, "product not found"));
    }
    this.logger.info(`Getting product`, { id: product._id });
    res.json(product);
  };
}
