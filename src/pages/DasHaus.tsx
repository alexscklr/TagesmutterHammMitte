import { Link } from "react-router-dom"

const DasHaus = () => {

  return (
    <div className="page house">
      <h1>Das Haus</h1>
      <h3 style={{ color: "var(--color-accent2)" }}>Weißdornweg 14</h3>
      <section className="page">
        <p>
          Das von meiner Familie bewohnte Haus ist <strong>kindersicher und kindgerecht</strong> ausgestattet. Wir wohnen in einer ruhigen Seitenstraße direkt neben einem Landschaftsschutzgebiet mit <strong>schönen Spazierwegen und in der Nähe eines Reiterhofs</strong>.
        </p>
        <div className="single-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/house.jpg" />
        </div>
        <p>
          In unmittelbarer Nähe befindet sich ein Kleingartenverein mit einem großem privaten Spielplatz, mit Wintergarten und Toiletten. Von dem Vorstand habe ich einen Schlüssel für die gesamte Anlage bekommen, damit wir <strong>jederzeit den Spielplatz und die Einrichtung nutzen</strong> können. <br />
          In zu Fuß 20 min. sind wir am <strong>Ententeich</strong>, wo es immer wieder ein Erlebnis für die Kinder ist, den Picknickkorb und die Decken auszupacken, sich an der frischen Luft auszutoben und die Enten zu beobachten.
        </p>
        <div className="double-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/ducks.jpg" />
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsOnBridge.jpg" />
        </div>
        <p>
          Mit dem <strong>Geschwisterwagen und Buggyboard</strong> schaffen wir den Weg locker auch mit Kindern, die im Laufen noch nicht so sicher sind.<br />
          Die Kinder haben bei mir die Möglichkeit, ihren Mittagsschlaf zu halten. Jedes Kind hat seinen festen Platz am Esstisch und sein eigenes Bettchen.<br />
          Auch Töpfchen stehen bereit.
        </p>
        <div className="double-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed1.jpg" />
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed2.jpg" />
        </div>
        <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/bed3.jpg" />
        <p>
          Das Freispiel zu erlernen ist wichtig für die Selbstständigkeit des Kindes. Bei uns gibt es <strong>jede Menge Spielsachen</strong> für jede Altersklasse. Außerdem haben wir <strong>Kinder- und Liederbücher sowie Musik-CDs</strong> für die entsprechenden Altersgruppen. Langeweile kann also gar nicht erst aufkommen. Unter dem Link <Link to="/music">musikalische "Früherziehung"</Link> lesen Sie noch mehr über schöne Angebote in unserem Tagesablauf. <br />
          Geben die Eltern dem Kind Wechselsachen mit, sind wir für jedes Wetter gerüstet. Auch der Garten mit Schaukel, Spielhaus, Wippe, Rutschen und Sandkasten und allerlei Fahrzeugen lädt zum Spielen ein. In unmittelbarer Nähe zum Haus gibt es mehrere Spielplätze.
        </p>
        <div className="single-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/cockchafer.jpg" />
        </div>
      </section>
    </div>
  );
};

export default DasHaus;