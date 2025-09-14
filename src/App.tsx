import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/App.css';

import { Header, Main, Footer } from '@/layout/index';

// Site-Components

import PageContent from './features/pages/index';
import Startseite from './pages/Startseite';

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/:slug" element={<Main><PageContent /></Main>} />
        <Route path="" element={<Main><Startseite /></Main>} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;