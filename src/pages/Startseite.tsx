import HomePng from "./../assets/Titelbild.png"
import curvedName1SVG from "./../assets/warpedKindertagespflege.svg"
import curvedName2SVG from "./../assets/warpedKerstinSickler.svg"
import { BouncyText } from "../components/BouncyText/BouncyText";
import { Link } from "react-router-dom";

const Startseite = () => {


  return (
    <div className="page startseite">
      <h1><BouncyText
        text="HERZLICH WILLKOMMEN"
        amplitude={10}
        duration={1000}
        pauseDuration={2000}
        characterDelay={100}
        frequency={1}
        style={{}}
      /></h1>

      <img src={curvedName1SVG} alt="Kindertagespflege" width="100%" />
      <img src={HomePng} width="60%" style={{ border: "0px solid black", borderRadius: "50%" }} />
      <img src={curvedName2SVG} alt="Kerstin Sickler" width="100%" />
      <h3 style={{ lineHeight: "161%" }}>
        Weißdornweg 14<br />
        59063 Hamm<br />
        Tel.: 02381/31366<br />
      </h3>
      <h2 style={{ color: "var(--color-accent2)", display: "flex", alignItems:"center" }} ><Link to="/musik"><span style={{ color: "var(--color-text-medium)" }}>♫♪</span></Link> <BouncyText
        text="- Hier spielt die Musik -"
        amplitude={8}
        duration={1000}
        pauseDuration={2000}
        characterDelay={50}
        frequency={1}
      /> <Link to="/musik"><span style={{ color: "var(--color-text-medium)" }}>♪♫♪</span></Link></h2>

    </div>
  );
};

export default Startseite;