import type { ReactNode } from "react";
import type { PageBlock, PageBlockPayloads } from "../types";
import { PageBlocks } from "../types"
import { renderRichText } from "../utils/renderRichText"
import { Timeline } from "@/features/timeline/Timeline";



export function renderPageBlock(block: PageBlock, key?: number): ReactNode {
    switch (block.type) {
        case PageBlocks.Title: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Title];
            return <h1 key={key}>{content.title}</h1>;
        }

        case PageBlocks.Paragraph: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Paragraph];
            return <p key={key}>{renderRichText(content.paragraph)}</p>;
        }

        case PageBlocks.List: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.List];
            return (
                <ul key={key}>
                    {content.list_elements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            );
        }

        case PageBlocks.Imagery: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Imagery];
            if (content.images.length < 1) return (<></>);
            if (content.images.length == 1) {
                return (
                    <div className="single-image-container" key={key}>
                        <img src={content.images[0].url} alt={content.images[0].alt} />
                    </div>
                );
            } else {
                return (
                    <div className="double-image-container" key={key}>
                        <img src={content.images[0].url} alt={content.images[0].alt} />
                        <img src={content.images[1].url} alt={content.images[1].alt} />
                    </div>
                );
            }

        }

        case PageBlocks.Quote: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Quote];
            return (
                <blockquote key={key}>
                    {content.text}
                    {content.author && <footer>{content.author}</footer>}
                </blockquote>
            );
        }

        case PageBlocks.Timeline: {
            const content = block.content as PageBlockPayloads[typeof PageBlocks.Timeline];
            return (
                <Timeline data={content.entries} key={key} />
            );
        }

        default:
            return <></>;
    }
}
