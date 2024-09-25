import * as dotenv from "dotenv";
import * as Sequelize from "sequelize";

dotenv.config();

const mustExist = <T>(value: T | undefined, name: String): T => {
  if (!value) {
    console.error(`Missing config:${name}`);
    process.exit(1);
  }

  return value;
};

export const port = mustExist(+process.env.PORT! as number, "PORT"),
  baseUrl = mustExist(process.env.BASE_URL as string, "BASE_URL"),
  db = {
    username: mustExist(process.env.DB_USER!, "DB_USER"),
    password: mustExist(process.env.DB_PASSWORD!, "DB_PASSWORD"),
    name: mustExist(process.env.DB_NAME!, "DB_NAME"),
    host: mustExist(process.env.DB_HOST!, "DB_HOST"),
    dialect: mustExist(process.env.DB_DIALECT!, "DB_DIALECT"),
    port: mustExist(+process.env.DB_PORT!, "DB_PORT"),
    logging: false,
    timezone: "utc",
  } as {
    username: string;
    password: string;
    name: string;
    host: string;
    dialect: Sequelize.Dialect;
    port: number;
  },
  saltRound = 10,
  mail = mustExist(process.env.MAIL!, "MAIL"),
  mailPassword = mustExist(process.env.MAIL_PASSWORD!, "MAIL_PASSWORD"),
  jwtClientId = mustExist(process.env.JWT_CLIENT_ID!, "JWT_CLENT_ID"),
  jwtClientSecret =  mustExist(process.env.JWT_CLIENT_SECRET!, "JWT_CLIENT_SECRET"),
  accessTokenExpiresIn = '7d',
  refreshTokenExpiresIn = '7d';

export * from "./databaseInstance";
