import Fortbildungszertifikat from "./../assets/Fortbildungszertifikat.jpg"
import MusikkonzeptZertifikat from "./../assets/MusikkonzeptTeilnahme.png"

const Fortbildungen = () => {
  return (
    <div className="page fortbildungen">
      <h1>Fort- und Weiterbildungen</h1>
      <section className="page">
        <p>
          Gerne nehme ich an diversen Fort- bzw. Weiterbildungs-möglichkeiten teil. Hier stelle ich erst einmal die neuesten Teilnahmebescheinigungen ein.
        </p>
        <img src={Fortbildungszertifikat} width="61%" style={{margin:"2%"}}/>
        <img src={MusikkonzeptZertifikat} width="61%" style={{margin:"2%"}}/>
        <p>
          Und es gab noch viele, viele weitere in den letzten 12 Jahren!<br />
          Sie können mich gern ansprechen, falls Sie bestimmte Schwerpunkte in der Frühpädagogik für besonders wichtig erachten. Vielleicht kenne ich mich ja schon ein wenig damit aus.
        </p>
      </section>
    </div>
  );
};

export default Fortbildungen;