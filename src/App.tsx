import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/App.css';

import { Header, Main, Footer } from '@/layout/index';

// Site-Components
import { PageRenderer } from './features/pages/index';
import Startseite from './pages/Homesite/Startseite';
import ReviewSite from './pages/ReviewSite/Reviews';
import Sitemap from './pages/Sitemap';
import MediaAdmin from "@/pages/MediaAdmin/MediaAdmin";
import PageAdmin from "@/pages/PageAdmin";
import HeaderAdmin from "@/pages/HeaderAdmin/HeaderAdmin";
import FooterAdmin from "@/pages/FooterAdmin";
import { RequireAdmin } from "@/features/auth/components/RequireAdmin";
import { ReviewAdmin } from './pages/ReviewAdmin';
import ReviewSubmit from './pages/ReviewSite/ReviewSubmit';

const App = () => {

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/:slug" element={<Main><PageRenderer /></Main>} />
        <Route path="" element={<Main><Startseite /></Main>} />
        <Route path="rezensionen" element={<Main><ReviewSite /></Main>} />
        <Route path="sitemap" element={<Main><Sitemap /></Main>} />
        <Route path="review" element={<Main><ReviewSubmit /></Main>} />
        <Route path="admin/media" element={<Main><RequireAdmin><MediaAdmin /></RequireAdmin></Main>} />
        <Route path="admin/pages" element={<Main><RequireAdmin><PageAdmin /></RequireAdmin></Main>} />
        <Route path="admin/header" element={<Main><RequireAdmin><HeaderAdmin /></RequireAdmin></Main>} />
        <Route path="admin/footer" element={<Main><RequireAdmin><FooterAdmin /></RequireAdmin></Main>} />
        <Route path="admin/reviews" element={<Main><RequireAdmin><ReviewAdmin /></RequireAdmin></Main>} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
