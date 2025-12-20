import React, { type ReactNode } from "react";
import type { PageBlock } from "../types";
import { SelectableBlock } from "./SelectableBlock";

export function renderPageBlock(block: PageBlock): ReactNode {
  return React.createElement(SelectableBlock, { block, key: block.id });
}
