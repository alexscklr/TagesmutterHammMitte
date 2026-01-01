import { PageBlocks, type PageBlockType } from "./page";

export const BLOCK_TYPE_LABELS: Record<PageBlockType, string> = {
  [PageBlocks.Title]: "Titel",
  [PageBlocks.Heading]: "Überschrift",
  [PageBlocks.Paragraph]: "Absatz",
  [PageBlocks.Quote]: "Zitat",
  [PageBlocks.BouncyText]: "Animated Text",
  [PageBlocks.Imagery]: "Bilder",
  [PageBlocks.List]: "Liste",
  [PageBlocks.Section]: "Sektion mit Überschrift",
  [PageBlocks.Timeline]: "Zeitstrahl",
  [PageBlocks.TimelineEntry]: "Zeitstrahl Eintrag",
  [PageBlocks.InfiniteSlider]: "Unendliche Zeile",
  [PageBlocks.GoogleLocation]: "Google Maps",
  [PageBlocks.ContactForm]: "Kontaktformular",
  [PageBlocks.SplitContent]: "Geteilter Inhalt",
};

export function getDefaultContent(blockType: PageBlockType): unknown {
  switch (blockType) {
    case PageBlocks.Title:
      return { title: [{ text: "Neuer Titel" }] };
    case PageBlocks.Heading:
      return { heading: [{ text: "Neue Überschrift" }] };
    case PageBlocks.Paragraph:
      return { paragraph: [{ text: "Neuer Absatz" }] };
    case PageBlocks.Quote:
      return { quote: [{ text: "Neues Zitat" }], author: "" };
    case PageBlocks.BouncyText:
      return { text: "Neuer Text", speed: 0.05 };
    case PageBlocks.Imagery:
      return { images: [] };
    case PageBlocks.List:
      return { ordered: false, listStyle: "disc", content: [] };
    case PageBlocks.Section:
      return { heading: "", appearance: "default" };
    case PageBlocks.Timeline:
      return { content: [] };
    case PageBlocks.TimelineEntry:
      return { label: "", title: "", timeSpan: "", year: "", yearSpan: "" };
    case PageBlocks.InfiniteSlider:
      return { speed: 0.05, content: [] };
    case PageBlocks.GoogleLocation:
      return { latitude: 0, longitude: 0, zoom: 10 };
    case PageBlocks.ContactForm:
      return { placeholder: "Nachricht..." };
    case PageBlocks.SplitContent:
      return { firstItemWidth: 50, content: [] };
    default:
      return {};
  }
}
