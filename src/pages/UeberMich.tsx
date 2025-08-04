import { BouncyText } from "../components/BouncyText/BouncyText";
import { calculateAge } from "../utilities/dates";


const UeberMich = () => {
  return (
    <div className="page about-me">
      <h1>ÜBER MICH</h1>

      <section style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "800px", fontSize: "1.5rem" }}>
        <div className="info-box">
          👋 <strong>Hallo, ich bin Kerstin Sickler</strong> – Tagesmutter mit Herz und Erfahrung.<br />
          Ich bin 1971 geboren und habe drei klasse Kinder im Alter von {calculateAge(new Date(2006, 3, 9))}, {calculateAge(new Date(2004, 4, 7))} und {calculateAge(new Date(1998, 11, 14))}.
        </div>

        <div className="info-box">
          📚 <strong>Seit Anfang 2009</strong> bin ich durch das Jugendamt Hamm ausgebildete Kindertagespflegeperson.
          Seit Juni 2021 habe ich zusätzlich 320 Unterrichtseinheiten nach dem neuesten Qualifizierungshandbuches Kindertagespflege abgeschlossen (eine bessere Qualifikation gibt es nicht!)  ☺.
        </div>

        <div className="info-box">
          🏡 Ich wohne im Weißdornweg (eine <strong>ruhige Sackgasse</strong>) in einem Ein-Familien-Reihenhaus <strong>mit Garten</strong>.<br />
          Es sind <strong>keine</strong> Hunde oder Katzen im Haus.<br />
          Der Caldenhofer Weg ist <strong>ca. 3 min</strong> zu Fuß entfernt. Dort fährt regelmäßig die <strong>Buslinie 4</strong>.
        </div>

        <div className="info-box">
          📞 Für weitere Informationen kontaktieren Sie mich gerne per <strong>Telefon über <span style={{fontSize:"1rem"}}><BouncyText
            text="02381 - 31366"
            amplitude={5}
            duration={500}
            pauseDuration={2000}
            characterDelay={80}
            frequency={1}
            style={{fontSize:"1.5rem", display:"inline", padding:"0"}}
          /></span></strong>.
        </div>

        <div className="info-box">
          🧒 Je nach Alter der zu betreuenden Kinder stehe ich gern für <strong>maximal fünf Tageskinder</strong> zur Verfügung – auch am Wochenende, feiertags oder nachts nach Absprache.
        </div>

        <div className="info-box">
          🎓 Ich besuche regelmäßig Fortbildungsangebote des Jugendamtes.<br />
          An Erste-Hilfe-Kursen für Kleinkinder nehme ich <strong>alle zwei Jahre</strong> teil.
        </div>

        <div className="info-box">
          🧠 Seit 2009 hat sich in der Frühpädagogik viel verändert. Deshalb habe ich mich 2021 umfassend weitergebildet – mit weiteren <strong>160 Unterrichtseinheiten</strong> im Juni 2021.
        </div>

        <div className="info-box">
          💪 Seit Dezember 2020 bin ich außerdem zertifizierte <strong>Gesundheitsmanagerin in der Kindertagespflege</strong>.
        </div>
      </section>
    </div>

  );
};

export default UeberMich;