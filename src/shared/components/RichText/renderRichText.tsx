import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import {
  InlineFunctions,
  type InlineFunction,
  type InlineFunctionRange,
  type LinkRange,
  type RichTextContent,
  type RichTextDocument,
  type RichTextRange,
  type RichTextSpan,
} from "../../types/index";
import { BouncyText } from "@/shared/components/BouncyText/BouncyText";
import Link from "../Link/Link";

const isDocument = (value: unknown): value is RichTextDocument => {
  return !!value && typeof value === "object" && typeof (value as RichTextDocument).text === "string";
};

const inRange = (range: RichTextRange, start: number, end: number) => range.start <= start && range.end >= end;

const hasStyle = (ranges: RichTextRange[] | undefined, start: number, end: number) =>
  ranges?.some((r) => inRange(r, start, end)) ?? false;

const findLink = (links: LinkRange[] | undefined, start: number, end: number) =>
  links?.find((r) => inRange(r, start, end));

const findInlineFn = (fns: InlineFunctionRange[] | undefined, start: number, end: number) =>
  fns?.find((r) => r.end > r.start && inRange(r, start, end));

const getBreakpoints = (doc: RichTextDocument) => {
  const points = new Set<number>([0, doc.text.length]);
  const add = (ranges?: RichTextRange[]) => ranges?.forEach((r) => points.add(r.start) && points.add(r.end));
  add(doc.bold);
  add(doc.italic);
  add(doc.underline);
  add(doc.accent);
  add(doc.links);
  add(doc.functions); // include zero-length inline functions so they align to positions
  return Array.from(points).sort((a, b) => a - b);
};

/**
 * Convert the compact document representation into legacy spans for rendering.
 */
export const docToSpans = (doc: RichTextDocument): RichTextSpan[] => {
  const breakpoints = getBreakpoints(doc);
  const spans: RichTextSpan[] = [];

  const zeroLengthFns = (doc.functions || []).filter((f) => f.start === f.end).sort((a, b) => a.start - b.start);
  let zeroIdx = 0;

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const start = breakpoints[i];
    const end = breakpoints[i + 1];

    while (zeroIdx < zeroLengthFns.length && zeroLengthFns[zeroIdx].start === start) {
      spans.push({
        text: "",
        inlineFunction: zeroLengthFns[zeroIdx].inlineFunction,
      });
      zeroIdx++;
    }

    const segmentText = doc.text.slice(start, end);
    const inlineFn = findInlineFn(doc.functions, start, end)?.inlineFunction;
    if (!segmentText && !inlineFn) {
      continue;
    }

    const link = findLink(doc.links, start, end);

    spans.push({
      text: segmentText,
      bold: hasStyle(doc.bold, start, end),
      italic: hasStyle(doc.italic, start, end),
      underline: hasStyle(doc.underline, start, end),
      accent: hasStyle(doc.accent, start, end),
      linkType: link?.linkType,
      linkSlug: link?.linkSlug,
      linkUrl: link?.linkUrl,
      inlineFunction: inlineFn,
    });
  }

  while (zeroIdx < zeroLengthFns.length) {
    spans.push({ text: "", inlineFunction: zeroLengthFns[zeroIdx].inlineFunction });
    zeroIdx++;
  }

  return spans;
};

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
 * Render RichText content (document or legacy spans) in JSX
 */
export function renderRichText(content: RichTextContent) {
  if (content === null || content === undefined) return null;

  let normalized: RichTextContent = content;

  // Falls ein JSON-String kommt → parsen
  if (typeof normalized === "string") {
    try {
      normalized = JSON.parse(normalized) as RichTextContent;
    } catch {
      return <>{normalized}</>;
    }
  }

  if (isDocument(normalized)) {
    normalized = docToSpans(normalized);
  }

  if (!Array.isArray(normalized)) {
    return <>{String(normalized)}</>;
  }

  return normalized.map((span, idx) => {
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
        <Link href={href} isExternal={isExternalLink} anchorClass={anchorClass}>
          {el}
        </Link>
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
