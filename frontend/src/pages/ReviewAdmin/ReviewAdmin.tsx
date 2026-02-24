import React, { useEffect, useState, useCallback } from "react";
import styles from "./ReviewAdmin.module.css";
import { CreateLinkSection } from "./components/CreateLinkSection";
import { TokensTableSection } from "./components/TokensTableSection";
import { ReviewImageGenerator } from "./components/ReviewImageGenerator";
import {
    fetchTokens,
    createReviewToken,
    deleteReviewToken,
    deleteExpiredTokens,
    deleteUsedTokens,
    extendTokenValidity,
} from "./lib/reviewTokens";
import { formatDate, isTokenExpired } from "./utils/tokenHelpers";
import type { ReviewToken } from "./types";

const ReviewAdmin: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [tokensLoading, setTokensLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewLink, setReviewLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [validityDays, setValidityDays] = useState<number | null>(null);
    const [tokens, setTokens] = useState<ReviewToken[]>([]);

    const loadTokens = useCallback(async () => {
        setTokensLoading(true);
        try {
            const data = await fetchTokens();
            setTokens(data);
        } catch (e) {
            console.error("Fehler beim Laden der Tokens:", e);
            setError(e instanceof Error ? e.message : "Fehler beim Laden der Tokens");
        } finally {
            setTokensLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTokens();
    }, [loadTokens]);

    const createToken = async () => {
        setError(null);
        setLoading(true);
        setReviewLink(null);

        try {
            const token = await createReviewToken(validityDays);
            const link = `${window.location.origin}/review?token=${token}`;
            setReviewLink(link);
            console.log("Link für den Kunden:", link);
            await loadTokens();
        } catch (e) {
            console.error("Fehler beim Erstellen des Review-Tokens:", e);
            setError(e instanceof Error ? e.message : "Unbekannter Fehler");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (!reviewLink) return;

        try {
            await navigator.clipboard.writeText(reviewLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Fehler beim Kopieren:", e);
        }
    };

    const deleteToken = async (id: string) => {
        try {
            await deleteReviewToken(id);
            setTokens((prev) => prev.filter((t) => t.id !== id));
        } catch (e) {
            console.error("Fehler beim Löschen:", e);
            setError(e instanceof Error ? e.message : "Fehler beim Löschen");
        }
    };

    const handleDeleteExpiredTokens = async () => {
        try {
            await deleteExpiredTokens();
            await loadTokens();
        } catch (e) {
            console.error("Fehler beim Löschen abgelaufener Tokens:", e);
            setError(e instanceof Error ? e.message : "Fehler beim Löschen");
        }
    };

    const handleDeleteUsedTokens = async () => {
        try {
            await deleteUsedTokens();
            await loadTokens();
        } catch (e) {
            console.error("Fehler beim Löschen benutzter Tokens:", e);
            setError(e instanceof Error ? e.message : "Fehler beim Löschen");
        }
    };

    const handleExtendTokenValidity = async (id: string, days: number | null) => {
        try {
            await extendTokenValidity(id, days);
            await loadTokens();
        } catch (e) {
            console.error("Fehler beim Erweitern der Gültigkeit:", e);
            setError(e instanceof Error ? e.message : "Fehler beim Erweitern");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Review-Verwaltung</h1>
                    <p className={styles.subtitle}>Erstelle und verwalte Review-Links für Kunden</p>
                </div>
            </div>

            <div className={styles.content}>
                <CreateLinkSection
                    validityDays={validityDays}
                    onValidityChange={setValidityDays}
                    onCreate={createToken}
                    loading={loading}
                    error={error}
                    reviewLink={reviewLink}
                    copied={copied}
                    onCopy={copyToClipboard}
                />

                {reviewLink && (
                    <ReviewImageGenerator
                        reviewLink={reviewLink}
                        onDownload={() => console.log("Bild heruntergeladen")}
                    />
                )}

                <TokensTableSection
                    tokensLoading={tokensLoading}
                    tokens={tokens}
                    onDeleteToken={deleteToken}
                    onExtendToken={handleExtendTokenValidity}
                    onDeleteExpired={handleDeleteExpiredTokens}
                    onDeleteUsed={handleDeleteUsedTokens}
                    formatDate={formatDate}
                    isTokenExpired={isTokenExpired}
                />
            </div>
        </div>
    );
};

export default ReviewAdmin;
