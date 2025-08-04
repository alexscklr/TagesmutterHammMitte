import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/header/Header';
import Footer from './components/footer/Footer'; // optional, wenn du einen Footer planst

// Seiten-Komponenten (diese musst du anlegen!)
import Startseite from './pages/Startseite';
import UeberMich from './pages/UeberMich';
import DasHaus from './pages/DasHaus';
import Tagesablauf from './pages/Tagesablauf';
import Beziehung from './pages/Beziehung';
import Eingewoehnung from './pages/Eingewoehnung';
import Ernaehrung from './pages/Ernaehrung';
import WasMirWichtigIst from './pages/WasMirWichtigIst';
import Fortbildungen from './pages/Fortbildungen';
import Baumpatenschaft from './pages/Baumpatenschaft';
import Musik from './pages/Musik';
import Bildergalerie from './pages/Bildergalerie';
import FreiePlaetze from './pages/FreiePlaetze';
import Kontakt from './pages/Kontakt';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Sitemap from './pages/Sitemap';

const App = () => {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/ueber-mich" element={<UeberMich />} />
          <Route path="/das-haus" element={<DasHaus />} />
          <Route path="/tagesablauf" element={<Tagesablauf />} />
          <Route path="/beziehung-zu-den-eltern" element={<Beziehung />} />
          <Route path="/eingewoehnung" element={<Eingewoehnung />} />
          <Route path="/ernaehrung" element={<Ernaehrung />} />
          <Route path="/was-mir-wichtig-ist" element={<WasMirWichtigIst />} />
          <Route path="/fortbildungen" element={<Fortbildungen />} />
          <Route path="/baumpatenschaft" element={<Baumpatenschaft />} />
          <Route path="/musik" element={<Musik />} />
          <Route path="/bildergalerie" element={<Bildergalerie />} />
          <Route path="/freie-plaetze" element={<FreiePlaetze />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/sitemap" element={<Sitemap />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
