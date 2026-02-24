import type { Image } from "@/shared/types";
import type { HeaderBlock, HeaderBlocks } from "..";



export interface Logo {
    logo: Image
}

export type LogoBlock = Extract<HeaderBlock, { type: typeof HeaderBlocks.Logo }>;