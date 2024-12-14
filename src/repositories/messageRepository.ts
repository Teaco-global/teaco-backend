import { InputMessageInterface, MessageInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";
import Model from "../models";

export class MessageRepository extends BaseRepository<
InputMessageInterface,
MessageInterface
> {
  constructor() {
    super(Model.Message);
  }
}