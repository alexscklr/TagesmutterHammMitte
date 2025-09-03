import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/App.css';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

import { PageSlugs } from '@/constants/slugs';

// Site-Components
import Startseite from '@/pages/Startseite';
import UeberMich from '@/pages/UeberMich';
import DasHaus from '@/pages/DasHaus';
import Tagesablauf from '@/pages/Tagesablauf';
import Beziehung from '@/pages/Beziehung';
import Eingewoehnung from '@/pages/Eingewoehnung';
import Ernaehrung from '@/pages/Ernaehrung';
import WasMirWichtigIst from '@/pages/WasMirWichtigIst';
import Fortbildungen from '@/pages/Fortbildungen';
import Baumpatenschaft from '@/pages/Baumpatenschaft';
import Musik from '@/pages/Musik';
import Bildergalerie from '@/pages/Bildergalerie';
import FreiePlaetze from '@/pages/FreiePlaetze';
import Kontakt from '@/pages/Kontakt';
import Impressum from '@/pages/Impressum';
import Datenschutz from '@/pages/Datenschutz';
import Sitemap from '@/pages/Sitemap';

const App = () => {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path={"/".concat(PageSlugs.StartingPage)} element={<Startseite />} />
          <Route path={"/".concat(PageSlugs.AboutMe)} element={<UeberMich />} />
          <Route path={"/".concat(PageSlugs.House)} element={<DasHaus />} />
          <Route path={"/".concat(PageSlugs.DailyRoutine)} element={<Tagesablauf />} />
          <Route path={"/".concat(PageSlugs.RelationToParents)} element={<Beziehung />} />
          <Route path={"/".concat(PageSlugs.SettlingIn)} element={<Eingewoehnung />} />
          <Route path={"/".concat(PageSlugs.Nutrition)} element={<Ernaehrung />} />
          <Route path={"/".concat(PageSlugs.ImportantToMe)} element={<WasMirWichtigIst />} />
          <Route path={"/".concat(PageSlugs.FurtherEducation)} element={<Fortbildungen />} />
          <Route path={"/".concat(PageSlugs.TreeSponsorship)} element={<Baumpatenschaft />} />
          <Route path={"/".concat(PageSlugs.Music)} element={<Musik />} />
          <Route path={"/".concat(PageSlugs.Gallery)} element={<Bildergalerie />} />
          <Route path={"/".concat(PageSlugs.FreeSpaces)} element={<FreiePlaetze />} />
          <Route path={"/".concat(PageSlugs.Contact)} element={<Kontakt />} />
          <Route path={"/".concat(PageSlugs.Impressum)} element={<Impressum />} />
          <Route path={"/".concat(PageSlugs.DataProtection)} element={<Datenschutz />} />
          <Route path={"/".concat(PageSlugs.Sitemap)} element={<Sitemap />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
