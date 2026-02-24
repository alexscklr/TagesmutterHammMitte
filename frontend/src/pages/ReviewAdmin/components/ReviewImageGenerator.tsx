import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";
import styles from "./ReviewImageGenerator.module.css";
import { MdOutlineFileDownload } from "react-icons/md";

interface ReviewImageGeneratorProps {
    reviewLink: string;
    onDownload?: () => void;
}

export const ReviewImageGenerator: React.FC<ReviewImageGeneratorProps> = ({
    reviewLink,
    onDownload,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current && reviewLink) {
            generateImage();
        }
    }, [reviewLink]);

    const generateImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Canvas Dimensionen
        const width = 800;
        const height = 1000;
        canvas.width = width;
        canvas.height = height;

        // Hintergrund
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Rahmen
        ctx.strokeStyle = "#1aa374";
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Logo/Text oben
        ctx.fillStyle = "#1aa374";
        ctx.font = "bold 36px Nunito";
        ctx.textAlign = "center";
        ctx.fillText("Kindertagespflege", width / 2, 100);
        ctx.fillText("Maxi-Kids", width / 2, 150);

        // Aufforderungstext
        ctx.fillStyle = "#1aa374";
        ctx.font = "28px Nunito";
        ctx.fillText("Bewerten Sie mich gerne!", width / 2, 250);

        // QR Code generieren
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(reviewLink, {
                width: 300,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#ffffff",
                },
            });

            const qrImage = new Image();
            qrImage.onload = () => {
                // QR Code zentriert zeichnen
                const qrX = (width - 300) / 2;
                const qrY = 320;
                ctx.drawImage(qrImage, qrX, qrY, 300, 300);

                // Link unterhalb des QR Codes
                ctx.fillStyle = "#475569";
                ctx.font = "16px monospace";
                ctx.textAlign = "center";
                
                // Link in mehrere Zeilen aufteilen, wenn zu lang
                const maxWidth = width - 100;
                const words = reviewLink.split("/");
                let line = "";
                let y = 670;

                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + (i < words.length - 1 ? "/" : "");
                    const metrics = ctx.measureText(testLine);
                    
                    if (metrics.width > maxWidth && i > 0) {
                        ctx.fillText(line, width / 2, y);
                        line = words[i] + (i < words.length - 1 ? "/" : "");
                        y += 25;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, width / 2, y);

                // Anleitung am unteren Rand
                ctx.fillStyle = "#64748b";
                ctx.font = "18px Arial";
                ctx.fillText("Scannen Sie den QR-Code oder besuchen Sie den Link", width / 2, 850);
                ctx.fillText("um Ihre Bewertung abzugeben", width / 2, 880);
            };
            qrImage.src = qrCodeDataUrl;
        } catch (error) {
            console.error("Fehler beim Generieren des QR-Codes:", error);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `review-link-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            if (onDownload) {
                onDownload();
            }
        }, "image/png");
    };

    return (
        <div className={styles.container}>
            <div className={styles.previewSection}>
                <h3>Vorschau</h3>
                <div className={styles.canvasWrapper}>
                    <canvas ref={canvasRef} className={styles.canvas} />
                </div>
            </div>
            <div className={styles.actions}>
                <button onClick={handleDownload} className={styles.downloadButton}>
                    <MdOutlineFileDownload /> Bild herunterladen
                </button>
            </div>
        </div>
    );
};
