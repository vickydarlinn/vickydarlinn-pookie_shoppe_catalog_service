import { Logger } from "winston";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { FileStorage, ToppingDTO } from "../common/types";
import { ToppingService } from "./topping-service";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Roles } from "../common/constants";
import { v4 as uuidv4 } from "uuid";

export class ToppingController {
  constructor(
    private toppingService: ToppingService,
    private storage: FileStorage,
    private logger: Logger
  ) {}
  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { name, price, restaurantId } = req.body as ToppingDTO;

    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (restaurantId != managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to create this topping in this restaurant"
          )
        );
      }
    }
    const imageName = uuidv4();
    await this.storage.upload({
      filename: imageName,
      fileData: req.file!.buffer
    });

    const topping = {
      name,
      price,
      image: imageName,
      restaurantId
    };

    const newTopping = await this.toppingService.create(topping);
    res.status(201).json(newTopping);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { toppingId } = req.params;

    const isTopping = await this.toppingService.getOne(toppingId);

    if (!isTopping) {
      return next(createHttpError(400, "Topping not found"));
    }

    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (isTopping.restaurantId !== managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to update this topping in this restaurant"
          )
        );
      }
    }

    // image updation
    let imageName: string | undefined;
    let oldImageName: string | undefined;
    if (req.file?.buffer) {
      oldImageName = isTopping.image;

      imageName = uuidv4();
      await this.storage.upload({
        filename: imageName,
        fileData: req.file!.buffer
      });

      await this.storage.delete(oldImageName);
    }

    const { name, price, restaurantId } = req.body as ToppingDTO;

    const toppingToUpdate = {
      name,
      price,
      restaurantId,
      image: imageName ? imageName : (oldImageName as string)
    };

    const updatedTopping = await this.toppingService.update(
      toppingId,
      toppingToUpdate
    );

    res.json({ data: updatedTopping });
  };

  getAll = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const restaurantId = req.query.restaurantId as string;
    const allToppings = await this.toppingService.getAll(
      page,
      limit,
      restaurantId
    );

    res.json(allToppings);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    const { toppingId } = req.params;
    const isTopping = await this.toppingService.getOne(toppingId);
    if (!isTopping) {
      this.logger.error(`this delete topping id not found`, { toppingId });

      return next(
        createHttpError(404, `topping with id ${toppingId} not found`)
      );
    }
    if (req.auth!.role !== Roles.ADMIN) {
      const managerOfRestaurant = req.auth!.restaurantId;
      if (isTopping.restaurantId != managerOfRestaurant) {
        return next(
          createHttpError(
            403,
            "You are not allowed to delete this topping in this restaurant"
          )
        );
      }
    }
    await this.storage.delete(isTopping.image);
    // Call the service to delete the topping by ID
    await this.toppingService.delete(toppingId);

    res
      .status(200)
      .json({ message: "topping deleted successfully", toppingId });
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const { toppingId } = req.params;
    const topping = await this.toppingService.getOne(toppingId);
    if (!topping) {
      return next(createHttpError(404, "topping not found"));
    }
    this.logger.info(`Getting topping`, { id: topping._id });
    res.json(topping);
  };
}
