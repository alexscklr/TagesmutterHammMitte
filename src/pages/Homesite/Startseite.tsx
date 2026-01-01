import { BouncyText } from "@/shared/components";
import { Link } from "react-router-dom";
import { GoogleLocation } from "@/shared/components/GoogleLocation/GoogleLocation";
import styles from "./Startseite.module.css";
import { getImageUrl } from "@/shared/lib/imageQueries";
import { useEffect, useState } from "react";
import { List } from "@/shared/components/List/List";
import type { PageBlock, TimelineEntry } from "@/features/pages/types";
import { getCurrentTimelineEntry } from "@/shared/lib/getCurrentTimelineEntry";
import { renderPageBlock } from "@/features/pages/components";
import Portrait from "/Portrait.webp";




const Startseite = () => {

  const [portraitURL, setPortraitURL] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<TimelineEntry | null>(null);
  const [currentEntryChildren, setCurrentEntryChildren] = useState<PageBlock[]>([]);


  useEffect(() => {
    const fetchImageUrl = async () => {
      const url = await getImageUrl("Portrait.png", "public_images", 300);
      setPortraitURL(url);
    };

    fetchImageUrl();
  }, []);

  useEffect(() => {
    const fetchCurrentTimelineEntry = async () => {
      const { entryBlock, children } = await getCurrentTimelineEntry();
      setCurrentEntry((entryBlock?.content as TimelineEntry) ?? null);
      setCurrentEntryChildren(children);
    };

    fetchCurrentTimelineEntry();
  }, []);


  return (
    <section className={styles.page}>
      <h1>Maxi – Kids</h1>
      <p style={{ color: "var(--color-accent2)", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Motto" aria-description="Das Motto der Tagesmutter">
        <span style={{ color: "var(--color-neutral-400)" }}>♫♪</span>
        <span style={{ color: "var(--color-accent2)", margin: "0 8px" }}>
          <BouncyText
            text="- Hier spielt die Musik -"
            amplitude={8}
            duration={1000}
            pauseDuration={2000}
            characterDelay={50}
            frequency={1}
          />
        </span>
        <span style={{ color: "var(--color-neutral-400)" }}>♪♫♪</span>
      </p>

      <section className={styles.section} aria-label={"Personenvorstellung"} aria-description="Vorstellung der Tagesmutter Kerstin Sickler">
        <div className={styles.sectionContent}>
          <div className={styles.portraitSection}>
            {portraitURL && <img src={Portrait} className={styles.portraitImg} alt="Portrait von Kerstin Sickler mit einem Tageskind" fetchPriority="high"/>}
            <h2 className={styles.portraitHeading}>Kerstin Sickler</h2>
            <div className={styles.portraitText}>
              <List content={[<>Tagesmutter seit 2009</>, <>Gesundheitsmanagerin in der Kindertagespflege seit 2020,</>, <>Mutter von drei Söhnen</>]} listStyle="none" ordered={false} />
            </div>
          </div>
        </div>
        <div className={styles.sectionLinks}>
          <Link to="/ueber-mich" aria-label={"Mehr über mich"} aria-description="Link zur Unterseite mit weiteren Informationen über Kerstin Sickler">Mehr über mich</Link>
        </div>
      </section>

      <section className={styles.section} aria-label={"Standort und Kontakt"} aria-description="Adresse und Kontaktinformationen der Tagesmutter">
        <div className={styles.sectionContent}>
          <h2>Kontakt & Standort</h2>
          <div className={styles.location}>
            <List content={[
              <>Weißdornweg 14</>,
              <>59063 Hamm</>,
              <>Tel.: 02381/31366</>,
              <>E-Mail.: <a href="mailto:kerstin.sickler@web.de">kerstin.sickler@web.de</a></>
            ]} listStyle="none" ordered={false} />
            
            <GoogleLocation
              embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d510.1946516924802!2d7.843872191452154!3d51.67641419936322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b976ab41c346e9%3A0xceb6b152f4a95450!2sWei%C3%9Fdornweg%2C%2059063%20Hamm!5e1!3m2!1sde!2sde!4v1766867332884!5m2!1sde!2sde"
            />
          </div>
        </div>
        <div className={styles.sectionLinks}>
          <Link to="/kontakt">Zur Kontaktseite</Link>
        </div>
      </section>

      {currentEntry ? (
        <section className={styles.section} aria-label={"Aktueller Tagesablauf"} aria-description="Anzeige des aktuell aktiven Tagesabschnitts">
          <div className={styles.sectionContent}>
            <div className={styles.timelineEntrySection}>
              <div className={styles.timelineHeader}>
                <div className={styles.liveCircle}>
                  <div className={styles.liveCircleInner}></div>
                  <div className={styles.liveCircleOuter1}></div>
                  <div className={styles.liveCircleOuter2}></div>
                </div>
                <h2>Was wir gerade machen</h2>
              </div>
              <div className={styles.currentTimelineEntry}>
                <h3>{currentEntry.title}</h3>
                {currentEntryChildren.map(block => (
                  <div key={block.id}>{renderPageBlock(block)}</div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.sectionLinks}>
            <Link to="/tagesablauf">Zum Tagesablauf</Link>
          </div>
        </section>
      ) : <></>}

      <section className={styles.section} aria-label={"Pädagogischer Schwerpunkt"} aria-description="Kurze Einführung in den pädagogischen Schwerpunkt der Tagesmutter">
        <div className={styles.sectionContent}>
          <h2>Pädagogische Schwerpunkte</h2>
          <List content={[
            <>Musikalische Früherziehung</>,
            <>Bewegungsförderung</>,
            <>Gesundheitsförderung</>,
            <>Individuelle Entwicklungsbegleitung</>,
            <>Soziale Kompetenz und Gemeinschaftserfahrung</>]
          } listStyle="disc" ordered={false} />
        </div>
        <div className={styles.sectionLinks}>
          <Link to="/musik">Mehr über "Hier spielt die Musik"</Link>
          <Link to="/fortbildungen">Mehr über meine Qualifizierung</Link>
        </div>
      </section>




    </section>
  );
};

export default Startseite;