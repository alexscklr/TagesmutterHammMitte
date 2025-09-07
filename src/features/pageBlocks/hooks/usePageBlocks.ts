import { useEffect, useState } from "react";
import { getPageIdBySlug, getPageBlocks } from "@/features/pageBlocks/lib/queries";
import { type PageBlock } from "@/features/pageBlocks/types";
import { deserializePageBlocks } from "../utils/serializing";

export function usePageBlocks(slug: string) {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let timers: NodeJS.Timeout[] = [];

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
      const deserialized = deserializePageBlocks(blocksData);

      deserialized.forEach((block : any, idx : number) => {
        const t = setTimeout(() => {
          if (!cancelled) {
            setBlocks((prev) => [...prev, block]);
          }
        }, idx * 100);
        timers.push(t);
      });

      if (!cancelled) {
        setLoading(false);
      }
    };

    fetchBlocks();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [slug]);

  return { blocks, loading };
}
