import type { PortraitBlock } from "../../types/index";
import { getImageUrl } from "@/shared/lib/imageQueries";
import { useEffect, useState } from "react";
import styles from "../../Footer.module.css";

interface PortraitBlockProps {
    block: PortraitBlock;
}

export function PortraitBlock({ block }: PortraitBlockProps) {
    const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPortraitUrl() {
            try {
                const url = await getImageUrl(block.content.image.url, "public_images", 60);
                setPortraitUrl(url);
            } catch (e: Error | unknown) {
                console.error("Fehler beim Laden des Portraits:", e);
                setPortraitUrl(null);
            }
        }
        if (block.content.image?.url) {
            fetchPortraitUrl();
        }
    }, [block.content.image]);

    if (!portraitUrl) return null;

    return (
        <div className={styles.portrait}>
            <div className={styles.imageWrap}>
                <img src={portraitUrl} alt={block.content.image.alt ?? ""} />
            </div>
        </div>
    );
}