import CustomDropdown from "@/shared/components/CustomDropdown/CustomDropdown";
import type { DropdownBlock } from "../../types/index";
import { renderRichText } from "@/shared/components";
import { LinkBlock } from "./LinkBlock";

interface DropdownBlockProps {
    block: DropdownBlock;
}

export function DropdownBlock({ block }: DropdownBlockProps) {
    return (
        <CustomDropdown
            title={renderRichText(block.content.title)}
            direction="left"
            options={
                block.content.options.map((link, idx) => (
                    <LinkBlock
                        key={idx}
                        block={{
                            id: `dropdown-link-${block.id}-${idx}`,
                            parent_block_id: block.id,
                            target_site_id: link.target_site_id ?? null,
                            type: "link",
                            order: idx,
                            content: link,
                        }}
                    />
                ))
            }
        />
    );
}