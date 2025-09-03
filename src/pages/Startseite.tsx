import HomePng from "@/assets/Titelbild.png"
import curvedName1SVG from "@/assets/warpedKindertagespflege.svg"
import curvedName2SVG from "@/assets/warpedKerstinSickler.svg"
import { BouncyText } from "../components/BouncyText/BouncyText";
import { Link } from "react-router-dom";
import TwoClickEmbed from "@/components/TwoClickEmbed/TwoClickEmbed";

const Startseite = () => {


  return (
    <div className="page homepage">
      <h1><BouncyText
        text="HERZLICH WILLKOMMEN"
        amplitude={10}
        duration={1000}
        pauseDuration={2000}
        characterDelay={100}
        frequency={1}
        style={{ fontSize: "clamp(1rem, 5vw, 3rem)" }}
      /></h1>

      <img src={curvedName1SVG} alt="Kindertagespflege" width="100%" />
      <img src={HomePng} width="60%" style={{ border: "0px solid black", borderRadius: "50%" }} />
      <img src={curvedName2SVG} alt="Kerstin Sickler" width="100%" />
      <h3 style={{ lineHeight: "161%" }}>
        Weißdornweg 14<br />
        59063 Hamm<br />
        Tel.: 02381/31366<br />
      </h3>
      <TwoClickEmbed
        storageKey="googleMapsConsent"
        iframe={
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4948.220125308352!2d7.8418909775612855!3d51.676128398361975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b976ab43473ea9%3A0x95c62314e737cebd!2sWei%C3%9Fdornweg%2014%2C%2059063%20Hamm!5e0!3m2!1sde!2sde!4v1754507115897!5m2!1sde!2sde" width="600" height="450" style={{ border: "0" }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        }
        message="Zum Anzeigen der Karte bitte zustimmen. Mit dem Laden akzeptieren Sie die Datenschutzerklärung von Google."
        buttonLabel="Google Maps laden"
      />
      <h2 style={{ color: "var(--color-accent2)", display: "flex", alignItems: "center", justifyContent:"center" }} >
        <Link to="/musik"><span style={{ color: "var(--color-neutral-400)" }}>♫♪</span></Link>
        <BouncyText
          text="- Hier spielt die Musik -"
          amplitude={8}
          duration={1000}
          pauseDuration={2000}
          characterDelay={50}
          frequency={1}
          style={{ fontSize: "clamp(1rem, 5vw, 3rem)" }}
        />
        <Link to="/musik"><span style={{ color: "var(--color-neutral-400)" }}>♪♫♪</span></Link>
      </h2>
    </div>
  );
};

export default Startseite;