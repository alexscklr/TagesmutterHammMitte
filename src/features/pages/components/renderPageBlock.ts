import React, { type ReactNode } from "react";
import type { PageBlock } from "../types";
import { DraggableBlock } from "./DraggableBlock";

export function renderPageBlock(block: PageBlock): ReactNode {
  return React.createElement(DraggableBlock, { block, key: block.id });
}
