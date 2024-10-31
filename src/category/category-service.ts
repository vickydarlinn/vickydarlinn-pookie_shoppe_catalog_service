import { Model } from "mongoose";
import { Category, CreateCategoryDTO } from "../common/types";

export class CategoryService {
  constructor(private CategoryModel: Model<Category>) {}
  create = async (category: CreateCategoryDTO) => {
    const newCategory = await this.CategoryModel.create(category);
    return newCategory;
  };

  getAll = async (page: number = 1, limit: number = 5) => {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      this.CategoryModel.find().skip(skip).limit(limit),
      this.CategoryModel.countDocuments()
    ]);

    return {
      data: categories,
      total,
      page,
      items: categories.length
    };
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
