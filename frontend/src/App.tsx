import { Routes, Route, BrowserRouter as Router } from 'react-router';
import { lazy, Suspense } from 'react'; // 👈 lazy und Suspense importieren
import '@/App.css';

import { Header, Main, Footer } from '@/layout/index';
import { PageRenderer } from './features/pages/index';
import { RequireAdmin } from "@/features/auth/components/RequireAdmin";

// Öffentliche Seiten (bleiben statisch oder werden geladen)
import Startseite from './pages/Homesite/Startseite';
import ReviewSite from './pages/ReviewSite/Reviews';
import Sitemap from './pages/Sitemap';
import ReviewSubmit from './pages/ReviewSite/ReviewSubmit';

const MediaAdmin = lazy(() => import("@/pages/MediaAdmin/MediaAdmin"));
const PageAdmin = lazy(() => import("@/pages/PageAdmin"));
const HeaderAdmin = lazy(() => import("@/pages/HeaderAdmin/HeaderAdmin"));
const FooterAdmin = lazy(() => import("@/pages/FooterAdmin"));
const ReviewAdmin = lazy(() => import('./pages/ReviewAdmin').then(m => ({ default: m.ReviewAdmin })));
const BackupAdmin = lazy(() => import('./pages/BackupAdmin/BackupAdmin'));

const Loading = () => <div className="loading-spinner">Lädt Admin-Bereich...</div>;

const App = () => {
  return (
    <Router>
      <Header />

      <Suspense fallback={<Loading />}>
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
          <Route path="admin/backup" element={<Main><RequireAdmin><BackupAdmin /></RequireAdmin></Main>} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
};

export default App;
