import { Link } from "react-router-dom";
import Titelbild from "./../../assets/Titelbild.png"
import "./Footer.css"
import { useState, useContext } from "react";
import { LoginPopup } from "@/features/auth/components/LoginPopup/LoginPopup";
import { AuthContext } from "../../features/auth/context/AuthContext";

const Footer = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const openLogin = () => setLoginOpen(true);
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {loginOpen && (<LoginPopup onClose={() => setLoginOpen(false)} />)}
      <footer className="footer">
        <div>
          <img src={Titelbild} width="17%" style={{ border: "0px solid black", borderRadius: "50%", margin: "auto" }} />
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
              {user ? (
                <button onClick={handleLogout}>Log Out</button>
              ) : (
                <button onClick={openLogin}>Moderator-Login</button>
              )}
            </li>
          </ul>
        </div>
        <p style={{ width: "100%", fontSize: "1rem", padding: "0% 0% 1% 2%", margin: "0" }}>© 2025 Kerstin Sickler – Alle Rechte vorbehalten.</p>
      </footer>
    </>
  );
};

export default Footer;