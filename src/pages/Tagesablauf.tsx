import House from "./../assets/images/house/house.jpg"
import Library from "./../assets/images/outside/library.jpg"
import FireDepartment from "./../assets/images/outside/fireDepartment.png"
import Bed1 from "./../assets/images/house/bed1.jpg"
import Bed2 from "./../assets/images/house/bed2.jpg"
import KidsFingerPaint from "./../assets/images/kids/kidsFingerPaint.jpg"
import KidsPuddle from "./../assets/images/kids/kidsPuddle.jpg"
import KidsChalk from "./../assets/images/kids/kidsChalk.jpg"

import { Timeline } from "../components/Timeline/Timeline"

const timelineData = [
  {
    time: "ab 07:00",
    title: "Frühstück",
    description: (
      <>
        <p>Die ersten zwei von fünf Tageskinder kommen zurzeit gegen <strong>7.00 Uhr</strong>. </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={House} width="61%" style={{ margin: "2%" }} />
        </div>
      </>
    )
  },
  {
    time: "09:00",
    title: "Frühstückspause",
    description: (
      <>
        <p>Gegen ca. <strong>9.00 Uhr</strong> machen wir alle eine kleine Frühstückspause.</p>
      </>
    )
  },
  {
    time: "09:30",
    title: "Spaziergang",
    description: (
      <>
        <p>
          Gegen ca. <strong>9.30 Uhr</strong> gehen wir meistens raus. Zum Spazierengehen, in den Wald, auf den Spielplatz oder was uns sonst so einfällt. Manche Ausflüge bleiben den Kindern noch lange in Erinnerung, z.B. die Bücherei, der Bahnhof, der Maxipark oder natürlich der Tierpark. Die Marktstandbetreuer der Innenstadt kennen uns schon, und auch manche Eltern ermöglichen es uns, sie bei der Arbeit zu besuchen (Feuerwehr, Kindergarten).
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={Library} width="39%" style={{ margin: "2%" }} />
          <img src={FireDepartment} width="39%" style={{ margin: "2%" }} />
        </div>
      </>
    )
  },
  {
    time: "12:00",
    title: "Mittagessen & Mittagsruhe",
    description: (
      <>
        <p>
          Das Mittagessen bereite ich oft schon am Vortag vor. Je nach Fähigkeiten des Kindes können sie manchmal auch gern helfen. Auch bei den Mahlzeiten bin ich flexibel. Jüngere Kinder nehmen manchmal ihr Mittagessen schon früher oder später ein.  <br />
          Sodann findet die Mittagsruhe statt, in der die Kinder die Möglichkeit haben, in drei Zimmern aufgeteilt zu schlafen. Auf die mittäglichen Schlafgewohnheiten des einzelnen Kindes nehme ich natürlich Rücksicht.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={Bed1} width="39%" style={{ margin: "2%" }} />
          <img src={Bed2} width="39%" style={{ margin: "2%" }} />
        </div>
      </>
    )
  },
  {
    time: "ab 14:00",
    title: "Spielen & Spazieren",
    description: (
      <>
        <p>
          Auch die Nachmittage werden je nach Belieben gefüllt. Wir sind im Garten oder spielen, malen, besuchen Spielplätze oder kochen und backen.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={KidsFingerPaint} width="39%" style={{ margin: "2%" }} />
          <img src={KidsPuddle} width="39%" style={{ margin: "2%" }} />
        </div>
      </>
    )
  },
  {
    time: "Nachmittag",
    title: "Abholung",
    description: (
      <>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={KidsChalk} style={{ margin: "2%" }} />
        </div>
      </>
    )
  },
];


const Tagesablauf = () => {
  return (
    <div className="page tagesablauf">
      <h1>Tagesablauf</h1>
      <section className="page">
        <p>
          Ein <strong>geregelter Tagesablauf</strong> liegt mir sehr am Herzen. Deshalb gibt es bei mir für viele tägliche Abläufe geregelte Zeiten. Das bringt Routine in den Alltag und die Kinder können sich besser orientieren. Das gilt für <strong>Mahlzeiten, Hausaufgaben, Spielzeiten und Ruhezeiten, etc.</strong>
        </p>
      </section>

      <Timeline data={timelineData} />
    </div>
  );
};

export default Tagesablauf;