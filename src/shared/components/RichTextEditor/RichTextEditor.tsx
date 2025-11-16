import { useState } from "react";
import styles from "./RichTextEditor.module.css";
import type { RichTextSpan } from "@/shared/types/RichTextSpan";
import { InlineFunctions, type InlineFunction, type InlineFunctionType } from "@/shared/types/InlineFunctions";
import { renderRichText } from "@/shared/utils";


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
    const [current, setCurrent] = useState<RichTextSpan>(initialSpan);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showInlineFn, setShowInlineFn] = useState(false);

    const handleLinkInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrent((prev) => ({ ...prev, link: e.target.value || undefined }));
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

    const handleAdd = () => {
        if (current.text.trim() === "") return;
        onChange([...value, current]);
        setCurrent(initialSpan);
        setShowLinkInput(false);
        setShowInlineFn(false);
        console.log("Added span:", current);
    };







    return (
        <div className={styles.editor}>
            <div className={styles.toolbar}>
                <StyleButton
                    active={!!current.bold}
                    onClick={() => applyStyle("bold")}
                >
                    <b>B</b>
                </StyleButton>
                <StyleButton
                    active={!!current.italic}
                    onClick={() => applyStyle("italic")}
                >
                    <i>I</i>
                </StyleButton>
                <StyleButton
                    active={!!current.underline}
                    onClick={() => applyStyle("underline")}
                >
                    <u>U</u>
                </StyleButton>
                <StyleButton
                    active={!!current.accent}
                    onClick={() => applyStyle("accent")}
                >
                    <span style={{ color: "var(--color-accent)" }}>A</span>
                </StyleButton>
                <StyleButton
                    active={!!current.link}
                    onClick={() => setShowLinkInput((v) => !v)}
                >
                    🔗
                </StyleButton>
                <StyleButton
                    active={!!current.inlineFunction}
                    onClick={() => setShowInlineFn((v) => !v)}
                >
                    ⚡
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
                <input
                    className={styles.input}
                    type="url"
                    value={current.link || ""}
                    onChange={handleLinkInput}
                    placeholder="Link-URL (optional)"
                />
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
            <button className={styles.addBtn} type="button" onClick={handleAdd}>
                Hinzufügen
            </button>
            <div className={styles.preview}>
                {renderRichText(value)}
            </div>
            <div className={styles.preview}>
                {value.map((span, i) => (
                    <div key={i} className={styles.previewLine}>
                        {renderRichText([span])}
                        <button
                            className={styles.removeBtn}
                            type="button"
                            onClick={() => {
                                const newValue = [...value];
                                newValue.splice(i, 1);
                                onChange(newValue);
                            }}
                            aria-label="Entfernen"
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RichTextEditor;