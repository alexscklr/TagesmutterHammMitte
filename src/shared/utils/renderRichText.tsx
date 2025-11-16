import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import { InlineFunctions, type RichTextSpan, type InlineFunction } from "../types/index";
import { BouncyText } from "@/shared/components/BouncyText/BouncyText";

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
    let el: JSX.Element | JSX.Element[] =
      span.text
        ? span.text.split("\n").reduce<JSX.Element[]>((acc, line, i, arr) => {
          acc.push(<>{line}</>);
          if (i < arr.length - 1) acc.push(<br key={i} />);
          return acc;
        }, [])
        : [];

    // Inline Function rendern
    if (span.inlineFunction) {
      const fn: InlineFunction = span.inlineFunction;

      switch (fn.type) {
        case InlineFunctions.Age:
          el = <span>{calculateAge((fn.value as { date: string }).date)}</span>;
          break;

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
    }

    // Styles
    if (span.bold) el = <strong>{el}</strong>;
    if (span.italic) el = <em>{el}</em>;
    if (span.underline) el = <u>{el}</u>;

    if (span.link) {
      const anchorClass = span.accent ? "accent-color" : undefined;
      el = (
        <a className={anchorClass} href={span.link} target="_blank" rel="noopener noreferrer">
          {el}
        </a>
      );
    }
    const classNames = !span.link && span.accent ? "accent-color" : "";

    return (
      <span key={`${idx}-${span.text}-${span.inlineFunction?.type ?? ""}`} className={classNames}>
        {el}
      </span>
    );
  });
}
