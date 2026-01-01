import { useEffect, useState } from "react";
import { FaBold, FaItalic, FaUnderline, FaLink, FaPencil, FaTrash, FaPlus } from "react-icons/fa6";
import { RiFunctionAddLine } from "react-icons/ri";
import styles from "./RichTextEditor.module.css";
import type { RichTextSpan, LinkType } from "@/shared/types/RichTextSpan";
import { InlineFunctions, type InlineFunction, type InlineFunctionType } from "@/shared/types/InlineFunctions";
import { renderRichText } from "@/shared/utils";
import { PageSlugs, type PageSlug } from "@/constants/slugs";


const StyleButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type="button"
        className={`${styles.button} ${active ? styles.active : ""}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const ParameterInput = ({ type, label, value, onChange }: { type: string; label: string; value: string | number | undefined; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <input type={type} value={value || ""} onChange={onChange} className={styles.input} placeholder={label} />
);

function isAgeInlineFunction(fn: InlineFunction | undefined): fn is InlineFunction<typeof InlineFunctions.Age> {
    return fn?.type === InlineFunctions.Age;
}
function isBouncyTextInlineFunction(fn: InlineFunction | undefined): fn is InlineFunction<typeof InlineFunctions.BouncyText> {
    return fn?.type === InlineFunctions.BouncyText;
}

interface RichTextEditorProps {
    value: RichTextSpan[];
    onChange: (value: RichTextSpan[]) => void;
}

const initialSpan: RichTextSpan = { text: "" };

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const [spans, setSpans] = useState<RichTextSpan[]>(value);
    const [current, setCurrent] = useState<RichTextSpan>(initialSpan);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showInlineFn, setShowInlineFn] = useState(false);

    // Keep local spans in sync when parent value changes (e.g., refetch)
    useEffect(() => {
        setSpans(value);
    }, [value]);

    const handleLinkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrent((prev) => ({ ...prev, linkUrl: e.target.value || undefined }));
    };

    const handleLinkSlugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrent((prev) => ({ ...prev, linkSlug: (e.target.value || undefined) as PageSlug | undefined }));
    };

    const handleLinkTypeChange = (linkType: LinkType) => {
        setCurrent((prev) => ({
            ...prev,
            linkType,
            linkSlug: linkType === "internal" ? prev.linkSlug : undefined,
            linkUrl: linkType === "external" ? prev.linkUrl : undefined,
        }));
    };

    const applyStyle = (
        style: keyof Omit<RichTextSpan, "text" | "inlineFunction">,
        value?: boolean
    ) => {
        setCurrent((prev) => ({
            ...prev,
            [style]:
                typeof value === "boolean"
                    ? value
                    : typeof prev[style] === "boolean"
                        ? !prev[style]
                        : true,
        }));
    };

    // Inline Function Auswahl
    const handleInlineFnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const fnType = e.target.value as InlineFunctionType;
        if (!fnType) {
            setCurrent((prev) => ({ ...prev, inlineFunction: undefined }));
            return;
        }
        if (fnType === InlineFunctions.Age) {
            setCurrent((prev) => ({
                ...prev,
                inlineFunction: {
                    type: InlineFunctions.Age,
                    value: { date: "" },
                },
            }));
        } else if (fnType === InlineFunctions.BouncyText) {
            setCurrent((prev) => ({
                ...prev,
                inlineFunction: {
                    type: InlineFunctions.BouncyText,
                    value: {},
                },
            }));
        }
    };

    // Inline Function Payloads
    const handleInlineFnPayload = (field: string, value: string) => {
        setCurrent((prev) => ({
            ...prev,
            inlineFunction: prev.inlineFunction
                ? {
                    ...prev.inlineFunction,
                    value: {
                        ...prev.inlineFunction.value,
                        [field]: value,
                    },
                }
                : undefined,
        }));
    };

    const commitSpan = () => {
        if (current.text.trim() === "") return;
        let next: RichTextSpan[];
        if (editingIndex === null) {
            next = [...spans, current];
        } else {
            next = [...spans];
            next[editingIndex] = current;
        }
        setSpans(next);
        onChange(next);
        setCurrent(initialSpan);
        setEditingIndex(null);
        setShowLinkInput(!!current.linkType);
        setShowInlineFn(!!current.inlineFunction);
    };

    // optional helper removed; explicit commits via button







    return (
        <div className={styles.editor}>
            <div className={styles.toolbar}>
                <StyleButton active={!!current.bold} onClick={() => applyStyle("bold")} >
                    <FaBold />
                </StyleButton>
                <StyleButton active={!!current.italic} onClick={() => applyStyle("italic")}>
                    <FaItalic />
                </StyleButton>
                <StyleButton active={!!current.underline} onClick={() => applyStyle("underline")}>
                    <FaUnderline />
                </StyleButton>
                <StyleButton active={!!current.accent} onClick={() => applyStyle("accent")}>
                    <span style={{ color: "var(--color-accent)" }}>A</span>
                </StyleButton>
                <StyleButton active={!!current.linkType} onClick={() => setShowLinkInput((v) => !v)}>
                    <FaLink />
                </StyleButton>
                <StyleButton active={!!current.inlineFunction} onClick={() => setShowInlineFn((v) => !v)}>
                    <RiFunctionAddLine />
                </StyleButton>
            </div>
            <textarea
                className={styles.input}
                value={current.text}
                onChange={e => setCurrent(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Text eingeben..."
                rows={2}
            />
            {showLinkInput && (
                <div className={styles.linkBox}>
                    <div className={styles.linkTypeToggle}>
                        <button
                            type="button"
                            className={`${styles.button} ${current.linkType === "internal" ? styles.active : ""}`}
                            onClick={() => handleLinkTypeChange("internal")}
                        >
                            Unterseite
                        </button>
                        <button
                            type="button"
                            className={`${styles.button} ${current.linkType === "external" ? styles.active : ""}`}
                            onClick={() => handleLinkTypeChange("external")}
                        >
                            Externe Seite
                        </button>
                    </div>
                    
                    {current.linkType === "internal" && (
                        <select value={current.linkSlug || ""} onChange={handleLinkSlugChange} className={styles.input} >
                            <option value="">-- Seite wählen --</option>
                            {Object.entries(PageSlugs).map(([key, slug]) => (
                                <option key={key} value={slug}>
                                    {slug ? `${slug}` : "Startseite"}
                                </option>
                            ))}
                        </select>
                    )}
                    
                    {current.linkType === "external" && (
                        <input className={styles.input} type="url" value={current.linkUrl || ""} onChange={handleLinkInput} placeholder="https://example.com" />
                    )}
                </div>
            )}
            {showInlineFn && (
                <div className={styles.inlineFnBox}>
                    <select
                        value={current.inlineFunction?.type || ""}
                        onChange={handleInlineFnChange}
                        className={styles.input}
                    >
                        <option value="">Keine Inline Function</option>
                        <option value={InlineFunctions.Age}>Alter berechnen</option>
                        <option value={InlineFunctions.BouncyText}>BouncyText</option>
                    </select>
                    {isAgeInlineFunction(current.inlineFunction) && (
                        <ParameterInput
                            type="date"
                            label="Geburtsdatum"
                            value={current.inlineFunction.value.date}
                            onChange={e =>
                                handleInlineFnPayload("date", e.target.value)
                            }
                        />
                    )}

                    {isBouncyTextInlineFunction(current.inlineFunction) && (
                        <>
                            <ParameterInput
                                type="number"
                                label="Amplitude"
                                value={current.inlineFunction.value.amplitude}
                                onChange={e =>
                                    handleInlineFnPayload("amplitude", e.target.value)
                                }
                            />
                            <ParameterInput
                                type="number"
                                label="Dauer"
                                value={current.inlineFunction.value.duration}
                                onChange={e =>
                                    handleInlineFnPayload("duration", e.target.value)
                                }
                            />
                            <ParameterInput
                                type="number"
                                label="Pause-Dauer"
                                value={current.inlineFunction.value.pauseDuration}
                                onChange={e =>
                                    handleInlineFnPayload("pauseDuration", e.target.value)
                                }
                            />
                            <ParameterInput
                                type="number"
                                label="Zeichen-Amplitude"
                                value={current.inlineFunction.value.characterDelay}
                                onChange={e =>
                                    handleInlineFnPayload("characterDelay", e.target.value)
                                }
                            />
                            <ParameterInput
                                type="number"
                                label="Frequenz"
                                value={current.inlineFunction.value.frequency}
                                onChange={e =>
                                    handleInlineFnPayload("frequency", e.target.value)
                                }
                            />
                            {/* Weitere Felder analog */}
                        </>
                    )}
                </div>
            )}
            <button className={styles.addBtn} type="button" onClick={commitSpan}>
                {editingIndex === null ? <><FaPlus /> Hinzufügen</> : "Aktualisieren"}
            </button>
            <div className={styles.preview}>
                {renderRichText(spans)}
            </div>
            <div className={styles.preview}>
                {spans.map((span, i) => (
                    <div key={i} className={styles.previewLine}>
                        {renderRichText([span])}
                        <button
                            className={styles.button}
                            type="button"
                            onClick={() => {
                                setCurrent(span);
                                setEditingIndex(i);
                                setShowLinkInput(!!span.linkType);
                                setShowInlineFn(!!span.inlineFunction);
                            }}
                            aria-label="Bearbeiten"
                            title="Bearbeiten"
                        >
                            <FaPencil />
                        </button>
                        <button
                            className={styles.removeBtn}
                            type="button"
                            onClick={() => {
                                const newValue = [...spans];
                                newValue.splice(i, 1);
                                onChange(newValue);
                                setSpans(newValue);
                            }}
                            aria-label="Entfernen"
                            title="Entfernen"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RichTextEditor;