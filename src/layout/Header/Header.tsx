import { useEffect, useState } from 'react';
import { useScrollDirection } from '@/shared/hooks/scrollHooks';
import styles from './Header.module.css';
import { getHeaderBlocks } from './lib/getHeaderBlocks';
import { LogoBlock } from './components/blocks/LogoBlock';
import { LinkBlock } from './components/blocks/LinkBlock';
import { DropdownBlock } from './components/blocks/DropdownBlock';
import type { HeaderBlock } from './types';

const Header = () => {
  const scrollDir = useScrollDirection();
  const [active, setActive] = useState<boolean>(true);
  const [headerBlocks, setHeaderBlocks] = useState<HeaderBlock[]>([]);


  const onResize = () => {
    if (window.innerWidth > 768) {
      setActive(true);
    }
  };

  const toggleHamburger = () => { setActive(prev => !prev); }

  useEffect(() => {
    getHeaderBlocks().then(setHeaderBlocks);
  }, []);

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
  }, [scrollDir]);

  

  
  return (
    <header className={`${styles.siteHeader} ${scrollDir === 'up' ? '' : styles.inactive}`}>
      <div className={styles.logo}>
        {headerBlocks
          .filter(b => b.type === "logo")
          .map(b => <LogoBlock key={b.id} block={b} />)}
      </div>
      <div className={styles.headerContent}>
        <button className={`${styles.hamburgerBtn} ${active ? styles.active : ''}`} onClick={toggleHamburger}>
          <hr />
          <hr />
          <hr />
        </button>
        <nav className={`${styles.mainNav} ${active ? styles.visible : ''}`}>
          <ul>
            {headerBlocks
              .filter(b => b.parent_block_id === null && b.type !== "logo")
              .map(b => {
                if (b.type === "link") {
                  return (
                    <li key={b.id} className={styles.navLink}>
                      <LinkBlock block={b} />
                    </li>
                  );
                }
                if (b.type === "dropdown") {
                  return (
                    <li key={b.id} className={styles.navDropdown}>
                      <DropdownBlock block={b} />
                    </li>
                  );
                }
                return null;
              })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;