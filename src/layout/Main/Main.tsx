import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { PageMeta } from "./types/types";
import { fetchPageMeta } from "./lib/queries";
import { backgroundStyleToCSS } from "./utils/translations";

const Main = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [meta, setMeta] = useState<PageMeta | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPageMeta(slug).then(setMeta);
    }
  }, [slug]);

  const style: React.CSSProperties = {
    backgroundImage: meta
      ? backgroundStyleToCSS(meta.background)
      : "linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))",
  };

  return (
    <main style={style}>
      {children}
    </main>
  );
};

export default Main;
