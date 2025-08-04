import BaumpatenschaftArtikel1 from "./../assets/BaumpatenschaftArtikel.png"
import BaumpatenschaftArtikel2 from "./../assets/BaumpatenschaftArtikel2.png"

const Baumpatenschaft = () => {
  return (
    <div className="page baumpatenschaft">
      <h1>Baumpatenschaft</h1>
      <section className="page">
        <p>
          Im Frühjahr 2021 haben wir die Möglichkeit erhalten, eine Patenschaft für einen Baum in unserer direkten Nachbarschaft  zu übernehmen. Dabei lernen die Kleinen viel über den naturwissenschaftlichen Aspekt und die Wertschätzung der Natur gegenüber. Wir beobachten ihn beim Wachsen und lernen auch die verschiedenen Jahreszeiten näher kennen. Die Kinder entfernen Unkraut und pflanzen auch mal bienen-freundliche Stauden. "Unser Baum" wird von uns gegossen, gehegt und gepflegt.
        </p>
        <div style={{display: "flex", justifyContent:"center"}}>
          <img src={BaumpatenschaftArtikel1} width="45%" style={{margin: "2%"}}/>
          <img src={BaumpatenschaftArtikel2} width="45%" style={{margin: "2%"}}/>
        </div>
        <p style={{fontSize:"1rem"}}>Quelle: HammMagazin (06/2021) Seite 12 & 13: <a href="https://epaper.hamm-magazin.de/Hammmagazin_06_2021/epaper/ausgabe.pdf">https://epaper.hamm-magazin.de/Hammmagazin_06_2021/epaper/ausgabe.pdf</a></p>
      </section>
    </div>
  );
};

export default Baumpatenschaft;