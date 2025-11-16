import type { PageBlock, PageBlocks } from "../index";
import { type Image } from "./index"

export interface Imagery {
  images: Image[];
}

export type ImageryBlock = Extract<PageBlock, {type: typeof PageBlocks.Imagery }>;