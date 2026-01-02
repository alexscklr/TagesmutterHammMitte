

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllPages, type PageMeta } from "@/features/pages/lib/pageQueries";

const Sitemap = () => {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      const allPages = await fetchAllPages();
      setPages(allPages);
      setLoading(false);
    };
    loadPages();
  }, []);

  return (
    <section className="page">
      <h1>Sitemap</h1>

      {loading ? (
        <p>Lade Seiten...</p>
      ) : (
        <section className="page-section">
          <div className="page-sectionContent">
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {pages.map((page) => (
                <li key={page.id}>
                  <Link to={`/${page.slug}`} style={{ fontSize: "1.1rem", fontWeight: 500 }}>
                    {page.title || page.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </section>
  );
};

export default Sitemap;