import type { InlineFunction } from "./index";

export interface RichTextSpan {
    /** Content */
    text: string;

    /** Inline Functions */
    inlineFunction?: InlineFunction;

    /** Styles */
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    link?: string;
    accent?: boolean;
}
