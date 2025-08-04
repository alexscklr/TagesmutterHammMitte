import { BouncyText } from "../components/BouncyText/BouncyText";


const FreiePlaetze = () => {
  return (
    <div className="page freieplaetze">
      <h1>Freie Plätze</h1>
      <section className="page">
        <p>
          Zurzeit kann ich keinen freien Betreuungsplatz anbieten.<br />
          Falls Sie demnächst eine Kinderbetreuung benötigen, können Sie mich natürlich anrufen (<span style={{ fontSize: "1rem" }}><BouncyText
            text="0163-6965106"
            amplitude={5}
            duration={500}
            pauseDuration={2000}
            characterDelay={80}
            frequency={1}
            style={{ fontSize: "1.5rem", display: "inline", padding: "0" }}
          /></span> oder <span style={{ fontSize: "1rem" }}><BouncyText
            text="02381-31366"
            amplitude={5}
            duration={500}
            pauseDuration={2000}
            characterDelay={80}
            frequency={1}
            style={{ fontSize: "1.5rem", display: "inline", padding: "0" }}
          /></span>).
        </p>
      </section>
    </div>
  );
};

export default FreiePlaetze;