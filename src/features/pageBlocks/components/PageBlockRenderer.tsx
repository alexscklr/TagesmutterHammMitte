import type { JSX } from "react";
import type { PageBlock, PageBlockPayloads } from "../types";
import { PageBlocks } from "../types"
import { renderRichText } from "../utils/renderRichText"
import { Timeline } from "@/features/timeline/Timeline";



export function renderPageBlock(block: PageBlock): JSX.Element | null {
    switch (block.type) {
        case PageBlocks.Title: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Title];
            return <h1>{content.title}</h1>;
        }

        case PageBlocks.Paragraph: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Paragraph];
            return <p>{renderRichText(content.paragraph)}</p>;
        }

        case PageBlocks.List: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.List];
            return (
                <ul>
                    {content.list_elements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            );
        }

        case PageBlocks.Imagery: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Imagery];
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
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Quote];
            return (
                <blockquote>
                    {content.text}
                    {content.author && <footer>{content.author}</footer>}
                </blockquote>
            );
        }

        case PageBlocks.Timeline: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Timeline];
            return (
                <Timeline data={content.entries} />
            );
        }

        default:
            return null;
    }
}
