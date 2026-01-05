import { useEffect, useRef, useState } from "react";
import { FaBold, FaItalic, FaUnderline, FaLink, FaTrash } from "react-icons/fa6";
import { RiFunctionAddLine } from "react-icons/ri";
import styles from "./RichTextEditor.module.css";
import type {
  LinkType,
  RichTextContent,
  RichTextDocument,
  RichTextRange,
  RichTextSpan,
  LinkRange,
  InlineFunctionRange,
} from "@/shared/types/RichTextSpan";
import { InlineFunctions, type InlineFunction, type InlineFunctionType } from "@/shared/types/InlineFunctions";
import { renderRichText } from "@/shared/components";
import { PageSlugs, type PageSlug } from "@/constants/slugs";

const StyleButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" className={`${styles.button} ${active ? styles.active : ""}`} onClick={onClick}>
    {children}
  </button>
);

const ParameterInput = ({ type, label, value, onChange }: { type: string; label: string; value: string | number | undefined; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <input type={type} value={value || ""} onChange={onChange} className={styles.input} placeholder={label} />
);

const isDoc = (value: RichTextContent): value is RichTextDocument =>
  !!value && typeof value === "object" && !Array.isArray(value) && typeof (value as RichTextDocument).text === "string";

const mergeRanges = (ranges: RichTextRange[]): RichTextRange[] => {
  if (ranges.length === 0) return ranges;
  const sorted = [...ranges].sort((a, b) => a.start - b.start || a.end - b.end);
  const result: RichTextRange[] = [];
  for (const r of sorted) {
    const last = result[result.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
    } else {
      result.push({ ...r });
    }
  }
  return result;
};

const addRange = (ranges: RichTextRange[] = [], start: number, end: number) => {
  if (end <= start) return ranges;
  return mergeRanges([...ranges, { start, end }]);
};

const subtractRange = (ranges: RichTextRange[] = [], start: number, end: number) => {
  if (end <= start) return ranges;
  const result: RichTextRange[] = [];
  for (const r of ranges) {
    if (r.end <= start || r.start >= end) {
      result.push({ ...r });
    } else {
      if (r.start < start) result.push({ start: r.start, end: start });
      if (r.end > end) result.push({ start: end, end: r.end });
    }
  }
  return result;
};

const clampRanges = <T extends RichTextRange>(ranges: T[] | undefined, textLength: number): T[] | undefined => {
  if (!ranges) return ranges;
  return ranges
    .map((r) => ({
      ...r,
      start: Math.max(0, Math.min(r.start, textLength)),
      end: Math.max(0, Math.min(r.end, textLength)),
    }))
    .filter((r) => r.start <= textLength && r.end >= r.start) as T[];
};

const spansToDoc = (spans: RichTextSpan[]): RichTextDocument => {
  let offset = 0;
  const doc: RichTextDocument = { text: "", bold: [], italic: [], underline: [], accent: [], links: [], functions: [] };

  for (const span of spans) {
    const length = span.text.length;
    const start = offset;
    const end = offset + length;
    doc.text += span.text;

    if (span.bold) doc.bold = addRange(doc.bold, start, end);
    if (span.italic) doc.italic = addRange(doc.italic, start, end);
    if (span.underline) doc.underline = addRange(doc.underline, start, end);
    if (span.accent) doc.accent = addRange(doc.accent, start, end);
    if (span.linkType || span.linkUrl || span.linkSlug) {
      doc.links = [...(doc.links || []), { start, end, linkType: span.linkType || "external", linkUrl: span.linkUrl, linkSlug: span.linkSlug }];
    }
    if (span.inlineFunction) {
      const hasLength = end > start;
      const fnStart = hasLength ? start : offset;
      const fnEnd = hasLength ? end : offset;
      doc.functions = [...(doc.functions || []), { start: fnStart, end: fnEnd, inlineFunction: span.inlineFunction }];
    }

    offset = end;
  }

  return doc;
};

const normalizeContent = (content: RichTextContent): RichTextDocument => {
  if (!content) return { text: "" };
  if (isDoc(content)) return content;
  if (Array.isArray(content)) return spansToDoc(content);
  return { text: String(content) };
};

const adjustRangesForTextChange = <T extends RichTextRange>(ranges: T[] | undefined, changeStart: number, changeEndOld: number, changeEndNew: number, newLength: number): T[] | undefined => {
  if (!ranges || ranges.length === 0) return ranges;
  const delta = changeEndNew - changeEndOld;
  const adjusted = ranges.map((r) => {
    // Preserve zero-length markers (e.g., inline Age insertions)
    if (r.start === r.end) {
      if (r.start >= changeEndOld) return { ...r, start: r.start + delta, end: r.end + delta } as T;
      if (r.start > changeStart && r.start < changeEndOld) return { ...r, start: changeStart, end: changeStart } as T;
      return { ...r } as T;
    }
    if (r.end <= changeStart) return { ...r } as T;
    if (r.start >= changeEndOld) return { ...r, start: r.start + delta, end: r.end + delta } as T;
    return { ...r, end: Math.max(changeStart, r.end + delta) } as T;
  });
  return clampRanges(adjusted, newLength);
};

interface RichTextEditorProps {
  value: RichTextContent;
  onChange: (value: RichTextDocument) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [doc, setDoc] = useState<RichTextDocument>(() => normalizeContent(value));
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const skipNotifyRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const [linkType, setLinkType] = useState<LinkType>("external");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkSlug, setLinkSlug] = useState<PageSlug | "">("");
  const [fnType, setFnType] = useState<InlineFunctionType | "">("");
  const [fnDate, setFnDate] = useState("");
  const [fnAmplitude, setFnAmplitude] = useState("");
  const [fnDuration, setFnDuration] = useState("");
  const [fnPauseDuration, setFnPauseDuration] = useState("");
  const [fnCharDelay, setFnCharDelay] = useState("");
  const [fnFrequency, setFnFrequency] = useState("");

  useEffect(() => {
    skipNotifyRef.current = true; // avoid firing onChange when we sync from props
    setDoc(normalizeContent(value));
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const updateDoc = (updater: (prev: RichTextDocument) => RichTextDocument) => {
    setDoc((prev) => updater(prev));
  };

  useEffect(() => {
    if (skipNotifyRef.current) {
      skipNotifyRef.current = false;
      return;
    }
    onChangeRef.current(doc);
  }, [doc]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const selStart = e.target.selectionStart ?? 0;
    const selEnd = e.target.selectionEnd ?? selStart;
    setSelection({ start: selStart, end: selEnd });

    updateDoc((prev) => {
      if (newText === prev.text) return prev;
      const oldText = prev.text;
      const oldLen = oldText.length;
      const newLen = newText.length;

      let prefix = 0;
      while (prefix < oldLen && prefix < newLen && oldText[prefix] === newText[prefix]) prefix++;

      let suffix = 0;
      while (suffix < oldLen - prefix && suffix < newLen - prefix && oldText[oldLen - 1 - suffix] === newText[newLen - 1 - suffix]) {
        suffix++;
      }

      const changeStart = prefix;
      const changeEndOld = oldLen - suffix;
      const changeEndNew = newLen - suffix;

      return {
        text: newText,
        bold: adjustRangesForTextChange(prev.bold, changeStart, changeEndOld, changeEndNew, newLen),
        italic: adjustRangesForTextChange(prev.italic, changeStart, changeEndOld, changeEndNew, newLen),
        underline: adjustRangesForTextChange(prev.underline, changeStart, changeEndOld, changeEndNew, newLen),
        accent: adjustRangesForTextChange(prev.accent, changeStart, changeEndOld, changeEndNew, newLen),
        links: adjustRangesForTextChange(prev.links as RichTextRange[] | undefined, changeStart, changeEndOld, changeEndNew, newLen) as LinkRange[] | undefined,
        functions: adjustRangesForTextChange(prev.functions as RichTextRange[] | undefined, changeStart, changeEndOld, changeEndNew, newLen) as InlineFunctionRange[] | undefined,
      };
    });
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? start;
    setSelection({ start, end });
  };

  const setSelectionRange = (start: number, end: number) => {
    setSelection({ start, end });
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(start, end);
    }
  };

  const toggleStyle = (style: "bold" | "italic" | "underline" | "accent") => {
    if (selection.start === selection.end) return;
    updateDoc((prev) => {
      const ranges = prev[style] || [];
      const covered = ranges.some((r) => r.start <= selection.start && r.end >= selection.end);
      const nextRanges = covered
        ? subtractRange(ranges, selection.start, selection.end)
        : addRange(ranges, selection.start, selection.end);
      return { ...prev, [style]: nextRanges } as RichTextDocument;
    });
  };

  const applyLink = () => {
    if (selection.start === selection.end) return;
    updateDoc((prev) => {
      const remaining = (prev.links || []).filter((r) => r.end <= selection.start || r.start >= selection.end);
      const nextLinks: LinkRange[] = [
        ...remaining,
        {
          start: selection.start,
          end: selection.end,
          linkType,
          linkUrl: linkType === "external" ? linkUrl : undefined,
          linkSlug: linkType === "internal" ? (linkSlug || undefined) : undefined,
        },
      ];
      return { ...prev, links: nextLinks };
    });
  };

  const clearLinkInSelection = () => {
    updateDoc((prev) => ({
      ...prev,
      links: (prev.links || []).filter((r) => r.end <= selection.start || r.start >= selection.end),
    }));
  };

  const removeLinkRange = (range: LinkRange) => {
    updateDoc((prev) => ({
      ...prev,
      links: (prev.links || []).filter((r) => !(r.start === range.start && r.end === range.end && r.linkType === range.linkType && r.linkUrl === range.linkUrl && r.linkSlug === range.linkSlug)),
    }));
  };

  const applyInlineFunction = () => {
    if (!fnType) return;
    if (fnType === InlineFunctions.BouncyText && selection.start === selection.end) return;

    updateDoc((prev) => {
      let inlineFunction: InlineFunction;
      if (fnType === InlineFunctions.Age) {
        inlineFunction = { type: InlineFunctions.Age, value: { date: fnDate } };
      } else {
        inlineFunction = {
          type: InlineFunctions.BouncyText,
          value: {
            amplitude: fnAmplitude ? Number(fnAmplitude) : undefined,
            duration: fnDuration ? Number(fnDuration) : undefined,
            pauseDuration: fnPauseDuration ? Number(fnPauseDuration) : undefined,
            characterDelay: fnCharDelay ? Number(fnCharDelay) : undefined,
            frequency: fnFrequency ? Number(fnFrequency) : undefined,
          },
        };
      }

      const fnRange: InlineFunctionRange = fnType === InlineFunctions.Age
        ? { start: selection.start, end: selection.start, inlineFunction }
        : { start: selection.start, end: selection.end, inlineFunction };

      const remaining = (prev.functions || []).filter((r) => r.end <= fnRange.start || r.start >= (fnType === InlineFunctions.Age ? fnRange.start : fnRange.end));
      return { ...prev, functions: [...remaining, fnRange] };
    });
  };

  const clearInlineFunctionInSelection = () => {
    updateDoc((prev) => ({
      ...prev,
      functions: (prev.functions || []).filter((r) => r.end <= selection.start || r.start >= selection.end),
    }));
  };

  const removeInlineFunctionRange = (range: InlineFunctionRange) => {
    updateDoc((prev) => ({
      ...prev,
      functions: (prev.functions || []).filter((r) => !(r.start === range.start && r.end === range.end && r.inlineFunction?.type === range.inlineFunction?.type)),
    }));
  };

  const removeFormatting = () => {
    updateDoc((prev) => ({
      ...prev,
      bold: subtractRange(prev.bold, selection.start, selection.end),
      italic: subtractRange(prev.italic, selection.start, selection.end),
      underline: subtractRange(prev.underline, selection.start, selection.end),
      accent: subtractRange(prev.accent, selection.start, selection.end),
    }));
  };

  const selectionLength = selection.end - selection.start;

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <StyleButton active={false} onClick={() => toggleStyle("bold")}>
          <FaBold />
        </StyleButton>
        <StyleButton active={false} onClick={() => toggleStyle("italic")}>
          <FaItalic />
        </StyleButton>
        <StyleButton active={false} onClick={() => toggleStyle("underline")}>
          <FaUnderline />
        </StyleButton>
        <StyleButton active={false} onClick={() => toggleStyle("accent")}>
          <span style={{ color: "var(--color-accent)" }}>A</span>
        </StyleButton>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {selectionLength > 0 && (
            <button type="button" className={styles.button} onClick={removeFormatting}>
              <FaTrash /> Formatierung
            </button>
          )}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className={styles.input}
        value={doc.text}
        onChange={handleTextChange}
        onSelect={handleSelect}
        placeholder="Text eingeben..."
        rows={4}
        style={{ width: "100%" }}
      />
      <div style={{ fontSize: "0.85em", color: "#666", marginTop: 4 }}>
        Auswahl: {selection.start}–{selection.end} ({selectionLength} Zeichen)
      </div>

      <div className={styles.linkBox} style={{ marginTop: 12 }}>
        <div className={styles.linkTypeToggle}>
          <button type="button" className={`${styles.button} ${linkType === "internal" ? styles.active : ""}`} onClick={() => setLinkType("internal")}>
            Unterseite
          </button>
          <button type="button" className={`${styles.button} ${linkType === "external" ? styles.active : ""}`} onClick={() => setLinkType("external")}>
            Externe Seite
          </button>
        </div>
        {linkType === "internal" && (
          <select value={linkSlug} onChange={(e) => setLinkSlug(e.target.value as PageSlug | "")} className={styles.input}>
            <option value="">-- Seite wählen --</option>
            {Object.entries(PageSlugs).map(([key, slug]) => (
              <option key={key} value={slug}>
                {slug ? `${slug}` : "Startseite"}
              </option>
            ))}
          </select>
        )}
        {linkType === "external" && (
          <input className={styles.input} type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button type="button" className={styles.button} onClick={applyLink}>
            <FaLink /> Link setzen
          </button>
          <button type="button" className={styles.button} onClick={clearLinkInSelection}>
            <FaTrash /> Link entfernen
          </button>
        </div>
      </div>

      <div className={styles.inlineFnBox} style={{ marginTop: 12 }}>
        <select value={fnType} onChange={(e) => setFnType(e.target.value as InlineFunctionType | "")} className={styles.input}>
          <option value="">Keine Inline Function</option>
          <option value={InlineFunctions.Age}>Alter berechnen</option>
          <option value={InlineFunctions.BouncyText}>BouncyText</option>
        </select>

        {fnType === InlineFunctions.Age && (
          <ParameterInput type="date" label="Geburtsdatum" value={fnDate} onChange={(e) => setFnDate(e.target.value)} />
        )}

        {fnType === InlineFunctions.BouncyText && (
          <>
            <ParameterInput type="number" label="Amplitude" value={fnAmplitude} onChange={(e) => setFnAmplitude(e.target.value)} />
            <ParameterInput type="number" label="Dauer" value={fnDuration} onChange={(e) => setFnDuration(e.target.value)} />
            <ParameterInput type="number" label="Pause-Dauer" value={fnPauseDuration} onChange={(e) => setFnPauseDuration(e.target.value)} />
            <ParameterInput type="number" label="Zeichen-Amplitude" value={fnCharDelay} onChange={(e) => setFnCharDelay(e.target.value)} />
            <ParameterInput type="number" label="Frequenz" value={fnFrequency} onChange={(e) => setFnFrequency(e.target.value)} />
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button type="button" className={styles.button} onClick={applyInlineFunction}>
            <RiFunctionAddLine /> Function setzen
          </button>
          <button type="button" className={styles.button} onClick={clearInlineFunctionInSelection}>
            <FaTrash /> Function entfernen
          </button>
        </div>
      </div>

      {(doc.links?.length ?? 0) > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Aktive Links</div>
          {(doc.links || []).map((lnk, idx) => (
            <div key={`link-${idx}`} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, fontSize: "0.9em" }}>
              <div style={{ flex: 1 }}>
                {lnk.start}–{lnk.end} • {lnk.linkType === "internal" ? lnk.linkSlug || "(Slug fehlt)" : lnk.linkUrl || "(URL fehlt)"}
              </div>
              <button type="button" className={styles.button} onClick={() => setSelectionRange(lnk.start, lnk.end)}>
                Markieren
              </button>
              <button type="button" className={styles.button} onClick={() => removeLinkRange(lnk)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {(doc.functions?.length ?? 0) > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Aktive Functions</div>
          {(doc.functions || []).map((fn, idx) => (
            <div key={`fn-${idx}`} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, fontSize: "0.9em" }}>
              <div style={{ flex: 1 }}>
                {fn.inlineFunction.type} • {fn.start}–{fn.end}
              </div>
              <button type="button" className={styles.button} onClick={() => setSelectionRange(fn.start, fn.end || fn.start)}>
                Markieren
              </button>
              <button type="button" className={styles.button} onClick={() => removeInlineFunctionRange(fn)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.preview} style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Vorschau</div>
        {renderRichText(doc)}
      </div>
    </div>
  );
};

export default RichTextEditor;
