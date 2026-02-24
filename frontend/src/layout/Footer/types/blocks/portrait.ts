import type { Image } from "@/shared/types";
import type { FooterBlock, FooterBlocks } from "..";

export interface Portrait {
  image: Image;
}

export type PortraitBlock = Extract<FooterBlock, {type: typeof FooterBlocks.Portrait }>;