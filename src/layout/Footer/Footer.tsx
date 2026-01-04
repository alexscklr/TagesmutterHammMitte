import styles from "./Footer.module.css";
import { useEffect, useState } from "react";
import { getFooterBlocks } from "../Footer/lib";
import { FooterBlocks, type FooterBlock } from "./types";
import { renderFooterBlock } from "./components/FooterBlockRenderer";
import redoxBg from "/redox-01.png";

const Footer = () => {

  const [footerBlocks, setFooterBlocks] = useState<FooterBlock[]>([]);

  useEffect(() => {
    getFooterBlocks().then(setFooterBlocks);
  }, []);

  const topBlocks = footerBlocks.filter(b => b.type !== FooterBlocks.CopyrightNotice);
  const copyright = footerBlocks.find(b => b.type === FooterBlocks.CopyrightNotice);

  return (
    <footer className={styles.footer} style={{ backgroundImage: `url(${redoxBg})` }}>
      <div className={styles.mainContent}>
        {topBlocks.map(renderFooterBlock)}
      </div>

      {/* Copyright muss direktes Kind von .footer sein */}
      {copyright && renderFooterBlock(copyright)}
    </footer>
  );
};

export default Footer;