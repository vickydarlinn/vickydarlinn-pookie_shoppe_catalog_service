import { Schema, model, Document } from "mongoose";
import { Category } from "../common/types";

const PriceConfigurationSchema = new Schema(
  {
    priceType: {
      type: String,
      enum: ["base", "additional"],
      required: true
    },
    availableOptions: {
      type: [Schema.Types.Mixed],
      required: true
    }
  },
  { _id: false }
);

const AttributeSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    widgetType: {
      type: String,
      enum: ["switch", "radio"],
      required: true
    },
    defaultValue: {
      type: Schema.Types.Mixed,
      required: true
    },
    availableOptions: {
      type: [Schema.Types.Mixed],
      required: true
    }
  },
  { _id: false }
);

// Define the main Category schema
const CategorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true
    },
    priceConfiguration: {
      type: Map,
      of: PriceConfigurationSchema,
      required: true
    },
    attributes: {
      type: [AttributeSchema],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create and export the Category model
export const CategoryModel = model<Category & Document>(
  "Category",
  CategorySchema
);
