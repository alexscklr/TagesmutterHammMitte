import { useEffect, useState } from "react";
import type { Image } from "@/shared/types/index";
import { getImageUrl } from "@/shared/lib/imageQueries";

interface ImageryProps {
    id?: string
    images: Image[];
}

export function Imagery({ id, images }: ImageryProps) {

    useEffect(() => {
        if (images.length < 1) { return; }
    }, [images.length]);


    
    const [urls, setUrls] = useState<(string | null)[]>([]);

    useEffect(() => {
        let active = true;

        const loadUrls = async () => {
            const signedUrls = await Promise.all(
                images.map(async (img) => {
                    try {
                        return await getImageUrl(img.url, 'public_images', 60);
                    } catch (e) {
                        console.error("Fehler beim Laden der Bild-URL:", e);
                        return null;
                    }
                })
            );

            if (active) setUrls(signedUrls);
        };

        loadUrls();

        return () => {
            active = false;
        };
    }, [images]);

    const renderImage = (image: Image, idx: number) => {
        const signedUrl = urls[idx];
        if (!signedUrl) return <div key={idx}>Bild konnte nicht geladen werden</div>;

        return (
            <div
                key={idx}
                className='imageWrapper'
                style={{ width: `${image.width ? "100%" : ""}` }}
            >
                <img
                    src={signedUrl}
                    alt={image.alt}
                    loading="lazy"
                    style={{ width: `${image.width}%` }}
                    className='image'
                />
                {image.source && (
                    <small className='imageSource'>
                        Bild:{" "}
                        {image.sourceUrl ? (
                            <a
                                href={image.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {image.source}
                            </a>
                        ) : (
                            image.source
                        )}
                        {image.license && ` (${image.license})`}
                    </small>
                )}
            </div>
        );
    };

    if (images.length === 1) {
        return (
            <div id={id} className='singleImageContainer'>
                {renderImage(images[0], 0)}
            </div>
        );
    }

    return (
        <div id={id} className='doubleImageContainer'>
            {images.slice(0, 2).map((img, idx) => renderImage(img, idx))}
        </div>
    );
}
