import House from "./../assets/images/house/house.jpg"
import Ducks from "./../assets/images/outside/ducks.jpg"
import KidsOnBridge from "./../assets/images/kids/kidsOnBridge.jpg"
import Bed1 from "./../assets/images/house/bed1.jpg"
import Bed2 from "./../assets/images/house/bed2.jpg"
import Bed3 from "./../assets/images/house/bed3.jpg"
import Cockchafer from "./../assets/images/outside/cockchafer.jpg"
import { Link } from "react-router-dom"

const DasHaus = () => {
  return (
    <div className="page das-haus">
      <h1>Das Haus</h1>
      <h3 style={{ color: "var(--color-accent2)" }}>Weißdornweg 14</h3>
      <section className="page">
        <p>
          Das von meiner Familie bewohnte Haus ist <strong>kindersicher und kindgerecht</strong> ausgestattet. Wir wohnen in einer ruhigen Seitenstraße direkt neben einem Landschaftsschutzgebiet mit <strong>schönen Spazierwegen und in der Nähe eines Reiterhofs</strong>.
        </p>
        <img src={House} width="61%" style={{margin: "2%"}}/>
        <p>
          In unmittelbarer Nähe befindet sich ein Kleingartenverein mit einem großem privaten Spielplatz, mit Wintergarten und Toiletten. Von dem Vorstand habe ich einen Schlüssel für die gesamte Anlage bekommen, damit wir <strong>jederzeit den Spielplatz und die Einrichtung nutzen</strong> können. <br />
          In zu Fuß 20 min. sind wir am <strong>Ententeich</strong>, wo es immer wieder ein Erlebnis für die Kinder ist, den Picknickkorb und die Decken auszupacken, sich an der frischen Luft auszutoben und die Enten zu beobachten.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={Ducks} width="39%" style={{margin: "2%"}}/>
          <img src={KidsOnBridge} width="39%" style={{margin: "2%"}}/>
        </div>
        <p>
          Mit dem <strong>Geschwisterwagen und Buggyboard</strong> schaffen wir den Weg locker auch mit Kindern, die im Laufen noch nicht so sicher sind.<br />
          Die Kinder haben bei mir die Möglichkeit, ihren Mittagsschlaf zu halten. Jedes Kind hat seinen festen Platz am Esstisch und sein eigenes Bettchen.<br />
          Auch Töpfchen stehen bereit.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={Bed1} width="39%" style={{margin: "2%"}}/>
          <img src={Bed2} width="39%" style={{margin: "2%"}}/>
        </div>
        <img src={Bed3} width="61%" style={{margin: "2%"}}/>
        <p>
          Das Freispiel zu erlernen ist wichtig für die Selbstständigkeit des Kindes. Bei uns gibt es <strong>jede Menge Spielsachen</strong> für jede Altersklasse. Außerdem haben wir <strong>Kinder- und Liederbücher sowie Musik-CDs</strong> für die entsprechenden Altersgruppen. Langeweile kann also gar nicht erst aufkommen. Unter dem Link <Link to="/music">musikalische "Früherziehung"</Link> lesen Sie noch mehr über schöne Angebote in unserem Tagesablauf. <br />
          Geben die Eltern dem Kind Wechselsachen mit, sind wir für jedes Wetter gerüstet. Auch der Garten mit Schaukel, Spielhaus, Wippe, Rutschen und Sandkasten und allerlei Fahrzeugen lädt zum Spielen ein. In unmittelbarer Nähe zum Haus gibt es mehrere Spielplätze.
        </p>
        <div style={{display:"flex", justifyContent:"center"}}>
          <img src={Cockchafer} width="61%" style={{margin: "2%"}}/>
        </div>
      </section>
    </div>
  );
};

export default DasHaus;