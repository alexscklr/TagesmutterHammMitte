import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { FaStar } from "react-icons/fa";
import { GrSend } from "react-icons/gr";
import styles from "./ReviewSubmit.module.css";

const ReviewSubmit: React.FC = () => {
    const [params] = useSearchParams();
    const token = params.get("token") ?? "";

    const [authorName, setAuthorName] = useState("");
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Kein Token angegeben. Bitte den Link aus der Einladung verwenden.");
            return;
        }
        setSubmitting(true);
        setError(null);

        try {
            const { error: rpcError } = await supabase.rpc("submit_review", {
                p_token: token,
                p_author_name: authorName || "Anonym",
                p_rating: rating,
                p_comment: comment,
            });

            if (rpcError) {
                throw rpcError;
            }

            setSuccess(true);
            setAuthorName("");
            setRating(5);
            setComment("");
        } catch (e) {
            console.error("Fehler beim Absenden der Bewertung:", e);
            const message = e instanceof Error ? e.message : "Unbekannter Fehler";
            setError(message || "Ungültiges oder bereits verwendetes Token.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <h1>Bewertung abgeben</h1>
                {!token && (
                    <div className={styles.error}>Kein Token angegeben. Bitte den Link aus der Einladung verwenden.</div>
                )}

                {success && (
                    <div className={styles.success}>Danke für deine Bewertung!</div>
                )}

                {error && !success && (
                    <div className={styles.error}>{error}</div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span>Name (optional)</span>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Max Mustermann"
                        />
                    </label>

                    <label className={styles.field}>
                        <span>Bewertung</span>
                        <div className={styles.stars} role="radiogroup" aria-label="Bewertung wählen">
                            {[5,4,3,2,1].map((value) => (
                                <React.Fragment key={value}>
                                    <input
                                        className={styles.starInput}
                                        type="radio"
                                        id={`rating-${value}`}
                                        name="rating"
                                        value={value}
                                        checked={rating === value}
                                        onChange={() => setRating(value)}
                                    />
                                    <label
                                        className={styles.starLabel}
                                        htmlFor={`rating-${value}`}
                                        style={{ order: 5 - value }} // Kehrt die Anzeige visuell um
                                    >
                                        <FaStar />
                                    </label>
                                </React.Fragment>
                            ))}
                        </div>
                    </label>

                    <label className={styles.field}>
                        <span>Kommentar</span>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Wie war deine Erfahrung?"
                            rows={4}
                            required
                        />
                    </label>

                    <button className={styles.submit} type="submit" disabled={submitting || !token}>
                        {submitting ? "Sende..." : <>Bewertung absenden <GrSend /></>}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ReviewSubmit;
