import * as Sequelize from 'sequelize';

import { WorkspaceExtend } from './workspaceInterface';
import { ModelTimestampExtend, ModelCreatorIdExtend } from '.';

export interface InputMessageInterface extends ModelCreatorIdExtend {
    roomId: Sequelize.CreationOptional<number>;
    workspaceId: Sequelize.CreationOptional<number>;
    senderId: Sequelize.CreationOptional<number>;
    body: string;
}

export interface MessageInterface extends ModelTimestampExtend, WorkspaceExtend {
    id: Sequelize.CreationOptional<number>;
    roomId: Sequelize.CreationOptional<number>;
    senderId: Sequelize.CreationOptional<number>;
    body: string;
}

export interface MessageModelInterface
  extends Sequelize.Model<MessageInterface, Partial<InputMessageInterface>>,
  MessageInterface { }
