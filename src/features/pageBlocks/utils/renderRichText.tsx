import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import type { RichTextSpan } from "../types";

/**
 * Render PageBlock in JSX
 */
export function renderRichText(spans: RichTextSpan[] | string | null | undefined) {
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
    return <>{String(spans)}</>; // Fallback: einfach als Text rendern
  }

  return spans.map((span, idx) => {
    let el: JSX.Element | string = span.text ?? "";

    if (span.functionType === "age" && span.value) {
      el = calculateAge(span.value);
    }
    if (span.bold) el = <strong key={idx}>{el}</strong>;
    if (span.italic) el = <em key={idx}>{el}</em>;
    if (span.underline) el = <u key={idx}>{el}</u>;
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


