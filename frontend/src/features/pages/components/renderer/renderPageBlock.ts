import React, { type ReactNode } from "react";
import type { PageBlock } from "../../types";
import { DraggableBlock } from "../editor/DraggableBlock";
import { getBlockComponent } from "./blockRegistry";

export function renderPageBlock(block: PageBlock, isEditing: boolean = false): ReactNode {
  if (isEditing) {
    return React.createElement(DraggableBlock, { block, key: block.id });
  }

  const component = getBlockComponent(block);
  if (!component) return null;

  // Clone component to attach key without adding an extra wrapper div
  return React.cloneElement(component, { key: block.id });
}
