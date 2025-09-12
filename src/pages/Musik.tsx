
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
        <p style={{ fontSize: "1.2rem", color: "var(--color-accent)" }}>Ob mit der Ukulele ...</p>
        <div className="single-image-container">
          <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsUkulele.jpg" />
        </div>
        <p style={{ fontSize: "1.2rem", color: "var(--color-accent)" }}>... oder mit dem Xylophon ...</p>
        <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsXylophone.jpg" />
        <p style={{ fontSize: "1.2rem", color: "var(--color-accent)" }}>... oder am Klavier.</p>
        <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsPiano.jpg" />
        <p style={{ fontSize: "1.2rem", color: "var(--color-accent)" }}>Hier spielt die Musik!</p>
        <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/kidsMusic.jpg" />
        <img src="https://iblpmuiruuragdkvurcr.supabase.co/storage/v1/object/public/public_images/instruments.jpg" />
      </section>
    </div>
  );
};

export default Musik;