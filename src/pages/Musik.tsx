import KidsUkulele from "@/assets/images/music/kidsUkulele.jpg"
import KidsXylophone from "@/assets/images/music/kidsXylophone.jpg"
import KidsPiano from "@/assets/images/music/kidsPiano.jpg"
import KidsMusic from "@/assets/images/music/kidsMusic.jpg"
import Instruments from "@/assets/images/music/instruments.jpg"

const Musik = () => {
  return (
    <div className="page music">
      <h1>Hier spielt die Musik!</h1>
      <section className="page">
        <p>
          Von klein auf spielt Musik in meinem Leben eine große Rolle. Das spiegelt sich natürlich auch sehr zur Freude aller Kinder in meiner Kindertagespflegestelle wider.<br />
          Wir machen hier viel Musik, z.B. <strong>Erzähl- und Klanggeschichten</strong> mit dem Kamishibai (Erzähltheater), <strong>Bewegungs- und Tanzspiele</strong> mit oder ohne Tüchern, Luftballons, oder Regenbogenbändern, <strong>Sing- und Reimspiele</strong> mit und ohne Orff-Instrumenten. Die Kinder lieben es, ins Mikrofon zu singen. Auch unsere Spaziergänge sind oft von Sinnesspielen begleitet.<br />
          Im Wohnzimmer steht ein gern genutztes Klavier. Wir probieren die Kindergitarren oder Blockflöte aus. Wir stellen auch mal unsere Instrumente aus selbst ausgesuchten Küchenutensilien zusammen und machen Geräusche nach, die wir z.B. während eines Spaziergangs gehört haben. Wir lernen laut und leise, langsam und schnell.<br />
        </p>
        <p style={{fontSize:"1.2rem", color:"var(--color-accent)"}}>Ob mit der Ukulele ...</p>
        <img src={KidsUkulele} width="45%" style={{margin: "1%"}}/>
        <p style={{fontSize:"1.2rem", color:"var(--color-accent)"}}>... oder mit dem Xylophon ...</p>
        <img src={KidsXylophone} width="45%" style={{margin: "1%"}}/>
        <p style={{fontSize:"1.2rem", color:"var(--color-accent)"}}>... oder am Klavier.</p>
        <img src={KidsPiano} width="45%" style={{margin: "1%"}}/>
        <p style={{fontSize:"1.2rem", color:"var(--color-accent)"}}>Hier spielt die Musik!</p>
        <img src={KidsMusic} width="45%" style={{margin: "1%"}}/>
        <img src={Instruments} width="45%" style={{margin: "1%"}}/>
      </section>
    </div>
  );
};

export default Musik;