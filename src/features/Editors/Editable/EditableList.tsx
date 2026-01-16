import React from "react";
import { SaveBlockButton } from "@/shared/components";
import type { List } from "@/features/pages/types/blocks";
import { PageBlocks, type PageBlock } from "@/features/pages/types";
import { RichTextEditor } from "@/features/Editors/RichText/RichTextEditor";
import { FaTrash, FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";

export interface EditableListProps {
  value: List;
  onChange: (value: List) => void;
}

const EditableList: React.FC<EditableListProps> = ({ value, onChange }) => {
  const update = <K extends keyof List>(k: K, v: List[K]) => onChange({ ...value, [k]: v });

  const handleContentChange = (index: number, newBlockContent: any) => {
    const newContent = [...(value.content || [])];
    // Preserve the block structure, only update the inner content
    if (newContent[index].type === PageBlocks.Paragraph) {
       newContent[index] = {
         ...newContent[index],
         content: {
            ...newContent[index].content,
            paragraph: newBlockContent
         }
       } as PageBlock;
    }
    update("content", newContent);
  };

  const handleAddStringItem = () => {
      // Default to adding a Paragraph block
      const newBlock: PageBlock = {
          id: crypto.randomUUID(),
          parent_block_id: null,
          type: PageBlocks.Paragraph,
          order: (value.content?.length || 0),
          content: {
              paragraph: "",
              align: "left"
          }
      };
      update("content", [...(value.content || []), newBlock]);
  }

  const handleDeleteItem = (index: number) => {
      const newContent = [...(value.content || [])];
      newContent.splice(index, 1);
      update("content", newContent);
  }
  
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
      const newContent = [...(value.content || [])];
      if (direction === 'up' && index > 0) {
          [newContent[index], newContent[index - 1]] = [newContent[index - 1], newContent[index]];
      } else if (direction === 'down' && index < newContent.length - 1) {
          [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
      }
      update("content", newContent);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          Geordnet:
          <input
            type="checkbox"
            checked={!!value.ordered}
            onChange={(e) => update("ordered", e.target.checked)}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          Stil:
            <select
                value={value.listStyle ?? "disc"}
                onChange={(e) => update("listStyle", e.target.value as List["listStyle"])}
                style={{ padding: "0.2rem" }}
            >
                {(["disc","circle","square","decimal","lower-alpha","upper-alpha","lower-roman","upper-roman", "none"] as const).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          Ausrichtung:
          <select
            value={value.margin ?? "left"}
            onChange={(e) => update("margin", e.target.value as List["margin"])}
            style={{ padding: "0.2rem" }}
          >
            <option value="left">Links</option>
            <option value="center">Zentriert</option>
            <option value="right">Rechts</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontWeight: "bold" }}>Listenelemente:</label>
        {(value.content || []).map((block, index) => (
            <div key={block.id || index} style={{ display: "flex", gap: "0.5rem", alignItems: "start", background: "rgba(0,0,0,0.05)", padding: "0.5rem", borderRadius: "4px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>{index + 1}.</span>
                     <button onClick={() => handleDeleteItem(index)} style={{ border: "none", background: "transparent", color: "red", cursor: "pointer" }} title="Delete">
                        <FaTrash />
                    </button>
                    <div style={{ display: "flex", gap: "2px" }}>
                         <button onClick={() => handleMoveItem(index, 'up')} disabled={index === 0} style={{ border: "none", background: "transparent", cursor: index===0 ? "default" : "pointer", opacity: index===0 ? 0.3 : 1, color:"black" }}>
                            <FaArrowUp size={10} />
                         </button>
                         <button onClick={() => handleMoveItem(index, 'down')} disabled={index === (value.content?.length || 0) - 1} style={{ border: "none", background: "transparent", cursor: index === (value.content?.length || 0) - 1 ? "default" : "pointer", opacity: index === (value.content?.length || 0) - 1 ? 0.3 : 1, color:"black" }}>
                            <FaArrowDown size={10} />
                         </button>
                    </div>
                </div>
                
                <div style={{ flex: 1 }}>
                    {block.type === PageBlocks.Paragraph ? (
                        <RichTextEditor
                            value={(block.content as any).paragraph || ""}
                            onChange={(text) => handleContentChange(index, text)}
                        />
                    ) : (
                        <div style={{ padding: "0.5rem", background: "#f8f9fa", border: "1px dashed #ccc" }}>
                            Unsupported Block Type: {block.type}
                        </div>
                    )}
                </div>
            </div>
        ))}

        <button 
            onClick={handleAddStringItem}
            style={{ 
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "0.5rem", border: "1px dashed #ccc", background: "transparent", cursor: "pointer",
                width: "100%", marginTop: "0.5rem", color: "var(--color-text)"
            }}
        >
            <FaPlus /> Element hinzufügen
        </button>
      </div>

      <div style={{ marginTop: "0.5em" }}>
        <SaveBlockButton />
      </div>
    </div>
  );
};

export default EditableList;
