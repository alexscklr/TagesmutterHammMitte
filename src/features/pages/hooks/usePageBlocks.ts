import { useEffect, useState } from "react";
import { getPageIdBySlug, getPageBlocks } from "../lib";
import type { PageBlock } from "@/features/pages/types/page";

export function usePageBlocks(slug: string) {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBlocks = async () => {
      setLoading(true);
      setBlocks([]); // reset
      const pageId = await getPageIdBySlug(slug);
      if (!pageId) {
        if (!cancelled) {
          setBlocks([]);
          setLoading(false);
        }
        return;
      }

      const blocksData = await getPageBlocks(pageId);

      if (!cancelled) {
        setBlocks(blocksData);
        setLoading(false);
      }
    };

    fetchBlocks();

    const onUpdated = (ev: Event) => {
      const ce = ev as CustomEvent<{ id: string; content: unknown } | undefined>;
      const detail = ce.detail;
      if (detail && typeof detail.id === "string") {
        setBlocks(prev => prev.map(b => (b.id === detail.id ? { ...b, content: detail.content as any } : b)));
      } else {
        // No payload; fallback to refetch
        fetchBlocks();
      }
    };
    window.addEventListener("pageblocks:updated", onUpdated as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener("pageblocks:updated", onUpdated as EventListener);
    };
  }, [slug]);

  return { blocks, loading };
}
