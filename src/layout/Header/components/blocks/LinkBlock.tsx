import type { LinkBlock } from "../../types/index";
import { renderRichText } from "@/shared/utils";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteLinkData, type SiteLinkData } from "../../lib/index";
import styles from "./LinkBlock.module.css";

interface LinkBlockProps {
    block: LinkBlock;
}

export function LinkBlock({ block }: LinkBlockProps) {
    const [siteData, setSiteData] = useState<SiteLinkData | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (block.target_site_id) {
            getSiteLinkData(block.target_site_id).then(setSiteData);
        }
    }, [block.target_site_id]);

    // Interner Link über target_site_id
    if (block.target_site_id && siteData) {
        const isActive = location.pathname === `/${siteData.slug}`;
        return (
            <RouterLink to={`/${siteData.slug}`} tabIndex={0} className={`${styles.link} ${isActive ? styles.active : ''}`}>
                {siteData.title}
            </RouterLink>
        );
    }

    // Externer Link oder individueller Label
    if (block.content.url) {
        return (
            <a href={block.content.url} target="_blank" rel="noopener noreferrer" tabIndex={0} className={styles.link}>
                {block.content.label ? renderRichText(block.content.label) : block.content.url}
            </a>
        );
    }

    return null;
}