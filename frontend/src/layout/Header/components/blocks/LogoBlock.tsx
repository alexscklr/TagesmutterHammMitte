import type { LogoBlock } from "../../types/index";
import { getImageUrl } from "@/shared/lib/imageQueries";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

interface LogoBlockProps {
    block: LogoBlock;
}

export function LogoBlock({ block }: LogoBlockProps) {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLogoUrl() {
            try {
                const url = await getImageUrl(block.content.logo.url, "public_images", 60);
                setLogoUrl(url);
            } catch (e: Error | unknown) {
                console.error("Fehler beim Laden des Logos:", e);
                setLogoUrl(null);
            }
        }
        if (block.content.logo?.url) {
            fetchLogoUrl();
        }
    }, [block.content.logo]);

    if (!logoUrl) return null;

    return (
        <RouterLink to="/">
            <img
                src={logoUrl}
                alt={block.content.logo.alt ?? "Logo"}
                style={{ 
                }}
                loading="lazy"
            />
        </RouterLink>
    );
}