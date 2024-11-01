import { Model } from "mongoose";
import { CreateProductDTO, Product } from "../common/types";

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
}
