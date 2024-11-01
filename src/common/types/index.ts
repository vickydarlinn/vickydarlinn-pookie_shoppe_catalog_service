import { Request } from "express";
import { Document, Types } from "mongoose";

export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface Category extends Document {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export interface AttributeValue {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any; // `any` because the value can be of various types, depending on the attribute
}

export interface PriceConfigurationOption {
  priceType: "base" | "additional";
  availableOptions: Map<string, number>; // Map where the key is an option name, and the value is a price
}

export interface Product extends Document {
  name: string;
  description: string;
  priceConfiguration: {
    [key: string]: PriceConfigurationOption;
  };
  attributes: AttributeValue[];
  restaurantId: string;
  categoryId: Types.ObjectId;
  isPublish: boolean;
  image: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  priceConfiguration: {
    [key: string]: PriceConfigurationOption;
  };
  attributes: AttributeValue[];
  restaurantId: string;
  categoryId: Types.ObjectId;
  isPublish: boolean;
  image: string;
}

export interface CreateCategoryDTO {
  name: string;
  priceConfiguration: PriceConfiguration;
  attributes: Attribute[];
}

export interface AuthRequest extends Request {
  auth: IPayload;
}

export type IPayload = {
  id: string;
  role: string;
  tokenId?: number;
};

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};
export interface FileData {
  filename: string;
  fileData: ArrayBuffer;
}

export interface FileStorage {
  upload(data: FileData): Promise<void>;
  delete(filename: string): Promise<void>;
  getObjectUri(filename: string): string;
}

export interface Topping extends Document {
  name: string;
  price: number;
  restaurantId: string;
  image: string;
}

export interface ToppingDTO {
  name: string;
  price: number;
  restaurantId: string;
  image: string;
}

export interface Filter {
  restaurantId?: string;
  isPublish?: boolean;
}
