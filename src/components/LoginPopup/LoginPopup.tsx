import React, { useState, useContext } from "react";
import "./LoginPopup.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../firebaseConfig";
import { AuthContext } from "./../../contexts/AuthContext";

interface LoginPopupProps {
  onClose: () => void;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || "Login fehlgeschlagen");
    }
    setLoading(false);
  };

  return (
    <div className="login-popup-backdrop">
      <div className="login-popup" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="close-btn" onClick={onClose} aria-label="Schließen">
          &times;
        </button>
        <h2 id="login-title">Login</h2>
        {!user ? (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            <label htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Anmelden..." : "Anmelden"}
            </button>
          </form>
        ) : (
          <p>Du bist bereits angemeldet als {user.email}</p>
        )}
      </div>
    </div>
  );
};
