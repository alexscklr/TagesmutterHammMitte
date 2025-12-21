import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/App.css';

import { Header, Main, Footer } from '@/layout/index';

// Site-Components

import { PageRenderer } from './features/pages/index';
import Startseite from './pages/Startseite';
import Sitemap from './pages/Sitemap';
import RichTextEditor from './features/Editors/RichText/RichTextEditor';
import type { RichTextSpan } from './shared/types';
import MediaAdmin from "@/pages/MediaAdmin";
import PageAdmin from "@/pages/PageAdmin";
import { RequireAdmin } from "@/features/auth/components/RequireAdmin";
import { useState } from 'react';

const App = () => {

  const [richText, setRichText] = useState<RichTextSpan[]>([]);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/:slug" element={<Main><PageRenderer /></Main>} />
        <Route path="" element={<Main><Startseite /></Main>} />
        <Route path="sitemap" element={<Main><Sitemap /></Main>} />
        <Route path="test" element={<Main><RichTextEditor value={richText} onChange={setRichText} /></Main>} />
        <Route path="admin/media" element={<Main><RequireAdmin><MediaAdmin /></RequireAdmin></Main>} />
        <Route path="admin/pages" element={<Main><RequireAdmin><PageAdmin /></RequireAdmin></Main>} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
