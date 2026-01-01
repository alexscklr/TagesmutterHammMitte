import { useEffect, useState } from "react";
import type { Image } from "@/shared/types/index";
import { getImageUrl } from "@/shared/lib/imageQueries";
import styles from "./Imagery.module.css";
import { FaExternalLinkAlt } from "react-icons/fa";

interface ImageryProps {
    id?: string
    image: Image;
}

export function Imagery({ id, image }: ImageryProps) {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const loadUrl = async () => {
            try {
                const signedUrl = await getImageUrl(image.url, 'public_images', 60);
                if (active) setUrl(signedUrl);
            } catch (e) {
                console.error("Fehler beim Laden der Bild-URL:", e);
            }
        };

        loadUrl();

        return () => {
            active = false;
        };
    }, [image]);

    if (!url) return <div>Bild konnte nicht geladen werden</div>;

    return (
        <div id={id} className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
                <img
                    src={url}
                    alt={image.alt}
                    loading="lazy"
                    className={styles.image}
                    style={
                        typeof image.width === "number"
                            ? { width: `${image.width}%` }
                            : undefined
                    }
                />
                {image.source && (
                    <small className={styles.imageSource}>
                        Bild:{" "}
                        {image.sourceUrl ? (
                            <a
                                href={image.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {image.source}<FaExternalLinkAlt />
                            </a>
                        ) : (
                            image.source
                        )}
                        {image.license && ` (${image.license})`}
                    </small>
                )}
            </div>
        </div>
    );
}
