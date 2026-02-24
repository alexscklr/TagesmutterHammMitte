export const PageSlugs = {
    StartingPage: "",
    AboutMe: "ueber-mich",
    House: "das-haus",
    DailyRoutine: "tagesablauf",
    RelationToParents: "beziehung-zu-den-eltern",
    SettlingIn: "eingewoehung",
    Nutrition: "Ernährung",
    ImportantToMe: "was-mir-wichtig-ist",
    FurtherEducation: "fortbildungen",
    TreeSponsorship: "baumpatenschaft",
    Music: "musik",
    Gallery: "bildergalerie",
    FreeSpaces: "freie-plaetze",
    Contact: "kontakt",
    Impressum: "impressum",
    DataProtection: "datenschutz",
    Sitemap: "sitemap"
} as const;

export type PageSlug = typeof PageSlugs[keyof typeof PageSlugs];