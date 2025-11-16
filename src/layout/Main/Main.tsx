import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { PageMeta } from "./types/types";
import { fetchPageMeta } from "./lib/queries";
import { backgroundStyleToCSS } from "./utils/translations";
import styles from "./Main.module.css";

const Main = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string>(
    "linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))"
  );

  useEffect(() => {
    if (slug) {
      fetchPageMeta(slug)
        .then(setMeta);
    }
  }, [slug]);

  useEffect(() => {
    if (meta) {
      document.title = meta.sitetitle
        ? `${meta.sitetitle}`
        : meta.title ? `${meta.title} – Kerstin Sickler`
          : "Kerstin Sickler – Kindertagespflege in Hamm Mitte";
    } else {
      document.title = "Kerstin Sickler – Kindertagespflege in Hamm Mitte";
    }
  }, [meta]);

  useEffect(() => {
    let active = true;
    if (meta && meta.background) {
      backgroundStyleToCSS(meta.background).then(style => {
        if (active) setBackgroundStyle(style);
      });
    } else {
      setBackgroundStyle("linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))");
    }
    return () => { active = false; };
  }, [meta]);

  return (
    <main className={styles.main} style={{ backgroundImage: backgroundStyle }}>
      {children}
    </main>
  );
};

export default Main;