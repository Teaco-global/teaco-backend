import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputColumnInterface {
  label: string;
  position: number;
  slug: string;
}

export interface ColumnInterface
  extends InputColumnInterface,
    ModelTimestampExtend {
  id: number;
}

export interface ColumnModelInterface
  extends Sequelize.Model<ColumnInterface, Partial<InputColumnInterface>>,
    ColumnInterface {}
