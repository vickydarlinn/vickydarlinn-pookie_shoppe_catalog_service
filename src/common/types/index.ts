import { Request } from "express";
import { Document } from "mongoose";

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
