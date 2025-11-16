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

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { blocks, loading };
}
