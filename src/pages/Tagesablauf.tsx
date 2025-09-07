import { usePageBlocks } from "@/features/pageBlocks/hooks/usePageBlocks";
import { PageSlugs } from "@/constants/slugs";
import { renderPageBlock } from "@/features/pageBlocks/components/PageBlockRenderer";


const timelineData = [
  {
    label: "TEST",
    timeSpan: ["00:00", "06:00"] as [string, string],
    title: "Ankunft",
    description: [
      {
        "text": "Die ersten zwei von fünf Tageskinder kommen zurzeit gegen "
      },
      {
        "text": "7.00 Uhr",
        "bold": true
      },
      {
        "text": "."
      }
    ],
    image_urls: [
      "https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/house.jpg",
      ""
    ]
  },
  {
    label: "ab 07:00",
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
    label: "09:00",
    timeSpan: ["09:00", "9:30"] as [string, string],
    title: "Frühstückspause",
    description: (
      <>
        <p>Gegen ca. <strong>9.00 Uhr</strong> machen wir alle eine kleine Frühstückspause.</p>
      </>
    )
  },
  {
    label: "09:30",
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
    label: "12:00",
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
    label: "ab 14:00",
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
    label: "Nachmittag",
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

  const { blocks, loading } = usePageBlocks(PageSlugs.DailyRoutine);

  if (blocks.length == 0 && loading) {
    return <p>LOADING ...</p>
  }


  return (
    <section className="page tagesablauf">
      {blocks.map((block, index) => (
        <div key={index}>{renderPageBlock(block)}</div>
      ))}

    </section>

  );
};

export default Tagesablauf;