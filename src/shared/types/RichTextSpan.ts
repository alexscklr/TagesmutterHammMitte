import type { InlineFunction } from "./index";
import type { PageSlug } from "@/constants/slugs";

export type LinkType = "internal" | "external";

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
