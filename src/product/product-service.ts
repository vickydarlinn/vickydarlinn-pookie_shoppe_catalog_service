import { Model } from "mongoose";
import { CreateProductDTO, Product, Filter } from "../common/types";

export class ProductService {
  constructor(private ProductModel: Model<Product>) {}

  create = async (product: CreateProductDTO) => {
    return await this.ProductModel.create(product);
  };
  getOne = async (productId: string) => {
    return await this.ProductModel.findOne({ _id: productId });
  };

  update = async (productId: string, updateData: Partial<CreateProductDTO>) => {
    return await this.ProductModel.findByIdAndUpdate(productId, updateData, {
      new: true, // Will return the updated document
      runValidators: true // It Ensure the update follows schema validation rules
    });
  };

  getAll = async (
    page: number = 1,
    limit: number = 5,
    restaurantId?: string,
    includeUnpublished: boolean = false
  ) => {
    const skip = (page - 1) * limit;
    const filter: Filter = {};

    if (restaurantId) {
      filter.restaurantId = restaurantId;
    }
    if (!includeUnpublished) {
      filter.isPublish = true;
    }

    const [products, total] = await Promise.all([
      this.ProductModel.find(filter).skip(skip).limit(limit),
      this.ProductModel.countDocuments(filter)
    ]);

    return {
      data: products,
      total,
      page,
      items: products.length
    };
  };

  delete = async (id: string) => {
    const deletedProduct = await this.ProductModel.findByIdAndDelete(id);
    return deletedProduct;
  };
}
