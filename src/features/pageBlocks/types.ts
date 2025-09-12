export const PageBlocks = {
    Title: 'title',
    Paragraph: 'paragraph',
    Imagery: 'imagery',
    List: 'list',
    Quote: 'quote',
    Timeline: 'timeline'
} as const;

export type PageBlockType = typeof PageBlocks[keyof typeof PageBlocks];


export const InlineFunctions = {
    Age: 'age'
} as const;

export type InlineFunctionType = typeof InlineFunctions[keyof typeof InlineFunctions];


export interface RichTextSpan {
    /** Content */
    text: string;

    /** Inline Functions */
    functionType?: string;
    value?: string;

    /** Styles */
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    link?: string;
}

export interface Image {
    url: string;
    alt: string;
}

export interface TimelineEntry {
    label: string;
    timeSpan: [string, string];
    title: string;
    description: RichTextSpan[];
    images?: Image[];
}

export interface PageBlockPayloads {
    [PageBlocks.Title]: { title: string };
    [PageBlocks.Paragraph]: { paragraph: RichTextSpan[] };
    [PageBlocks.Imagery]: { images: Image[] };
    [PageBlocks.List]: { list_elements: string[] };
    [PageBlocks.Quote]: { text: string, author?: string };
    [PageBlocks.Timeline]: { entries: TimelineEntry[] }
}

export type PageBlock<T extends PageBlockType = PageBlockType> = {
    type: T;
    order: number;
    content: PageBlockPayloads[T];
};

export type Page = PageBlock[];