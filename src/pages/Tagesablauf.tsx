import House from "./../assets/images/house/house.jpg"
import Library from "./../assets/images/outside/library.jpg"
import FireDepartment from "./../assets/images/outside/fireDepartment.png"
import Bed1 from "./../assets/images/house/bed1.jpg"
import Bed2 from "./../assets/images/house/bed2.jpg"
import KidsPuzzle from "./../assets/images/kids/kidPuzzle1.jpg"
import KidsCrafting from "./../assets/images/kids/kidsCrafting.jpg"
import KidsFingerPaint from "./../assets/images/kids/kidsFingerPaint.jpg"
import KidsPuddle from "./../assets/images/kids/kidsPuddle.jpg"
import KidsChalk from "./../assets/images/kids/kidsChalk.jpg"

const Tagesablauf = () => {
  return (
    <div className="page tagesablauf">
      <h1>Tagesablauf</h1>
      <section className="page">
        <p>
          Ein <strong>geregelter Tagesablauf</strong> liegt mir sehr am Herzen. Deshalb gibt es bei mir für viele tägliche Abläufe geregelte Zeiten. Das bringt Routine in den Alltag und die Kinder können sich besser orientieren. Das gilt für <strong>Mahlzeiten, Hausaufgaben, Spielzeiten und Ruhezeiten, etc.</strong> <br/>
          Die ersten zwei von fünf Tageskinder kommen zurzeit gegen <strong>7.00 Uhr</strong>. Gegen ca. <strong>9.00 Uhr</strong> machen wir alle eine kleine Frühstückspause.
        </p>
        <img src={House} width="40%" style={{margin: "2%"}}/>
        <p>
          Gegen ca. <strong>9.30 Uhr</strong> gehen wir meistens raus. Zum Spazierengehen, in den Wald, auf den Spielplatz oder was uns sonst so einfällt. Manche Ausflüge bleiben den Kindern noch lange in Erinnerung, z.B. die Bücherei, der Bahnhof, der Maxipark oder natürlich der Tierpark. Die Marktstandbetreuer der Innenstadt kennen uns schon, und auch manche Eltern ermöglichen es uns, sie bei der Arbeit zu besuchen (Feuerwehr, Kindergarten).
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={Library} width="30%" style={{margin: "2%"}}/>
          <img src={FireDepartment} width="40%" style={{margin: "2%"}}/>
        </div>
        <p>
          Gegen ca. <strong>12.00 Uhr</strong> wird das Mittagessen angerichtet. Das Mittagessen bereite ich oft schon am Vortag vor. Je nach Fähigkeiten des Kindes können sie manchmal auch gern helfen. Auch bei den Mahlzeiten bin ich flexibel. Jüngere Kinder nehmen manchmal ihr Mittagessen schon früher oder später ein.  <br/>
          Sodann findet die Mittagsruhe statt, in der die Kinder die Möglichkeit haben, in drei Zimmern aufgeteilt zu schlafen. Auf die mittäglichen Schlafgewohnheiten des einzelnen Kindes nehme ich natürlich Rücksicht.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={Bed1} width="33%" style={{margin: "2%"}}/>
          <img src={Bed2} width="33%" style={{margin: "2%"}}/>
        </div>
        <p>
          Auch die <strong>Nachmittage</strong> werden je nach Belieben gefüllt. Wir sind im Garten oder spielen, malen, besuchen Spielplätze oder kochen und backen.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={KidsPuzzle} width="33%" style={{margin: "2%"}}/>
          <img src={KidsCrafting} width="50%" style={{margin: "2%"}}/>
        </div>
        <p>
          Auch die Nachmittage werden je nach Belieben gefüllt. Wir sind im Garten oder spielen, malen, besuchen Spielplätze oder kochen und backen.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={KidsFingerPaint} width="33%" style={{margin: "2%"}}/>
          <img src={KidsPuddle} width="33%" style={{margin: "2%"}}/>
        </div>
        <p>
          Auch die Nachmittage werden je nach Belieben gefüllt. Wir sind im Garten oder spielen, malen, besuchen Spielplätze oder kochen und backen.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={KidsChalk} style={{margin: "2%"}}/>
        </div>
      </section>
    </div>
  );
};

export default Tagesablauf;