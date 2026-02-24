import { calculateAge } from "@/shared/utils/dates";
import type { JSX } from "react";
import {
  InlineFunctions,
  type RichTextContent,
  type RichTextDocument,
  type RichTextRange,
} from "../../types/index";
import { BouncyText } from "@/shared/components/BouncyText/BouncyText";
import Link from "../Link/Link";

const isDocument = (value: unknown): value is RichTextDocument => {
  return !!value && typeof value === "object" && !Array.isArray(value) && typeof (value as RichTextDocument).text === "string";
};

const getBreakpoints = (doc: RichTextDocument) => {
  const points = new Set<number>([0, doc.text.length]);
  const add = (ranges?: RichTextRange[]) => ranges?.forEach((r) => {
    points.add(r.start);
    points.add(r.end);
  });
  add(doc.bold);
  add(doc.italic);
  add(doc.underline);
  add(doc.accent);
  add(doc.links);
  add(doc.functions);
  return Array.from(points).sort((a, b) => a - b);
};

const renderDoc = (doc: RichTextDocument) => {
  const breakpoints = getBreakpoints(doc);
  const elements: JSX.Element[] = [];

  const zeroLengthFns = (doc.functions || []).filter((f) => f.start === f.end).sort((a, b) => a.start - b.start);
  let zeroIdx = 0;

  for (let i = 0; i < breakpoints.length - 1; i++) {
    const start = breakpoints[i];
    const end = breakpoints[i + 1];

    while (zeroIdx < zeroLengthFns.length && zeroLengthFns[zeroIdx].start === start) {
      const fn = zeroLengthFns[zeroIdx].inlineFunction;
      if (fn.type === InlineFunctions.Age) {
        const dateStr = (fn.value as { date: string }).date;
        const age = calculateAge(dateStr);
        elements.push(<span key={`zfn-${i}`}>{age}</span>);
      }
      zeroIdx++;
    }

    const segmentText = doc.text.slice(start, end);
    if (!segmentText) continue;

    let el: JSX.Element | string = segmentText;

    const inlineFn = doc.functions?.find(f => f.start <= start && f.end >= end && f.start < f.end)?.inlineFunction;
    if (inlineFn) {
      if (inlineFn.type === InlineFunctions.BouncyText) {
        const settings = inlineFn.value as any;
        el = (
          <BouncyText
            text={segmentText}
            amplitude={settings.amplitude}
            duration={settings.duration}
            pauseDuration={settings.pauseDuration}
            characterDelay={settings.characterDelay}
            frequency={settings.frequency}
          />
        );
      } else if (inlineFn.type === InlineFunctions.Age) {
        const dateStr = (inlineFn.value as { date: string }).date;
        el = calculateAge(dateStr);
      }
    }

    if (doc.bold?.some(r => r.start <= start && r.end >= end)) el = <strong>{el}</strong>;
    if (doc.italic?.some(r => r.start <= start && r.end >= end)) el = <em>{el}</em>;
    if (doc.underline?.some(r => r.start <= start && r.end >= end)) el = <u>{el}</u>;

    const link = doc.links?.find(r => r.start <= start && r.end >= end);
    const accent = doc.accent?.some(r => r.start <= start && r.end >= end);
    let className = "";
    if (accent) {
      className = "accent-color";
    }

    if (link) {
      const href = link.linkType === 'internal' ? `/${link.linkSlug}` : link.linkUrl;
      const isExternal = link.linkType === 'external';
      el = <Link href={href || ""} isExternal={isExternal} anchorClass={accent ? "accent-color" : undefined}>{el}</Link>;
    }

    elements.push(<span key={`${start}-${end}`} className={className}>{el}</span>);
  }

  return elements;
};

/**
 * Render RichText content (document or legacy spans) in JSX
 */
export function renderRichText(content: RichTextContent) {
  if (content === null || content === undefined) return null;

  let doc: RichTextDocument | null = null;

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (isDocument(parsed)) {
        doc = parsed;
      }
    } catch {
      // It's just a plain string, render as is.
      return <>{content}</>;
    }
  } else if (isDocument(content)) {
    doc = content;
  }

  if (doc) {
    return <>{renderDoc(doc)}</>;
  }

  return <>{String(content)}</>;
}
