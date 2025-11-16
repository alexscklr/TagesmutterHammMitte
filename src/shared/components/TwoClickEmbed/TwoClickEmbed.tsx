import React, { useEffect, useState } from "react";
import styles from "./TwoClickEmbed.module.css"

interface TwoClickEmbedProps {
    storageKey: string;
    children: React.ReactNode;
    message?: string;
    buttonLabel?: string;
    className?: string;
}

const TwoClickEmbed: React.FC<TwoClickEmbedProps> = ({
    storageKey,
    children,
    message = "Zum Anzeigen dieses Inhalts bitte auf den Button klicken. Mit dem Laden akzeptieren Sie die Datenschutzerklärung des Drittanbieters.",
    buttonLabel = "Inhalt laden",
    className = "",
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(storageKey);
        if (consent === "true") {
            setIsVisible(true);
        }
    }, [storageKey]);

    const handleClick = () => {
        localStorage.setItem(storageKey, "true");
        setIsVisible(true);
    };

    const handleRevoke = () => {
        localStorage.removeItem(storageKey);
        setIsVisible(false);
    };

    return (
        <div className={`${styles.twoClickEmbedWrapper} ${className}`}>
            {isVisible ? (
                <div className={styles.contentContainer}>
                    {children}
                    <button className={styles.revokeButton} onClick={handleRevoke}>
                        Zustimmung widerrufen
                    </button>
                </div>
            ) : (
                <div className={styles.consentBox}>
                    <p className={styles.consentMessage}>{message}</p>
                    <button className={styles.consentButton} onClick={handleClick}>
                        {buttonLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TwoClickEmbed;