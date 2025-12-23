import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import type { PageMeta } from "./types/types";
import { fetchPageMeta } from "./lib/queries";
import { backgroundStyleToCSS } from "./utils/translations";
import styles from "./Main.module.css";
import EditingSidebar from "@/layout/AdminSidebar/AdminSidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SelectionProvider } from "@/features/admin/context/SelectionContext";
import { EditingProvider } from "@/features/admin/context/EditingContext";
import { useSelection } from "@/features/admin/context/hooks/useSelection";
import { useEditMode } from "@/features/admin/hooks/useEditMode";
// save logic is now provided by EditingContext

const Main = ({ children }: { children: ReactNode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string>(
    "linear-gradient(0deg, rgba(255,255,255,0.6), rgba(255,255,255,0.6))"
  );
  const { user, canEdit } = useAuth();
  const { setEditing } = useEditMode();

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

  // Ensure edit mode toggles for users with edit permission
  useEffect(() => {
    setEditing(!!user && canEdit);
  }, [user, canEdit, setEditing]);

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
    <SelectionProvider>
      <EditingProvider>
      {/* Sidebar für Benutzer mit Bearbeitungsrechten */}
      {user && canEdit && <SidebarWithSave />}
      <main
        className={`${styles.main} ${user && canEdit ? styles.withSidebar : ""}`}
        style={{ backgroundImage: backgroundStyle }}
      >
        {children}
      </main>
      </EditingProvider>
    </SelectionProvider>
  );
};

const SidebarWithSave = () => {
  const { selectedBlock } = useSelection();

  return (
    <EditingSidebar
      open={true}
      selectedBlock={selectedBlock ?? undefined}
    />
  );
};

export default Main;