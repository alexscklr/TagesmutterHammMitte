import React, { useEffect, useState } from "react";
import "./TwoClickEmbed.css"

interface TwoClickEmbedProps {
    storageKey: string; // z. B. "googleMapsConsent"
    iframe: React.ReactNode; // Der einzubettende iframe (z. B. Google Maps)
    message?: string; // Optional eigene Nachricht
    buttonLabel?: string; // Optional eigener Button-Text
    className?: string; // Optionales Wrapper-Styling
}

const TwoClickEmbed: React.FC<TwoClickEmbedProps> = ({
    storageKey,
    iframe,
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
        <div className={`two-click-embed-wrapper ${className}`}>
            {isVisible ? (
                <div className="iframe-container">
                    {iframe}
                    <button className="revoke-button" onClick={handleRevoke}>
                        Zustimmung widerrufen
                    </button>
                </div>
            ) : (
                <div className="consent-box">
                    <p className="consent-message">{message}</p>
                    <button className="consent-button" onClick={handleClick}>
                        {buttonLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TwoClickEmbed;
