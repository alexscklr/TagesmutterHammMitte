import { supabase } from "@/supabaseClient";
import type { ReviewToken } from "../types";

export async function fetchTokens(): Promise<ReviewToken[]> {
  const { data, error } = await supabase
    .from("review_tokens")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ReviewToken[];
}

export async function createReviewToken(validityDays: number | null): Promise<string> {
  const { data: token, error } = await supabase.rpc("generate_review_token", {
    p_days_valid: validityDays,
  });

  if (error) throw error;
  if (!token) throw new Error("Kein Token erhalten");

  return token as string;
}

export async function deleteReviewToken(id: string): Promise<void> {
  const { error } = await supabase.from("review_tokens").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteExpiredTokens(): Promise<void> {
  const { error } = await supabase
    .from("review_tokens")
    .delete()
    .not("expires_at", "is", null)
    .lt("expires_at", new Date().toISOString());

  if (error) throw error;
}

export async function deleteUsedTokens(): Promise<void> {
  const { error } = await supabase.from("review_tokens").delete().eq("is_used", true);
  if (error) throw error;
}

export async function extendTokenValidity(id: string, days: number | null): Promise<void> {
  const newExpiryDate = days
    ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from("review_tokens")
    .update({ expires_at: newExpiryDate })
    .eq("id", id);

  if (error) throw error;
}
