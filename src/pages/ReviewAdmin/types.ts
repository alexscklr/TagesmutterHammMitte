export interface ReviewToken {
  id: string;
  token: string;
  created_at: string;
  expires_at: string | null;
  is_used: boolean;
}
