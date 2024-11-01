import mongoose from "mongoose";
import { Topping } from "../common/types";

const ToppingSchema = new mongoose.Schema<Topping>(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    restaurantId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const ToppingModel = mongoose.model<Topping>("Topping", ToppingSchema);
