import { Model } from "mongoose";
import { Filter, Topping, ToppingDTO } from "../common/types";

export class ToppingService {
  constructor(private ToppingModel: Model<Topping>) {}

  create = async (topping: ToppingDTO) => {
    return await this.ToppingModel.create(topping);
  };

  getOne = async (toppingId: string) => {
    return await this.ToppingModel.findOne({ _id: toppingId });
  };

  update = async (toppingId: string, updateData: Partial<ToppingDTO>) => {
    return await this.ToppingModel.findByIdAndUpdate(toppingId, updateData, {
      new: true, // Will return the updated document
      runValidators: true // It Ensure the update follows schema validation rules
    });
  };

  getAll = async (
    page: number = 1,
    limit: number = 5,
    restaurantId?: string
  ) => {
    const skip = (page - 1) * limit;
    const filter: Filter = {};

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }

    const [toppings, total] = await Promise.all([
      this.ToppingModel.find(filter).skip(skip).limit(limit),
      this.ToppingModel.countDocuments(filter)
    ]);

    return {
      data: toppings,
      total,
      page,
      items: toppings.length
    };
  };

  delete = async (id: string) => {
    const deletedTopping = await this.ToppingModel.findByIdAndDelete(id);
    return deletedTopping;
  };
}
