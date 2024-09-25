import * as Sequelize from "sequelize";
import { ModelTimestampExtend } from "./timestampInterface";

export interface InputStoryInterface {
  workspaceId: number;
  projectId: number;
  assignedToId: number;
  createdById: number;
  issueId: number;
  sprintId: number;
  boardId: number;
  storyPoint?: number;
  description: string;
}

export interface StoryInterface extends InputStoryInterface, ModelTimestampExtend {
  id: number;
}

export interface StoryModelInterface
  extends Sequelize.Model<StoryInterface, Partial<InputStoryInterface>>,
    StoryInterface {}
