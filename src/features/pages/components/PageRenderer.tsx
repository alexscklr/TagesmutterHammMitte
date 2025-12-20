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

export const InsertBlockButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleInsert = async () => {
    setLoading(true);
    setResult(null);
    const { error } = await supabase.from("page_blocks").insert([
      {
        id: crypto.randomUUID(),
        page_id: "c8572950-69b0-45b5-a0b6-ad2448113b66",
        type: "paragraph",
        content: { paragraph: [{ text: "Dies ist ein Texttext" }] },
        order: 2,
        created_at: new Date().toISOString(),
        parent_block_id: "4a5bf9d4-e198-494d-8492-13e8782ecc30",
      },
    ]);
    if (error) setResult("Fehler: " + error.message);
    else setResult("Block erfolgreich eingefügt!");
    setLoading(false);
  };

  return (
    <div style={{ margin: "2rem 0" }}>
      <button onClick={handleInsert} disabled={loading}>
        {loading ? "Einfügen..." : "Block einfügen"}
      </button>
      {result && <div>{result}</div>}
    </div>
  );
};


const PageRenderer = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blocks, loading } = usePageBlocks(slug || "");

  const { user } = useContext(AuthContext);
  const { selectedBlock, setSelectedBlock } = useSelection();

  useEffect(() => {
    scrollTo(0, 0);
  }, [slug]);



  if (loading) return <Loading />
  if (!slug || blocks.length === 0) return <Error message="Seite nicht gefunden" />;

  return (
    <div className={styles.page}>
      {user && <InsertBlockButton />}
      {blocks.map((block, index) => (
        <div
          key={index}
          className={`${styles.blockWrapper} ${selectedBlock?.id === block.id ? styles.selected : ""}`}
          onClick={() => user && setSelectedBlock(block)}
        >
          {renderPageBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default PageRenderer;
