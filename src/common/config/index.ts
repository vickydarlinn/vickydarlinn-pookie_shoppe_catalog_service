import { config } from "dotenv";
import path from "path";

config({
  path: path.join(__dirname, `../../../.env.${process.env.NODE_ENV}`)
});

const {
  PORT,
  LOG_LEVEL,
  NODE_ENV,
  DB_URL,
  JWKS_URI,
  CLIENT_UI_DOMAIN,
  ADMIN_UI_DOMAIN
} = process.env;

export const Config = {
  PORT,
  LOG_LEVEL,
  NODE_ENV,
  DB_URL,
  JWKS_URI,
  CLIENT_UI_DOMAIN,
  ADMIN_UI_DOMAIN
};
