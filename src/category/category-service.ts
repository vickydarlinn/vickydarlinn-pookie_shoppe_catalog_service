import { Model } from "mongoose";
import { Category, CreateCategoryDTO } from "../common/types";

export class CategoryService {
  constructor(private CategoryModel: Model<Category>) {}
  create = async (category: CreateCategoryDTO) => {
    const newCategory = await this.CategoryModel.create(category);
    return newCategory;
  };

  getAll = async () => {
    const allCategories = await this.CategoryModel.find();
    return allCategories;
  };
  delete = async (id: string) => {
    const deletedCategory = await this.CategoryModel.findByIdAndDelete(id);
    return deletedCategory;
  };
  getOne = async (categoryId: string) => {
    return await this.CategoryModel.findOne({ _id: categoryId });
  };

  update = async (
    categoryId: string,
    updateData: Partial<CreateCategoryDTO>
  ) => {
    return await this.CategoryModel.findByIdAndUpdate(categoryId, updateData, {
      new: true, // Will return the updated document
      runValidators: true // It Ensure the update follows schema validation rules
    });
  };
}
