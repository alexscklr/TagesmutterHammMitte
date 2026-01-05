import type { InlineFunction } from "./index";
import type { PageSlug } from "@/constants/slugs";

export type LinkType = "internal" | "external";

/**
 * Range utilities (start inclusive, end exclusive)
 */
export interface RichTextRange {
    start: number;
    end: number;
}

export interface LinkRange extends RichTextRange {
    linkType: LinkType;
    linkSlug?: PageSlug;
    linkUrl?: string;
}

export interface InlineFunctionRange extends RichTextRange {
    inlineFunction: InlineFunction;
}

/**
 * New compact representation: text + ranges for styles, links, and inline functions
 */
export interface RichTextDocument {
    text: string;
    bold?: RichTextRange[];
    italic?: RichTextRange[];
    underline?: RichTextRange[];
    accent?: RichTextRange[];
    links?: LinkRange[];
    functions?: InlineFunctionRange[];
}

/**
 * Legacy span-based representation (kept for backward compatibility)
 */
export interface RichTextSpan {
    /** Content */
    text: string;

    /** Inline Functions */
    inlineFunction?: InlineFunction;

    /** Styles */
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;

    /** Link configuration */
    linkType?: LinkType;
    linkSlug?: PageSlug;
    linkUrl?: string;

    /** Legacy: direct link (will be replaced by linkUrl) */
    link?: string;

    accent?: boolean;
}

export type RichTextContent = RichTextSpan[] | RichTextDocument | string;
