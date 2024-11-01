import mongoose, { Schema, model, Document } from "mongoose";
import { Product } from "../common/types";

const attributeValueSchema = new mongoose.Schema({
  name: {
    type: String
  },
  value: {
    type: mongoose.Schema.Types.Mixed
  }
});

const priceConfigurationSchema = new mongoose.Schema({
  priceType: {
    type: String,
    enum: ["base", "additional"]
  },
  availableOptions: {
    type: Map,
    of: Number
  }
});

const ProductSchema = new Schema<Product>(
  {
    name: {
      required: true,
      type: String
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    restaurantId: {
      type: String,
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema
    },

    attributes: [attributeValueSchema],

    isPublish: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true
  }
);

export const ProductModel = model<Product & Document>("Product", ProductSchema);
