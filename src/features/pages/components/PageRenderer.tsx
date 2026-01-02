import { useParams } from "react-router-dom";
import { renderPageBlock } from ".";
import { usePageBlocks } from "../hooks";
import { useContext, useEffect, useCallback } from "react";
import { Loading } from "@/shared/components/index";
import { Error } from "@/shared/components/index";
import styles from "./PageRenderer.module.css";
import { supabase } from "@/supabaseClient";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import type { PageBlock } from "../types/page";
import { AddBlockButton } from "./AddBlockButton";
import { getDefaultContent } from "../types/blockDefaults";
import { useDragAndDrop } from "@/shared/hooks/useDragAndDrop";
import { applyOrderUpdatesToBlocks, reorderPageBlocks } from "../utils/reorder";
import { updatePageBlockOrders } from "../lib/pageQueries";
import { PageDragProvider } from "./PageDragContext";


const PageRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blocks, loading, pageId, setBlocks } = usePageBlocks(slug || "");

  const { user } = useContext(AuthContext);
  const { selectedBlock, setSelectedBlock } = useSelection();
  const { isEditing } = useEditMode();

  const handleReorder = useCallback(async (sourceId: string, targetId: string) => {
    if (!pageId) return;

    const { changed, updates } = reorderPageBlocks(blocks, sourceId, targetId);
    if (!changed) return;

    const next = applyOrderUpdatesToBlocks(blocks, updates);
    setBlocks(next);

    try {
      await updatePageBlockOrders(pageId, updates);
    } catch (err) {
      console.error("Reorder failed, refetch", err);
      window.dispatchEvent(new Event("pageblocks:updated"));
    }
  }, [blocks, pageId, setBlocks]);

  const drag = useDragAndDrop({ onReorder: handleReorder, disabled: !isEditing });

  useEffect(() => {
    scrollTo(0, 0);
  }, [slug]);

  if (loading) return <Loading />
  if (!slug) return <Error message="Slug nicht gefunden" />;
  if (blocks.length === 0) return <Error message="Seite nicht gefunden" />;

  return (
    <PageDragProvider value={{ drag, isEditing }}>
      <div className={styles.page}>
        <PageRendererContent 
          blocks={blocks} 
          setBlocks={setBlocks}
          slug={slug}
          pageId={pageId}
          user={user}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
        />
      </div>
    </PageDragProvider>
  );
};

interface PageRendererContentProps {
  blocks: PageBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<PageBlock[]>>;
  slug: string;
  pageId: string | null;
  user: any;
  selectedBlock: PageBlock | null;
  setSelectedBlock: (block: PageBlock) => void;
}

const PageRendererContent: React.FC<PageRendererContentProps> = ({
  blocks,
  setBlocks,
  slug,
  pageId,
  user,
  selectedBlock,
  setSelectedBlock,
}) => {
  const { isEditing } = useEditMode();

  // Select newly created blocks when notified
  useEffect(() => {
    const onSelect = (ev: Event) => {
      const ce = ev as CustomEvent<{ id: string; block?: PageBlock }>;
      const detail = ce.detail;
      if (!detail) return;
      if (detail.block) {
        setSelectedBlock(detail.block);
      } else {
        // Fallback: find by id when blocks updated
        const match = blocks.find(b => b.id === detail.id);
        if (match) setSelectedBlock(match);
      }
    };
    window.addEventListener("pageblocks:select", onSelect as EventListener);
    return () => window.removeEventListener("pageblocks:select", onSelect as EventListener);
  }, [blocks, setSelectedBlock]);

  useEffect(() => {
    if (!pageId) return;
    const onInsert = async (ev: Event) => {
      const ce = ev as CustomEvent<{ type: string; order: number; parent_block_id: string | null }>;
      const detail = ce.detail;
      if (!detail) return;
      try {
        const { error } = await supabase.rpc('insert_page_block_and_reorder', {
          p_page_id: pageId,
          p_type: detail.type,
          p_content: getDefaultContent(detail.type as any),
          p_order: detail.order,
          p_parent_block_id: detail.parent_block_id,
        });
        if (error) {
          console.error("Insert error", error);
        }
        // trigger refetch
        window.dispatchEvent(new Event("pageblocks:updated"));
      } catch (err) {
        console.error("Insert handler crashed", err);
      }
    };
    window.addEventListener("pageblocks:insert", onInsert as EventListener);
    return () => window.removeEventListener("pageblocks:insert", onInsert as EventListener);
  }, [pageId]);

  const handleBlockAdded = () => {
    // Trigger refetch durch das pageblocks:updated Event ohne Payload
    window.dispatchEvent(new Event("pageblocks:updated"));
  };

  const renderAddButton = (order: number, parentBlockId?: string | null) => {
    if (!pageId) return null;
    return (
      <AddBlockButton
        key={`add-${order}`}
        pageId={pageId}
        order={order}
        parentBlockId={parentBlockId ?? null}
        onBlockAdded={handleBlockAdded}
      />
    );
  };

  // Berechne die neue Reihenfolge (mit Zwischenräumen für neue Blöcke)
  const content = [];

  // Vor dem ersten Block
  if (pageId) {
    content.push(renderAddButton(0, null));
  }

  // Blöcke mit AddBlockButton dazwischen
  blocks.forEach((block) => {
    content.push(renderPageBlock(block));

    // AddBlockButton nach jedem Block
    if (pageId) {
      content.push(renderAddButton(block.order + 1, null));
    }
  });

  return content;
};

export default PageRenderer;
