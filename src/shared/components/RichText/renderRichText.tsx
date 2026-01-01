import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import { InlineFunctions, type RichTextSpan, type InlineFunction } from "../../types/index";
import { BouncyText } from "@/shared/components/BouncyText/BouncyText";
import { FaExternalLinkAlt } from "react-icons/fa";

/**
 * Resolve link href from RichTextSpan
 */
function getHrefFromSpan(span: RichTextSpan): string | undefined {
  // New format: linkType and linkSlug/linkUrl
  if (span.linkType === "internal" && span.linkSlug !== undefined) {
    // Internal link using slug
    return `/${span.linkSlug}`;
  }
  if (span.linkType === "external" && span.linkUrl) {
    // External link
    return span.linkUrl;
  }
  // Legacy: direct link property
  if (span.link) {
    return span.link;
  }
  return undefined;
}

/**
 * Render RichTextSpan Array in JSX
 */
export function renderRichText(spans: RichTextSpan[]) {
  if (!spans) return null;



  // Falls ein JSON-String kommt → parsen
  if (typeof spans === "string") {
    try {
      spans = JSON.parse(spans) as RichTextSpan[];
    } catch {
      return <>{spans}</>;
    }
  }

  if (!Array.isArray(spans)) {
    return <>{String(spans)}</>;
  }

  return spans.map((span, idx) => {
    let el: JSX.Element | JSX.Element[];

    // Inline Function rendern (hat Vorrang vor normalem Text)
    if (span.inlineFunction) {
      const fn: InlineFunction = span.inlineFunction;

      switch (fn.type) {
        case InlineFunctions.Age:
          {
            const dateStr = (fn.value as { date: string }).date;
            const age = calculateAge(dateStr);
            el = <span>{age}</span>;
            break;
          }

        case InlineFunctions.BouncyText:
          {
            const settings = fn.value as {
              amplitude?: number;
              duration?: number;
              pauseDuration?: number;
              characterDelay?: number;
              frequency?: number;
            };
            el = (
              <BouncyText
                text={span.text}
                amplitude={settings.amplitude}
                duration={settings.duration}
                pauseDuration={settings.pauseDuration}
                characterDelay={settings.characterDelay}
                frequency={settings.frequency}
              />
            );
            break;
          }

        default:
          el = <span>{span.text}</span>;
      }
    } else {
      // Normaler Text mit Zeilenumbrüchen
      el =
        span.text
          ? span.text.split("\n").reduce<JSX.Element[]>((acc, line, i, arr) => {
            acc.push(<span key={`${idx}-line-${i}`}>{line}</span>);
            if (i < arr.length - 1) acc.push(<br key={`${idx}-br-${i}`} />);
            return acc;
          }, [])
          : [];
    }

    // Styles
    if (span.bold) el = <strong>{el}</strong>;
    if (span.italic) el = <em>{el}</em>;
    if (span.underline) el = <u>{el}</u>;

    // Handle links (both new and legacy format)
    const href = getHrefFromSpan(span);
    if (href) {
      const anchorClass = span.accent ? "accent-color" : undefined;
      const isExternalLink = span.linkType === "external" || (!span.linkType && span.link?.startsWith("http"));
      el = (
        <a 
          className={anchorClass} 
          href={href} 
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
        >
          {el} {isExternalLink && <FaExternalLinkAlt />}
        </a> 
      );
    }
    const classNames = !href && span.accent ? "accent-color" : "";

    return (
      <span key={`${idx}-${span.text}-${span.inlineFunction?.type ?? ""}`} className={classNames}>
        {el}
      </span>
    );
  });
}
