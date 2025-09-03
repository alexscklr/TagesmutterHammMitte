import type { Page, PageBlock, PageBlockType, PageBlockPayloads, RichTextSpan } from "@/types/pageBlocks";
import { PageBlocks } from "@/types/pageBlocks";
import type { JSX } from "react";
import { calculateAge } from "@/utilities/dates";

/**
 * JSON to PageBlocks
 */
export function deserializePageBlocks(json: any[]): Page {
    return json.map((block) => {
        const type: PageBlockType = block.type;
        const order: number = block.order;

        let content: PageBlockPayloads[PageBlockType];

        switch (type) {
            case PageBlocks.Title:
                content = block.content as { title: string };
                break;

            case PageBlocks.Paragraph:
                content = block.content as { paragraph: RichTextSpan[] };
                break;

            case PageBlocks.List:
                content = block.content as { list_elements: string[] };
                break;

            case PageBlocks.Imagery:
                content = block.content as { image_urls: string[], alts: string[] };
                break;

            case PageBlocks.Quote:
                content = block.content as { text: string; author?: string };
                break;

            default:
                throw new Error(`Unknown block type: ${type}`);
        }

        return {
            type,
            order,
            content,
        } as PageBlock;
    });
}

/**
 * PageBlocks to JSON, e.g. for Supabase
 */
export function serializePageBlocks(blocks: Page): any[] {
    return blocks.map((block) => ({
        type: block.type,
        order: block.order,
        content: block.content,
    }));
}

/**
 * Render PageBlock in JSX
 */
function renderRichText(spans: RichTextSpan[]) {
    return spans.map((span, idx) => {
        let el: JSX.Element | string;

        // 🔹 Inline-Funktion (z.B. Alter)
        if (span.functionType === "age" && span.value) {
            el = calculateAge(span.value);
        } else {
            el = span.text ?? "";
        }

        // Styles anwenden
        if (span.bold) {
            el = <strong key={idx}>{el}</strong>;
        }
        if (span.italic) {
            el = <em key={idx}>{el}</em>;
        }
        if (span.underline) {
            el = <u key={idx}>{el}</u>;
        }
        if (span.link) {
            el = (
                <a key={idx} href={span.link} target="_blank" rel="noopener noreferrer">
                    {el}
                </a>
            );
        }

        return <span key={idx}>{el}</span>;
    });
}

export function renderPageBlock(block: PageBlock): JSX.Element | null {
    switch (block.type) {
        case PageBlocks.Title: {
            const content = block.content as { title: string };
            return <h1>{content.title}</h1>;
        }

        case PageBlocks.Paragraph: {
            const content = block.content as { paragraph: RichTextSpan[] };
            return <p>{renderRichText(content.paragraph)}</p>;
        }

        case PageBlocks.List: {
            const content = block.content as { list_elements: string[] };
            return (
                <ul>
                    {content.list_elements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            );
        }

        case PageBlocks.Imagery: {
            const content = block.content as { image_urls: string[], alts: string[] };
            if (content.image_urls.length < 1) return (<></>);
            if (content.image_urls.length == 1) {
                return (
                    <div className="single-image-container">
                        <img src={content.image_urls[0]} alt={content.alts[0]} />
                    </div>
                );
            } else {
                return (
                    <div className="double-image-container">
                        <img src={content.image_urls[0]} alt={content.alts[0]} />
                        <img src={content.image_urls[2]} alt={content.alts[1]} />
                    </div>
                );
            }

        }

        case PageBlocks.Quote: {
            const content = block.content as { text: string; author?: string };
            return (
                <blockquote>
                    {content.text}
                    {content.author && <footer>{content.author}</footer>}
                </blockquote>
            );
        }

        default:
            return null;
    }
}
