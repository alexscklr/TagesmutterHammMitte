import { BouncyText } from "../components/BouncyText/BouncyText";
import { calculateAge } from "../utilities/dates";

import HomePng from "./../assets/Titelbild.png"


const UeberMich = () => {
  return (
    <div className="page about-me">
      <h1>ÜBER MICH</h1>

      <img src={HomePng} width="50%" style={{ border: "0px solid black", borderRadius: "50%" }} />

      <section className="page">
        <p>
          👋 <strong>Hallo, ich bin Kerstin Sickler</strong> – Tagesmutter mit Herz und Erfahrung.<br />
          Ich bin 1971 geboren und habe drei klasse Kinder im Alter von {calculateAge(new Date(2006, 3, 9))}, {calculateAge(new Date(2004, 4, 7))} und {calculateAge(new Date(1998, 12, 14))}.
        </p>

        <p>
          📚 <strong>Seit Anfang 2009</strong> bin ich durch das Jugendamt Hamm ausgebildete Kindertagespflegeperson.
          Seit Juni 2021 habe ich zusätzlich 320 Unterrichtseinheiten nach dem neuesten Qualifizierungshandbuches Kindertagespflege abgeschlossen (eine bessere Qualifikation gibt es nicht!)  ☺.
        </p>

        <p>
          🏡 Ich wohne im Weißdornweg (eine <strong>ruhige Sackgasse</strong>) in einem Ein-Familien-Reihenhaus <strong>mit Garten</strong>.<br />
          Es sind <strong>keine</strong> Hunde oder Katzen im Haus.<br />
          Der Caldenhofer Weg ist <strong>ca. 3 min</strong> zu Fuß entfernt. Dort fährt regelmäßig die <strong>Buslinie 4</strong>.
        </p>

        <p>
          📞 Für weitere Informationen kontaktieren Sie mich gerne per <strong>Telefon über <span style={{fontSize:"1rem"}}><BouncyText
            text="02381 - 31366"
            amplitude={5}
            duration={500}
            pauseDuration={2000}
            characterDelay={80}
            frequency={1}
            style={{fontSize:"1.5rem", display:"inline", padding:"0"}}
          /></span></strong>.
        </p>

        <p>
          🧒 Je nach Alter der zu betreuenden Kinder stehe ich gern für <strong>maximal fünf Tageskinder</strong> zur Verfügung – auch am Wochenende, feiertags oder nachts nach Absprache.
        </p>

        <p>
          🎓 Ich besuche regelmäßig Fortbildungsangebote des Jugendamtes.<br />
          An Erste-Hilfe-Kursen für Kleinkinder nehme ich <strong>alle zwei Jahre</strong> teil.
        </p>

        <p>
          🧠 Seit 2009 hat sich in der Frühpädagogik viel verändert. Deshalb habe ich mich 2021 umfassend weitergebildet – mit weiteren <strong>160 Unterrichtseinheiten</strong> im Juni 2021.
        </p>

        <p>
          💪 Seit Dezember 2020 bin ich außerdem zertifizierte <strong>Gesundheitsmanagerin in der Kindertagespflege</strong>.
        </p>
      </section>
    </div>

  );
};

export default UeberMich;