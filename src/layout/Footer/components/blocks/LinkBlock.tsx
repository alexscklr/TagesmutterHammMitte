import type { LinkBlock } from "../../types/index";
import { Link, renderRichText } from "@/shared/components";
import { useEffect, useState } from "react";
import { getSiteLinkData, type SiteLinkData } from "../../lib/index";

interface LinkBlockProps {
    block: LinkBlock;
}

export function LinkBlock({ block }: LinkBlockProps) {
    const [siteData, setSiteData] = useState<SiteLinkData | null>(null);

    useEffect(() => {
        if (block.target_site_id) {
            getSiteLinkData(block.target_site_id).then(setSiteData);
        }
    }, [block.target_site_id]);

    // Interner Link über target_site_id
    if (block.target_site_id && siteData) {
        return (
            
            <Link href={`/${siteData.slug}`} isExternal={false}> <span style={{color: 'white'}}>{siteData.title}</span></Link>
        );
    }

    // Externer Link oder individueller Label
    if (block.content.url) {
        return (
            <Link href={block.content.url} isExternal={true}> {block.content.label ? renderRichText(block.content.label) : block.content.url}</Link>
        );
    }

    return null;
}