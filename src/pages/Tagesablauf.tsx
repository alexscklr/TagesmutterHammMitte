import { Timeline } from "@/components/Timeline/Timeline"
import { fetchDailyRoutine, type TimelineEntry } from "@/lib/dailyroutine"
import { useEffect, useState } from "react"

const title: string = "Tagesablauf";

const description: any = (
  <p>
    Gegen ca. <strong>9.30 Uhr</strong> gehen wir meistens raus. Zum Spazierengehen, in den Wald, auf den Spielplatz oder was uns sonst so einfällt. Manche Ausflüge bleiben den Kindern noch lange in Erinnerung, z.B. die Bücherei, der Bahnhof, der Maxipark oder natürlich der Tierpark. Die Marktstandbetreuer der Innenstadt kennen uns schon, und auch manche Eltern ermöglichen es uns, sie bei der Arbeit zu besuchen (Feuerwehr, Kindergarten).
  </p>
)

const timelineData = [
  {
    time: "ab 07:00",
    timeSpan: ["07:00", "09:00"] as [string, string],
    title: "Ankunft",
    description: (
      <>
        <p>Die ersten zwei von fünf Tageskinder kommen zurzeit gegen <strong>7.00 Uhr</strong>. </p>
        <div className="single-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/house.jpg" />
        </div>
      </>
    )
  },
  {
    time: "09:00",
    timeSpan: ["09:00", "9:30"] as [string, string],
    title: "Frühstückspause",
    description: (
      <>
        <p>Gegen ca. <strong>9.00 Uhr</strong> machen wir alle eine kleine Frühstückspause.</p>
      </>
    )
  },
  {
    time: "09:30",
    timeSpan: ["09:30", "12:00"] as [string, string],
    title: "Spaziergang",
    description: (
      <>

        <div className="double-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/library.jpg" />
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/fireDepartment.png" />
        </div>
      </>
    )
  },
  {
    time: "12:00",
    timeSpan: ["12:00", "14:00"] as [string, string],
    title: "Mittagessen & Mittagsruhe",
    description: (
      <>
        <p>
          Das Mittagessen bereite ich oft schon am Vortag vor. Je nach Fähigkeiten des Kindes können sie manchmal auch gern helfen. Auch bei den Mahlzeiten bin ich flexibel. Jüngere Kinder nehmen manchmal ihr Mittagessen schon früher oder später ein.  <br />
          Sodann findet die Mittagsruhe statt, in der die Kinder die Möglichkeit haben, in drei Zimmern aufgeteilt zu schlafen. Auf die mittäglichen Schlafgewohnheiten des einzelnen Kindes nehme ich natürlich Rücksicht.
        </p>
        <div className="double-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed1.jpg" />
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed2.jpg" />
        </div>
      </>
    )
  },
  {
    time: "ab 14:00",
    timeSpan: ["14:00", "17:00"] as [string, string],
    title: "Spielen & Spazieren",
    description: (
      <>
        <p>
          Auch die Nachmittage werden je nach Belieben gefüllt. Wir sind im Garten oder spielen, malen, besuchen Spielplätze oder kochen und backen.
        </p>
        <div className="double-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsFingerPaint.jpg" />
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsPuddle.jpg" />
        </div>
      </>
    )
  },
  {
    time: "Nachmittag",
    timeSpan: ["14:00", "17:00"] as [string, string],
    title: "Abholung",
    description: (
      <>
        <div className="single-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsChalk.jpg" />
        </div>
      </>
    )
  },
];


const Tagesablauf = () => {

  const [entries, setEntries] = useState<TimelineEntry[]>();

  useEffect(() => {
    const loadDatilyRoutine = async () => {
      const data = await fetchDailyRoutine()
      setEntries(data)
    }

    loadDatilyRoutine();
  }, [])
  

  return (
    <div className="page tagesablauf">
      <h1>{title}</h1>
      <section className="page"> {description} </section>
      <Timeline data={entries || timelineData} />
    </div>
  );
};

export default Tagesablauf;