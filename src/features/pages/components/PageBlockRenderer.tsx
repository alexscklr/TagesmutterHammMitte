// render/renderPageBlock.tsx
import type { JSX, ReactNode } from "react";
import { PageBlocks, type PageBlock } from "../types/page";
import { renderRichText } from "../utils/renderRichText";
import { Timeline } from "@/features/timeline/Timeline";
import { BouncyText } from "@/shared/components/BouncyText/BouncyText";
import React from "react";
import type { Image } from "../types/blocks";

export function renderPageBlock(block: PageBlock): ReactNode {
  switch (block.type) {
    case PageBlocks.Title:
      return <h1 key={block.id}>{block.content.title}</h1>;

    case PageBlocks.Heading: {
      const Tag = `h${block.content.level}` as keyof JSX.IntrinsicElements;
      return <Tag key={block.id}>{block.content.text}</Tag>;
    }

    case PageBlocks.Paragraph:
      return <p key={block.id}>{renderRichText(block.content.paragraph)}</p>;

    case PageBlocks.List:
      return (
        <ul key={block.id}>
          {block.content.list_elements.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );

    case PageBlocks.BouncyText:
      return (
        <BouncyText
          key={block.id}
          text={block.content.text}
          amplitude={block.content.amplitude}
          frequency={block.content.frequency}
          characterDelay={block.content.characterDelay}
          duration={block.content.duration}
          pauseDuration={block.content.pauseDuration}
        />
      );

    case PageBlocks.Imagery:
      if (block.content.images.length < 1) return null;

      const renderImage = (image: Image, idx: number) => (
        <div key={idx} className="image-wrapper">
          <img src={image.url} alt={image.alt} loading="lazy" />
          {image.source && (
            <small className="image-source">
              Bild:{" "}
              {image.sourceUrl ? (
                <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {image.source}
                </a>
              ) : (
                image.source
              )}
              {image.license && ` (${image.license})`}
            </small>
          )}
        </div>
      );

      if (block.content.images.length === 1) {
        return (
          <div key={block.id} className="single-image-container">
            {renderImage(block.content.images[0], 0)}
          </div>
        );
      }

      return (
        <div key={block.id} className="double-image-container">
          {block.content.images.slice(0, 2).map((img, idx) => renderImage(img, idx))}
        </div>
      );

    case PageBlocks.Quote:
      return (
        <blockquote key={block.id}>
          {renderRichText(block.content.text)}
          {block.content.author && <footer>{block.content.author}</footer>}
        </blockquote>
      );

    case PageBlocks.Timeline:
      return <Timeline key={block.id} data={block.content.entries} />;

    case PageBlocks.Section:
      return (
        <section
          key={block.id}
          aria-labelledby={`section-title-${block.id}`}
        >
          {block.content.title &&
            React.createElement(
              `h${block.content.title.level}`,
              { id: `section-title-${block.id}` },
              block.content.title.text
            )}
          {block.content.content.map(renderPageBlock)}
        </section>
      );

    default:
      return null;
  }
}
