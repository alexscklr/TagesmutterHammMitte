import { useParams } from "react-router-dom";
import { renderPageBlock } from ".";
import { usePageBlocks } from "../hooks";
import { useContext, useEffect, useState } from "react";
import { Loading } from "@/shared/components/index";
import { Error } from "@/shared/components/index";
import styles from "./PageRenderer.module.css";
import { supabase } from "@/supabaseClient";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
import type { PageBlock } from "../types/page";
import { AddBlockButton } from "./AddBlockButton";
import { getDefaultContent } from "./blockDefaults";


const PageRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blocks, loading } = usePageBlocks(slug || "");

  const { user } = useContext(AuthContext);
  const { selectedBlock, setSelectedBlock } = useSelection();

  useEffect(() => {
    scrollTo(0, 0);
  }, [slug]);

  if (loading) return <Loading />
  if (!slug) return <Error message="Slug nicht gefunden" />;
  if (blocks.length === 0) return <Error message="Seite nicht gefunden" />;

  return (
    <div className={styles.page}>
      <PageRendererContent 
        blocks={blocks} 
        slug={slug}
        user={user}
        selectedBlock={selectedBlock}
        setSelectedBlock={setSelectedBlock}
      />
    </div>
  );
};

interface PageRendererContentProps {
  blocks: PageBlock[];
  slug: string;
  user: any;
  selectedBlock: PageBlock | null;
  setSelectedBlock: (block: PageBlock) => void;
}

const PageRendererContent: React.FC<PageRendererContentProps> = ({
  blocks,
  slug,
  user,
  selectedBlock,
  setSelectedBlock,
}) => {
  const [pageId, setPageId] = useState<string | null>(null);
  const { isEditing } = useEditMode();

  useEffect(() => {
    const fetchPageId = async () => {
      const { getPageIdBySlug } = await import("../lib/pageQueries");
      const id = await getPageIdBySlug(slug);
      setPageId(id);
    };
    fetchPageId();
  }, [slug]);

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
    content.push(
      <div
        key={block.id}
        className={`${styles.blockWrapper} ${selectedBlock?.id === block.id ? styles.selected : ""}`}
        onClick={() => user && setSelectedBlock(block)}
        style={{
          minHeight: isEditing ? "48px" : undefined,
          padding: isEditing ? "4px 0" : undefined,
          cursor: isEditing ? "pointer" : undefined,
          position: "relative",
        }}
      >
        {renderPageBlock(block)}
      </div>
    );

    // AddBlockButton nach jedem Block
    if (pageId) {
      content.push(renderAddButton(block.order + 1, null));
    }
  });

  return content;
};

export default PageRenderer;
