import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { getPageIdBySlug, getPageBlocks } from "../lib";
import { PageBlocks, type PageBlock } from "@/features/pages/types/page";

export function usePageBlocks(slug: string) {
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageId, setPageId] = useState<string | null>(null);

  // Update a nested block by id without refetching everything
  const updateBlockContent = (tree: PageBlock[], id: string, content: unknown): PageBlock[] => {
    return tree.map(block => {
      if (block.id === id) {
        return { ...block, content } as PageBlock;
      }

      if (block.type === PageBlocks.Section || block.type === PageBlocks.InfiniteSlider) {
        const children = (block.content as any).content || [];
        const nextChildren = updateBlockContent(children, id, content);
        return { ...block, content: { ...(block.content as any), content: nextChildren } } as PageBlock;
      }

      if (block.type === PageBlocks.Timeline) {
        const timelineContent = block.content as any;
        const childBlocks = timelineContent.content || [];
        const nextChildBlocks = updateBlockContent(childBlocks, id, content);
        const nextEntries = nextChildBlocks.map((entry: any) => entry.content);
        return { ...block, content: { ...timelineContent, content: nextChildBlocks, entries: nextEntries } } as PageBlock;
      }

      if (block.type === PageBlocks.TimelineEntry || block.type === PageBlocks.List) {
        const childContent = (block.content as any).content || [];
        const nextChildContent = updateBlockContent(childContent, id, content);
        return { ...block, content: { ...(block.content as any), content: nextChildContent } } as PageBlock;
      }

      return block;
    });
  };

  // Initialize: fetch pageId and initial blocks
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setBlocks([]);
      const pid = await getPageIdBySlug(slug);
      if (cancelled) return;
      setPageId(pid);

      if (!pid) {
        setBlocks([]);
        setLoading(false);
        return;
      }

      const blocksData = await getPageBlocks(pid);
      if (!cancelled) {
        setBlocks(blocksData);
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Event-based updates (window events) - depends on pageId
  useEffect(() => {
    if (!pageId) return;

    const fetchBlocks = async () => {
      const blocksData = await getPageBlocks(pageId);
      setBlocks(blocksData);
    };

    const onUpdated = (ev: Event) => {
      const ce = ev as CustomEvent<{ id: string; content: unknown } | undefined>;
      const detail = ce.detail;
      if (detail && typeof detail.id === "string") {
        setBlocks(prev => updateBlockContent(prev, detail.id, detail.content));
      } else {
        fetchBlocks();
      }
    };
    window.addEventListener("pageblocks:updated", onUpdated as EventListener);

    return () => {
      window.removeEventListener("pageblocks:updated", onUpdated as EventListener);
    };
  }, [pageId]);

  // Realtime Updates via Supabase (insert/update/delete) scoped to page
  useEffect(() => {
    if (!pageId) return;

    let cancelled = false;

    const refetch = async () => {
      const data = await getPageBlocks(pageId);
      if (!cancelled) setBlocks(data);
    };

    const channel = supabase
      .channel(`page-blocks-${pageId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_blocks", filter: `page_id=eq.${pageId}` },
        (payload) => {
          if (payload.eventType === "UPDATE" && payload.new && "id" in payload.new) {
            setBlocks(prev => updateBlockContent(prev, (payload.new as any).id, (payload.new as any).content));
          } else {
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [pageId]);

  return { blocks, loading };
}
