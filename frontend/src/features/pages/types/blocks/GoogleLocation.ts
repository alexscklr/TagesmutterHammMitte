import type { PageBlock, PageBlocks } from "../index";

export interface GoogleLocation {
    address?: string;
    embedUrl?: string;
    apiKey?: string;
    className?: string;
    withConsent?: boolean;
    storageKey?: string;
    consentMessage?: string;
    buttonLabel?: string;
}

export type GoogleLocationBlock = Extract<PageBlock, { type: typeof PageBlocks.GoogleLocation }>;