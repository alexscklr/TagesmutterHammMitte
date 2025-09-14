import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import type { RichTextSpan } from "../types/inline";
import { InlineFunctions, type InlineFunction } from "../types/inline";
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
    let el: JSX.Element | string = span.text ?? "";

    // Inline Function rendern
    if (span.inlineFunction) {
      const fn: InlineFunction = span.inlineFunction;

      switch (fn.type) {
        case InlineFunctions.Age:
          el = calculateAge((fn.value as { date: string }).date);
          break;

        case InlineFunctions.BouncyText:
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

        default:
          el = span.text;
      }
    }

    // Styles
    if (span.bold) el = <strong>{el}</strong>;
    if (span.italic) el = <em>{el}</em>;
    if (span.underline) el = <u>{el}</u>;
    if (span.link) {
      el = (
        <a href={span.link} target="_blank" rel="noopener noreferrer">
          {el}
        </a>
      );
    }

    return <span key={`${idx}-${span.text}-${span.inlineFunction?.type ?? ""}`}>{el}</span>;
  });
}
