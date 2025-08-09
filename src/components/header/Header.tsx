import { Link } from 'react-router-dom';
import './Header.css';
import HeaderSelect from '../HeaderSelect/HeaderSelect';
import { useEffect, useState } from 'react';
import { useScrollDirection } from '../../hooks/scrollHooks';



const Header = () => {
  const scrollDir = useScrollDirection();

  const [active, setActive] = useState<boolean>(true);

  const onResize = () => {
    if (window.innerWidth > 768) {
      setActive(true);
    }
  };

  const toggleHamburger = () => { setActive(prev => !prev); }
  const toggleHamburgerOnMobile = () => {
    if (window.innerWidth < 768) {
      toggleHamburger();
    }
  }

  useEffect(() => { }, [active]);

  useEffect(() => {

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (scrollDir === 'down') {
      setActive(false);
      onResize();
    }
  }, [scrollDir])

  return (
    <header className={`site-header ${scrollDir === 'up' ? '' : 'inactive'}`}>
      <div className="logo">
        <Link to="/">🌿 Kerstin<br /> Sickler</Link>
      </div>
      <div className="header-content">
        <button className={`hamburger-btn ${active ? "active" : ""}`} onClick={toggleHamburger}>
          <hr />
          <hr />
          <hr />
        </button>
        <nav className={`main-nav ${active ? "visible" : ""}`}>
          <ul>
            <li><Link to="/" onClick={toggleHamburgerOnMobile}>Startseite</Link></li>
            <li><Link to="/ueber-mich" onClick={toggleHamburgerOnMobile}>Über mich</Link></li>
            <li><Link to="/das-haus" onClick={toggleHamburgerOnMobile}>Das Haus</Link></li>
            <li><Link to="/tagesablauf" onClick={toggleHamburgerOnMobile}>Tagesablauf</Link></li>

            <HeaderSelect
              title="Kind & Familie"
              options={[
                { name: 'Beziehung zu den Eltern', path: '/beziehung-zu-den-eltern' },
                { name: 'Eingewöhnung', path: '/eingewoehnung' },
                { name: 'Ernährung', path: '/ernaehrung' }
              ]}
            />

            <li><Link to="/was-mir-wichtig-ist" onClick={toggleHamburgerOnMobile}>Was mir wichtig ist</Link></li>

            <HeaderSelect title="Qualifizierungen"
              options={[
                { name: 'Fort-/Weiterbildungen', path: '/fortbildungen' },
                { name: 'Baumpatenschaft', path: '/baumpatenschaft' },
                { name: 'Hier spielt die Musik!', path: '/musik' }
              ]} />

            <li><Link to="/bildergalerie" onClick={toggleHamburgerOnMobile}>Bildergalerie</Link></li>
            <li><Link to="/freie-plaetze" onClick={toggleHamburgerOnMobile}>Freie Plätze</Link></li>
            <li><Link to="/kontakt" onClick={toggleHamburgerOnMobile}>Kontakt</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
