import React from "react";
import TwoClickEmbed from "@/shared/components/TwoClickEmbed/TwoClickEmbed";

interface GoogleLocationProps {
    address?: string;
    embedUrl?: string;
    apiKey?: string;
    className?: string;
    withConsent?: boolean;
    storageKey?: string;
    consentMessage?: string;
    buttonLabel?: string;
}

export const GoogleLocation: React.FC<GoogleLocationProps> = ({ 
    address, 
    embedUrl,
    apiKey, 
    className = "",
    withConsent = true,
    storageKey = "googleMapsConsent",
    consentMessage = "Zum Anzeigen der Karte bitte zustimmen. Mit dem Laden akzeptieren Sie die Datenschutzerklärung von Google.",
    buttonLabel = "Google Maps laden"
}) => {
    let src: string;

    if (embedUrl) {
        // Direkte Embed-URL (wie deine)
        src = embedUrl;
    } else if (address && apiKey) {
        // API-basierte URL
        const encodedAddress = encodeURIComponent(address);
        src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
    } else {
        console.error("GoogleLocation: Entweder embedUrl oder (address + apiKey) sind erforderlich");
        return null;
    }

    const mapElement = (
    <div className={`google-location ${className}`}>
        <iframe
            title="Google Location"
            src={src}
            height="450"
            style={{ 
                border: 0,
                width: "100%",
                maxWidth: "100%"
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    </div>
);

    if (withConsent) {
        return (
            <TwoClickEmbed
                storageKey={storageKey}
                message={consentMessage}
                buttonLabel={buttonLabel}
            >
                {mapElement}
            </TwoClickEmbed>
        );
    }

    return mapElement;
};

export default GoogleLocation;