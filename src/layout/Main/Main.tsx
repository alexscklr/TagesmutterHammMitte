import { useEffect, useState, type ReactNode } from "react";
import { useParams, useLocation } from "react-router-dom";
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

// Map routes to page slugs for static pages
const getSlugFromPath = (pathname: string): string | null => {
  if (pathname === "/" || pathname === "") return "";
  if (pathname === "/rezensionen") return "rezensionen";
  if (pathname === "/sitemap") return "sitemap";
  // For dynamic pages, return null to use the slug from params
  return null;
};

const Main = ({ children }: { children: ReactNode }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string>(
    "radial-gradient(at 20% 25%, rgba(200, 240, 248, 0.45) 0%, rgba(200, 240, 248, 0) 35%)," +
    "radial-gradient(at 75% 30%, rgba(220, 245, 220, 0.40) 0%, rgba(220, 245, 220, 0) 38%)," +
    "radial-gradient(at 40% 75%, rgba(255, 235, 205, 0.50) 0%, rgba(255, 235, 205, 0) 38%)," +
    "linear-gradient(135deg, #f5f1e8 0%, #f0f5f3 35%, #e8f4f0 100%)," +
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='rgba(100,100,100,0.08)' stroke-width='1'><circle cx='20' cy='18' r='1'/><circle cx='120' cy='90' r='1'/><circle cx='180' cy='40' r='1'/><circle cx='60' cy='150' r='1'/><circle cx='200' cy='180' r='1'/><circle cx='30' cy='200' r='1'/><circle cx='140' cy='200' r='1'/></g></svg>\")," +
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'><g fill='none' stroke='rgba(100,100,100,0.12)' stroke-width='4' stroke-linecap='round'><path d='M20 40c16 18 32 18 48 0'/><path d='M92 30c18 22 36 22 54 0'/><path d='M24 86c14 14 28 14 42 0'/></g></svg>\")"
  );
  const { user, canEdit } = useAuth();
  const { setEditing } = useEditMode();

  // Determine which slug to use: static page mapping or dynamic param
  const effectiveSlug = getSlugFromPath(location.pathname) ?? paramSlug;

  useEffect(() => {
    // Reset meta immediately when route changes
    setMeta(null);
    
    // Fetch page meta (effectiveSlug can be empty string for homepage)
    if (effectiveSlug !== undefined && effectiveSlug !== null) {
      fetchPageMeta(effectiveSlug)
        .then(setMeta)
        .catch(() => setMeta(null));
    }
  }, [effectiveSlug]);

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

  // Initialize edit mode only on mount, not on every auth change
  useEffect(() => {
    setEditing(!!user && canEdit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    let active = true;
    if (meta && meta.background) {
      backgroundStyleToCSS(meta.background).then(style => {
        if (active) setBackgroundStyle(style);
      });
    } else {
      setBackgroundStyle(
        "radial-gradient(at 20% 25%, rgba(200, 240, 248, 0.45) 0%, rgba(200, 240, 248, 0) 35%)," +
        "radial-gradient(at 75% 30%, rgba(220, 245, 220, 0.40) 0%, rgba(220, 245, 220, 0) 38%)," +
        "radial-gradient(at 40% 75%, rgba(255, 235, 205, 0.50) 0%, rgba(255, 235, 205, 0) 38%)," +
        "linear-gradient(135deg, #f5f1e8 0%, #f0f5f3 35%, #e8f4f0 100%)," +
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='rgba(100,100,100,0.08)' stroke-width='1'><circle cx='20' cy='18' r='1'/><circle cx='120' cy='90' r='1'/><circle cx='180' cy='40' r='1'/><circle cx='60' cy='150' r='1'/><circle cx='200' cy='180' r='1'/><circle cx='30' cy='200' r='1'/><circle cx='140' cy='200' r='1'/></g></svg>\")," +
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120'><g fill='none' stroke='rgba(100,100,100,0.12)' stroke-width='4' stroke-linecap='round'><path d='M20 40c16 18 32 18 48 0'/><path d='M92 30c18 22 36 22 54 0'/><path d='M24 86c14 14 28 14 42 0'/></g></svg>\")"
      );
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