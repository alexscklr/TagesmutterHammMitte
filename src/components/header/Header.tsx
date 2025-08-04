// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import HeaderSelect from '../HeaderSelect/HeaderSelect';

const Header = () => {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) navigate(path);
  };

  return (
    <header className="site-header">
      <div className="logo">
        <Link to="/">🌿 Kerstin Sickler</Link>
      </div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/">Startseite</Link></li>
          <li><Link to="/ueber-mich">Über mich</Link></li>
          <li><Link to="/das-haus">Das Haus</Link></li>
          <li><Link to="/tagesablauf">Tagesablauf</Link></li>

          <HeaderSelect
            title="Kind & Familie"
            options={[
              { name: 'Beziehung zu den Eltern', path: '/beziehung-zu-den-eltern' },
              { name: 'Eingewöhnung', path: '/eingewoehnung' },
              { name: 'Ernährung', path: '/ernaehrung' }
            ]}
          />

          <li><Link to="/was-mir-wichtig-ist">Was mir wichtig ist</Link></li>

          <HeaderSelect title="Qualifizierungen"
            options={[
              { name: 'Fort-/Weiterbildungen', path: '/fortbildungen' },
              { name: 'Baumpatenschaft', path: '/baumpatenschaft' },
              { name: 'Hier spielt die Musik!', path: '/musik' }
            ]} />

          <li><Link to="/bildergalerie">Bildergalerie</Link></li>
          <li><Link to="/freie-plaetze">Freie Plätze</Link></li>
          <li><Link to="/kontakt">Kontakt</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
