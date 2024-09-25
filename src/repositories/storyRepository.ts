import {
  InputStoryInterface,
  StoryInterface,
} from "../interfaces/storyInterface";
import Model from "../models";
import { BaseRepository } from "./baseRepository";

export class StoryRepository extends BaseRepository<
  InputStoryInterface,
  StoryInterface
> {
  constructor() {
    super(Model.Story);
  }
}
