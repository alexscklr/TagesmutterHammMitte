import { Link } from "react-router-dom";
import "./Footer.css";
import LoginOut from "@/features/auth/components/LoginOut/LoginOut";
import { useEffect, useState } from "react";
import { getFooterBlocks } from "../Footer/lib";
import { FooterBlocks, type FooterBlock } from "./types";
import { renderFooterBlock } from "./components/FooterBlockRenderer";

const Footer = () => {

  const [footerBlocks, setFooterBlocks] = useState<FooterBlock[]>([]);

  useEffect(() => {
    getFooterBlocks().then(setFooterBlocks);
  }, []);

  const topBlocks = footerBlocks.filter(b => b.type !== FooterBlocks.CopyrightNotice);
  const copyright = footerBlocks.find(b => b.type === FooterBlocks.CopyrightNotice);

  return (
    <footer className="footer">
      <div className="main-content">
        {topBlocks.map(renderFooterBlock)}
      </div>

      {/* Copyright muss direktes Kind von .footer sein */}
      {copyright && renderFooterBlock(copyright)}
    </footer>
  );

  return (
    <>
      <footer className="footer">
        <div className="main-content">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/Portrait.png" width="17%" style={{ border: "0px solid black", borderRadius: "50%", margin: "auto" }} />
          <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
            <li>Kerstin Sickler</li>
            <li>Kindertagespflege</li>
            <li>Weißdornweg 14</li>
            <li>59063 Hamm</li>
            <li>02381 31366</li>
            <li>kerstin.sickler@web.de</li>
          </ul>
          <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
            <li><Link to="/kontakt">Kontakt</Link></li>
            <li><Link to="/datenschutz">Datenschutzerklärung</Link></li>
            <li><Link to="/impressum">Impressum</Link></li>
            <li>
              <LoginOut popoverTarget="login-popup" />
            </li>
          </ul>
        </div>
        <p style={{ width: "100%", fontSize: "1rem", padding: "0% 0% 1% 2%", margin: "0" }}>© 2025 Kerstin Sickler – Alle Rechte vorbehalten.</p>
      </footer>
    </>
  );
};

export default Footer;