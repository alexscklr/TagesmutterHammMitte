import { Link } from "react-router-dom";
import "./Footer.css"
import { useContext } from "react";
import { LoginPopup } from "@/features/auth/components/LoginPopup/LoginPopup";
import { AuthContext } from "../../features/auth/context/AuthContext";

const Footer = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <footer className="footer">
        <div className="main-content">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/Portrait.png"width="17%" style={{ border: "0px solid black", borderRadius: "50%", margin: "auto" }} />
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
                <button popoverTarget="login-popover" popoverTargetAction="show">Moderator-Login</button>
              )}
            </li>
          </ul>
        </div>
        <p style={{ width: "100%", fontSize: "1rem", padding: "0% 0% 1% 2%", margin: "0" }}>© 2025 Kerstin Sickler – Alle Rechte vorbehalten.</p>

        <div popover="auto" id="login-popover" >
          <LoginPopup closeBtn={<button popoverTarget="login-popover" popoverTargetAction="hide">X</button>}/>
        </div>
      </footer>
    </>
  );
};

export default Footer;