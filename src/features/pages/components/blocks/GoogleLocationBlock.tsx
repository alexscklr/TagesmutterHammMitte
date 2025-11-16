import type { GoogleLocationBlock } from "../../types/index";
import { GoogleLocation } from "@/shared/components/GoogleLocation/GoogleLocation";

interface GoogleLocationBlockProps {
    block: GoogleLocationBlock;
}

export function GoogleLocationBlock({ block }: GoogleLocationBlockProps) {
    if (!block.content.embedUrl && !block.content.address && !block.content.apiKey ) {
        return <></>;
    }

    return <GoogleLocation embedUrl={block.content.embedUrl} address={block.content.address} apiKey={block.content.apiKey} className={block.content.className} withConsent={block.content.withConsent} storageKey={block.content.storageKey} consentMessage={block.content.consentMessage} buttonLabel={block.content.buttonLabel} />;
};