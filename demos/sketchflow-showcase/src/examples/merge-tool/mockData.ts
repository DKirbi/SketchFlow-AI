/** Cast/crew member — name plus their role (character played, or job title). */
export interface CastMember {
  name: string;
  role: string;
}

export type StaffMember = CastMember;

/** Shared shape for a film title, whether it lives in our DB or was crawled. */
export interface FilmRecord {
  id: string;
  title: string;
  /** Native-script or alternate-language title, when different from `title`. */
  originalTitle?: string;
  releaseDate: string;
  genre: string;
  origin: string;
  director: string;
  /** Top 3 cast members shown in the collapsed row. */
  cast: [string, string, string];
  /** Full cast beyond the top 3 — omitted when the crawler/DB has no extra data. */
  fullCast?: CastMember[];
  /** Production staff / crew beyond the credited director — omitted when unavailable. */
  staff?: StaffMember[];
  /** Known filming locations — omitted when unavailable. */
  filmingLocations?: string[];
}

/** A film record as it exists in our own database, with merge audit fields. */
export interface DbFilmRecord extends FilmRecord {
  merged?: boolean;
  mergedAt?: string;
  mergedBy?: string;
}

/** A film record surfaced by the (mocked) movie crawler. */
export interface CrawledRecord extends FilmRecord {
  source: string;
}

/** One candidate returned by the (mocked) suggestion API for a given DB record. */
export interface SuggestionCandidate {
  record: CrawledRecord;
  confidence: number;
}

export const CURRENT_USER = { handle: 'r.okonkwo', role: 'catalogue-ops' };

export function nowTimestamp(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hh}:${mm}`;
}

/** >=80 reads as a likely match; below that, a less likely / decoy match. */
export function matchLabel(confidence: number): string {
  return confidence >= 80 ? `${confidence}% likely match` : `${confidence}% less likely match`;
}

export const FIELD_KEYS = ['title', 'releaseDate', 'genre', 'origin', 'director', 'cast'] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];

export const FIELD_LABELS: Record<FieldKey, string> = {
  title: 'Title',
  releaseDate: 'Release Date',
  genre: 'Genre',
  origin: 'Origin',
  director: 'Director',
  cast: 'Top Cast',
};

export const DB_MOVIES: DbFilmRecord[] = [
  {
    id: 'FSD-1001',
    title: 'Das Leben Der Anderen',
    releaseDate: '23 Mar 2006',
    genre: 'Drama',
    origin: 'Germany',
    director: 'Florian Henckel von Donnersmarck',
    cast: ['Ulrich Mühe', 'Martina Gedeck', 'Sebastian Koch'],
    fullCast: [
      { name: 'Ulrich Mühe', role: 'Gerd Wiesler' },
      { name: 'Martina Gedeck', role: 'Christa-Maria Sieland' },
      { name: 'Sebastian Koch', role: 'Georg Dreyman' },
      { name: 'Ulrich Tukur', role: 'Anton Grubitz' },
      { name: 'Thomas Thieme', role: 'Bruno Hempf' },
    ],
    staff: [
      { name: 'Florian Henckel von Donnersmarck', role: 'Director' },
      { name: 'Hagen Bogdanski', role: 'Cinematographer' },
      { name: 'Gabriel Yared', role: 'Composer' },
    ],
    filmingLocations: ['Berlin, Germany'],
  },
  {
    id: 'FSD-1002',
    title: 'Amelie',
    releaseDate: '25 Apr 2001',
    genre: 'Romantic Comedy',
    origin: 'France',
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'],
    fullCast: [
      { name: 'Audrey Tautou', role: 'Amélie Poulain' },
      { name: 'Mathieu Kassovitz', role: 'Nino Quincampoix' },
      { name: 'Rufus', role: 'Raphael Poulain' },
      { name: 'Yolande Moreau', role: 'Madeleine Wallace' },
      { name: 'Dominique Pinon', role: 'Joseph' },
    ],
    filmingLocations: ['Paris, France', 'Montmartre, France'],
  },
  {
    id: 'FSD-1003',
    title: 'Oldboy (Korea)',
    releaseDate: '21 Nov 2003',
    genre: 'Thriller',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'],
    fullCast: [
      { name: 'Choi Min-sik', role: 'Oh Dae-su' },
      { name: 'Yoo Ji-tae', role: 'Lee Woo-jin' },
      { name: 'Kang Hye-jung', role: 'Mi-do' },
      { name: 'Ji Dae-han', role: 'No Joo-hwan' },
    ],
    staff: [{ name: 'Chung Chung-hoon', role: 'Cinematographer' }],
  },
  {
    id: 'FSD-1004',
    title: 'STALKER',
    releaseDate: '25 May 1979',
    genre: 'Science Fiction',
    origin: 'Soviet Union',
    director: 'Andrei Tarkovsky',
    cast: ['Alexander Kaidanovsky', 'Anatoli Solonitsyn', 'Nikolai Grinko'],
    staff: [{ name: 'Alexander Knyazhinsky', role: 'Cinematographer' }],
    filmingLocations: ['Tallinn, Estonia'],
  },
  {
    id: 'FSD-1005',
    title: 'Spirited Away (Sen To Chihiro)',
    releaseDate: '20 Jul 2001',
    genre: 'Animation',
    origin: 'Japan',
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    fullCast: [
      { name: 'Rumi Hiiragi', role: 'Chihiro (voice)' },
      { name: 'Miyu Irino', role: 'Haku (voice)' },
      { name: 'Mari Natsuki', role: 'Yubaba (voice)' },
      { name: 'Bunta Sugawara', role: 'Kamaji (voice)' },
    ],
    staff: [
      { name: 'Toshio Suzuki', role: 'Producer' },
      { name: 'Joe Hisaishi', role: 'Composer' },
    ],
  },
  {
    id: 'FSD-1006',
    title: 'PARASITE',
    releaseDate: '30 May 2019',
    genre: 'Thriller',
    origin: 'South Korea',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    fullCast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo' },
      { name: 'Choi Woo-shik', role: 'Kim Ki-woo' },
      { name: 'Park So-dam', role: 'Kim Ki-jung' },
    ],
    staff: [
      { name: 'Hong Kyung-pyo', role: 'Cinematographer' },
      { name: 'Jung Jae-il', role: 'Composer' },
    ],
    filmingLocations: ['Seoul, South Korea'],
  },
  {
    id: 'FSD-1007',
    title: 'Der Untergang',
    releaseDate: '08 Sep 2004',
    genre: 'War Drama',
    origin: 'Germany',
    director: 'Oliver Hirschbiegel',
    cast: ['Bruno Ganz', 'Alexandra Maria Lara', 'Corinna Harfouch'],
    filmingLocations: ['Berlin, Germany', 'Munich, Germany'],
  },
  {
    id: 'FSD-1008',
    title: 'Ida',
    releaseDate: '25 Oct 2013',
    genre: 'Drama',
    origin: 'Poland',
    director: 'Paweł Pawlikowski',
    cast: ['Agata Trzebuchowska', 'Agata Kulesza', 'Dawid Ogrodnik'],
    fullCast: [
      { name: 'Agata Trzebuchowska', role: 'Anna / Ida' },
      { name: 'Agata Kulesza', role: 'Wanda' },
      { name: 'Dawid Ogrodnik', role: 'Lis' },
      { name: 'Jerzy Trela', role: 'Szymon' },
    ],
    staff: [{ name: 'Łukasz Żal', role: 'Cinematographer' }],
  },
  {
    id: 'FSD-1009',
    title: 'Nochnoy Dozor',
    releaseDate: '08 Jul 2004',
    genre: 'Fantasy',
    origin: 'Russia',
    director: 'Timur Bekmambetov',
    cast: ['Konstantin Khabensky', 'Vladimir Menshov', 'Valeri Zolotukhin'],
    fullCast: [
      { name: 'Konstantin Khabensky', role: 'Anton Gorodetsky' },
      { name: 'Vladimir Menshov', role: 'Geser' },
      { name: 'Valeri Zolotukhin', role: 'Kostya\u2019s Father' },
      { name: 'Mariya Poroshina', role: 'Svetlana' },
    ],
    filmingLocations: ['Moscow, Russia'],
  },
  {
    id: 'FSD-1010',
    title: 'Come and See',
    releaseDate: '17 Oct 1985',
    genre: 'War',
    origin: 'Soviet Union',
    director: 'Elem Klimov',
    cast: ['Aleksei Kravchenko', 'Olga Mironova', 'Liubomiras Laucevicius'],
    staff: [{ name: 'Aleksei Rodionov', role: 'Cinematographer' }],
  },
  {
    id: 'FSD-1011',
    title: 'The Handmaiden',
    releaseDate: '01 Jun 2016',
    genre: 'Erotic Thriller',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Kim Min-hee', 'Kim Tae-ri', 'Ha Jung-woo'],
    fullCast: [
      { name: 'Kim Min-hee', role: 'Lady Hideko' },
      { name: 'Kim Tae-ri', role: 'Sook-hee' },
      { name: 'Ha Jung-woo', role: 'Count Fujiwara' },
      { name: 'Cho Jin-woong', role: 'Kouzuki' },
    ],
    staff: [
      { name: 'Chung Chung-hoon', role: 'Cinematographer' },
      { name: 'Cho Young-wuk', role: 'Composer' },
    ],
    filmingLocations: ['Gunsan, South Korea'],
  },
  {
    id: 'FSD-1012',
    title: 'Wild Tales',
    releaseDate: '21 Aug 2014',
    genre: 'Anthology Black Comedy',
    origin: 'Argentina',
    director: 'Damián Szifron',
    cast: ['Ricardo Darín', 'Oscar Martínez', 'Erica Rivas'],
    filmingLocations: ['Buenos Aires, Argentina'],
  },
  {
    id: 'FSD-1013',
    title: 'Timbuktu',
    releaseDate: '10 Dec 2014',
    genre: 'Drama',
    origin: 'Mauritania',
    director: 'Abderrahmane Sissako',
    cast: ['Ibrahim Ahmed', 'Toulou Kiki', 'Abel Jafri'],
    fullCast: [
      { name: 'Ibrahim Ahmed', role: 'Kidane' },
      { name: 'Toulou Kiki', role: 'Satima' },
      { name: 'Abel Jafri', role: 'Abdelkerim' },
      { name: 'Fatoumata Diawara', role: 'Fatou' },
    ],
    staff: [{ name: 'Sofian El Fani', role: 'Cinematographer' }],
  },
  {
    id: 'FSD-1014',
    title: 'Jurassic Park (Le Parc)',
    releaseDate: '11 Jun 1993',
    genre: 'Science Fiction Adventure',
    origin: 'United States',
    director: 'Steven Spielberg',
    cast: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
    fullCast: [
      { name: 'Sam Neill', role: 'Dr. Alan Grant' },
      { name: 'Laura Dern', role: 'Dr. Ellie Sattler' },
      { name: 'Jeff Goldblum', role: 'Dr. Ian Malcolm' },
      { name: 'Richard Attenborough', role: 'John Hammond' },
      { name: 'Samuel L. Jackson', role: 'Ray Arnold' },
    ],
    staff: [
      { name: 'John Williams', role: 'Composer' },
      { name: 'Dean Cundey', role: 'Cinematographer' },
    ],
    filmingLocations: ['Kauai, Hawaii, USA'],
  },
];

function crawled(record: CrawledRecord): CrawledRecord {
  return record;
}

export const CRAWLED_RECORDS: CrawledRecord[] = [
  // FSD-1001 — Das Leben Der Anderen
  crawled({
    id: 'CRWL-2001',
    source: 'GlobalFilm Index',
    title: 'The Lives of Others',
    originalTitle: 'Das Leben der Anderen',
    releaseDate: '23 Mar 2006',
    genre: 'Drama, Thriller',
    origin: 'Germany',
    director: 'Florian Henckel von Donnersmarck',
    cast: ['Ulrich Mühe', 'Martina Gedeck', 'Sebastian Koch'],
    fullCast: [
      { name: 'Ulrich Mühe', role: 'Gerd Wiesler' },
      { name: 'Martina Gedeck', role: 'Christa-Maria Sieland' },
      { name: 'Sebastian Koch', role: 'Georg Dreyman' },
      { name: 'Ulrich Tukur', role: 'Anton Grubitz' },
    ],
    staff: [{ name: 'Hagen Bogdanski', role: 'Cinematographer' }],
    filmingLocations: ['Berlin, Germany'],
  }),
  crawled({
    id: 'CRWL-2002',
    source: 'CineData Worldwide',
    title: 'Das Leben der Anderen',
    releaseDate: '23 Mar 2006',
    genre: 'Drama',
    origin: 'Germany',
    director: 'Florian Henckel von Donnersmarck',
    cast: ['Ulrich Mühe', 'Martina Gedeck', 'Sebastian Koch'],
  }),
  crawled({
    id: 'CRWL-2003',
    source: 'FilmAtlas',
    title: 'Das Leben ist schön',
    originalTitle: 'La vita è bella',
    releaseDate: '20 Dec 1997',
    genre: 'Comedy Drama',
    origin: 'Italy',
    director: 'Roberto Benigni',
    cast: ['Roberto Benigni', 'Nicoletta Braschi', 'Giorgio Cantarini'],
  }),

  // FSD-1002 — Amelie
  crawled({
    id: 'CRWL-2004',
    source: 'FilmAtlas',
    title: "Le Fabuleux Destin d'Amélie Poulain",
    originalTitle: 'Amélie',
    releaseDate: '25 Apr 2001',
    genre: 'Romantic Comedy',
    origin: 'France',
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'],
    fullCast: [
      { name: 'Audrey Tautou', role: 'Amélie Poulain' },
      { name: 'Mathieu Kassovitz', role: 'Nino Quincampoix' },
      { name: 'Rufus', role: 'Raphael Poulain' },
      { name: 'Yolande Moreau', role: 'Madeleine Wallace' },
    ],
    staff: [{ name: 'Bruno Delbonnel', role: 'Cinematographer' }],
    filmingLocations: ['Montmartre, Paris, France'],
  }),
  crawled({
    id: 'CRWL-2005',
    source: 'ReelTrace Archive',
    title: 'Amélie',
    releaseDate: '25 Apr 2001',
    genre: 'Romance',
    origin: 'France',
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'],
  }),
  crawled({
    id: 'CRWL-2006',
    source: 'MovieMesh Crawler',
    title: 'A Very Long Engagement',
    originalTitle: 'Un long dimanche de fiançailles',
    releaseDate: '27 Oct 2004',
    genre: 'Romance War Drama',
    origin: 'France',
    director: 'Jean-Pierre Jeunet',
    cast: ['Audrey Tautou', 'Gaspard Ulliel', 'Jodie Foster'],
  }),

  // FSD-1003 — Oldboy
  crawled({
    id: 'CRWL-2007',
    source: 'MovieMesh Crawler',
    title: '올드보이',
    originalTitle: 'Oldboy',
    releaseDate: '21 Nov 2003',
    genre: 'Thriller, Mystery',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'],
    fullCast: [
      { name: 'Choi Min-sik', role: 'Oh Dae-su' },
      { name: 'Yoo Ji-tae', role: 'Lee Woo-jin' },
      { name: 'Kang Hye-jung', role: 'Mi-do' },
    ],
  }),
  crawled({
    id: 'CRWL-2008',
    source: 'GlobalFilm Index',
    title: 'Oldboy',
    releaseDate: '21 Nov 2003',
    genre: 'Thriller, Mystery',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'],
    fullCast: [
      { name: 'Choi Min-sik', role: 'Oh Dae-su' },
      { name: 'Yoo Ji-tae', role: 'Lee Woo-jin' },
      { name: 'Kang Hye-jung', role: 'Mi-do' },
      { name: 'Ji Dae-han', role: 'No Joo-hwan' },
    ],
    staff: [{ name: 'Chung Chung-hoon', role: 'Cinematographer' }],
    filmingLocations: ['Seoul, South Korea'],
  }),
  crawled({
    id: 'CRWL-2009',
    source: 'CineData Worldwide',
    title: 'Oldboy',
    releaseDate: '27 Nov 2013',
    genre: 'Thriller',
    origin: 'United States',
    director: 'Spike Lee',
    cast: ['Josh Brolin', 'Elizabeth Olsen', 'Samuel L. Jackson'],
  }),

  // FSD-1004 — Stalker
  crawled({
    id: 'CRWL-2010',
    source: 'GlobalFilm Index',
    title: 'Сталкер',
    originalTitle: 'Stalker',
    releaseDate: '25 May 1979',
    genre: 'Science Fiction, Drama',
    origin: 'Soviet Union',
    director: 'Andrei Tarkovsky',
    cast: ['Alexander Kaidanovsky', 'Anatoli Solonitsyn', 'Nikolai Grinko'],
    fullCast: [
      { name: 'Alexander Kaidanovsky', role: 'Stalker' },
      { name: 'Anatoli Solonitsyn', role: 'Writer' },
      { name: 'Nikolai Grinko', role: 'Professor' },
    ],
    staff: [{ name: 'Alexander Knyazhinsky', role: 'Cinematographer' }],
    filmingLocations: ['Tallinn, Estonia', 'Jägala River, Estonia'],
  }),
  crawled({
    id: 'CRWL-2011',
    source: 'ReelTrace Archive',
    title: 'Stalker',
    releaseDate: '25 May 1979',
    genre: 'Science Fiction',
    origin: 'Soviet Union',
    director: 'Andrei Tarkovsky',
    cast: ['Alexander Kaidanovsky', 'Anatoli Solonitsyn', 'Nikolai Grinko'],
  }),
  crawled({
    id: 'CRWL-2012',
    source: 'FilmAtlas',
    title: 'S.T.A.L.K.E.R.: Shadow of Chernobyl',
    releaseDate: '20 Mar 2007',
    genre: 'Video Game Tie-in',
    origin: 'Ukraine',
    director: 'Anton Bolshakov',
    cast: ['Unknown Voice Cast', 'Unknown Voice Cast', 'Unknown Voice Cast'],
  }),

  // FSD-1005 — Spirited Away
  crawled({
    id: 'CRWL-2013',
    source: 'CineData Worldwide',
    title: '千と千尋の神隠し',
    originalTitle: 'Spirited Away',
    releaseDate: '20 Jul 2001',
    genre: 'Animation, Fantasy',
    origin: 'Japan',
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    fullCast: [
      { name: 'Rumi Hiiragi', role: 'Chihiro (voice)' },
      { name: 'Miyu Irino', role: 'Haku (voice)' },
      { name: 'Mari Natsuki', role: 'Yubaba (voice)' },
    ],
    staff: [{ name: 'Joe Hisaishi', role: 'Composer' }],
  }),
  crawled({
    id: 'CRWL-2014',
    source: 'GlobalFilm Index',
    title: 'Spirited Away',
    releaseDate: '20 Jul 2001',
    genre: 'Animation',
    origin: 'Japan',
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'],
    fullCast: [
      { name: 'Rumi Hiiragi', role: 'Chihiro (voice)' },
      { name: 'Miyu Irino', role: 'Haku (voice)' },
      { name: 'Mari Natsuki', role: 'Yubaba (voice)' },
      { name: 'Bunta Sugawara', role: 'Kamaji (voice)' },
    ],
    staff: [
      { name: 'Toshio Suzuki', role: 'Producer' },
      { name: 'Joe Hisaishi', role: 'Composer' },
    ],
  }),
  crawled({
    id: 'CRWL-2015',
    source: 'MovieMesh Crawler',
    title: "Howl's Moving Castle",
    originalTitle: 'Hauru no Ugoku Shiro',
    releaseDate: '20 Nov 2004',
    genre: 'Animation, Fantasy',
    origin: 'Japan',
    director: 'Hayao Miyazaki',
    cast: ['Chieko Baisho', 'Takuya Kimura', 'Akihiro Miwa'],
  }),

  // FSD-1006 — Parasite
  crawled({
    id: 'CRWL-2016',
    source: 'FilmAtlas',
    title: '기생충',
    originalTitle: 'Parasite',
    releaseDate: '30 May 2019',
    genre: 'Thriller, Drama',
    origin: 'South Korea',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    fullCast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo' },
    ],
  }),
  crawled({
    id: 'CRWL-2017',
    source: 'GlobalFilm Index',
    title: 'Parasite',
    releaseDate: '30 May 2019',
    genre: 'Thriller, Dark Comedy',
    origin: 'South Korea',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    fullCast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo' },
      { name: 'Choi Woo-shik', role: 'Kim Ki-woo' },
      { name: 'Park So-dam', role: 'Kim Ki-jung' },
    ],
    staff: [
      { name: 'Hong Kyung-pyo', role: 'Cinematographer' },
      { name: 'Jung Jae-il', role: 'Composer' },
    ],
    filmingLocations: ['Seoul, South Korea'],
  }),
  crawled({
    id: 'CRWL-2018',
    source: 'ReelTrace Archive',
    title: 'Snowpiercer',
    originalTitle: '설국열차',
    releaseDate: '01 Aug 2013',
    genre: 'Science Fiction, Action',
    origin: 'South Korea',
    director: 'Bong Joon-ho',
    cast: ['Chris Evans', 'Song Kang-ho', 'Tilda Swinton'],
  }),

  // FSD-1007 — Der Untergang / Downfall
  crawled({
    id: 'CRWL-2019',
    source: 'GlobalFilm Index',
    title: 'Downfall',
    originalTitle: 'Der Untergang',
    releaseDate: '08 Sep 2004',
    genre: 'War Drama',
    origin: 'Germany',
    director: 'Oliver Hirschbiegel',
    cast: ['Bruno Ganz', 'Alexandra Maria Lara', 'Corinna Harfouch'],
    fullCast: [
      { name: 'Bruno Ganz', role: 'Adolf Hitler' },
      { name: 'Alexandra Maria Lara', role: 'Traudl Junge' },
      { name: 'Corinna Harfouch', role: 'Magda Goebbels' },
    ],
    filmingLocations: ['Berlin, Germany', 'Munich, Germany', 'St. Petersburg, Russia'],
  }),
  crawled({
    id: 'CRWL-2020',
    source: 'CineData Worldwide',
    title: 'Der Untergang',
    releaseDate: '08 Sep 2004',
    genre: 'War Drama',
    origin: 'Germany',
    director: 'Oliver Hirschbiegel',
    cast: ['Bruno Ganz', 'Alexandra Maria Lara', 'Corinna Harfouch'],
  }),
  crawled({
    id: 'CRWL-2021',
    source: 'FilmAtlas',
    title: 'Der Untergang',
    releaseDate: '12 Feb 1999',
    genre: 'TV Drama',
    origin: 'Germany',
    director: 'Hans-Erich Viet',
    cast: ['Unknown Cast', 'Unknown Cast', 'Unknown Cast'],
  }),

  // FSD-1008 — Ida
  crawled({
    id: 'CRWL-2022',
    source: 'ReelTrace Archive',
    title: 'Ida',
    releaseDate: '25 Oct 2013',
    genre: 'Drama',
    origin: 'Poland',
    director: 'Paweł Pawlikowski',
    cast: ['Agata Trzebuchowska', 'Agata Kulesza', 'Dawid Ogrodnik'],
    fullCast: [
      { name: 'Agata Trzebuchowska', role: 'Anna / Ida' },
      { name: 'Agata Kulesza', role: 'Wanda' },
      { name: 'Dawid Ogrodnik', role: 'Lis' },
    ],
    staff: [{ name: 'Łukasz Żal', role: 'Cinematographer' }],
  }),
  crawled({
    id: 'CRWL-2023',
    source: 'MovieMesh Crawler',
    title: 'Ida',
    originalTitle: 'Ida',
    releaseDate: '25 Oct 2013',
    genre: 'Drama',
    origin: 'Poland',
    director: 'Pawel Pawlikowski',
    cast: ['Agata Trzebuchowska', 'Agata Kulesza', 'Dawid Ogrodnik'],
  }),
  crawled({
    id: 'CRWL-2024',
    source: 'FilmAtlas',
    title: 'Cold War',
    originalTitle: 'Zimna Wojna',
    releaseDate: '10 May 2018',
    genre: 'Romance Drama',
    origin: 'Poland',
    director: 'Paweł Pawlikowski',
    cast: ['Joanna Kulig', 'Tomasz Kot', 'Borys Szyc'],
  }),

  // FSD-1009 — Nochnoy Dozor / Night Watch
  crawled({
    id: 'CRWL-2025',
    source: 'GlobalFilm Index',
    title: 'Ночной дозор',
    originalTitle: 'Night Watch',
    releaseDate: '08 Jul 2004',
    genre: 'Fantasy, Horror',
    origin: 'Russia',
    director: 'Timur Bekmambetov',
    cast: ['Konstantin Khabensky', 'Vladimir Menshov', 'Valeri Zolotukhin'],
    fullCast: [
      { name: 'Konstantin Khabensky', role: 'Anton Gorodetsky' },
      { name: 'Vladimir Menshov', role: 'Geser' },
      { name: 'Valeri Zolotukhin', role: "Kostya's Father" },
    ],
    filmingLocations: ['Moscow, Russia'],
  }),
  crawled({
    id: 'CRWL-2026',
    source: 'CineData Worldwide',
    title: 'Night Watch',
    releaseDate: '08 Jul 2004',
    genre: 'Fantasy',
    origin: 'Russia',
    director: 'Timur Bekmambetov',
    cast: ['Konstantin Khabensky', 'Vladimir Menshov', 'Valeri Zolotukhin'],
  }),
  crawled({
    id: 'CRWL-2027',
    source: 'ReelTrace Archive',
    title: 'Day Watch',
    originalTitle: 'Дневной дозор',
    releaseDate: '01 Jan 2006',
    genre: 'Fantasy',
    origin: 'Russia',
    director: 'Timur Bekmambetov',
    cast: ['Konstantin Khabensky', 'Mariya Poroshina', 'Vladimir Menshov'],
  }),

  // FSD-1010 — Come and See
  crawled({
    id: 'CRWL-2028',
    source: 'MovieMesh Crawler',
    title: 'Idi i smotri',
    originalTitle: 'Come and See',
    releaseDate: '17 Oct 1985',
    genre: 'War',
    origin: 'Soviet Union',
    director: 'Elem Klimov',
    cast: ['Aleksei Kravchenko', 'Olga Mironova', 'Liubomiras Laucevicius'],
  }),
  crawled({
    id: 'CRWL-2029',
    source: 'GlobalFilm Index',
    title: 'Come and See',
    releaseDate: '17 Oct 1985',
    genre: 'War Drama',
    origin: 'Soviet Union',
    director: 'Elem Klimov',
    cast: ['Aleksei Kravchenko', 'Olga Mironova', 'Liubomiras Laucevicius'],
    fullCast: [
      { name: 'Aleksei Kravchenko', role: 'Flyora' },
      { name: 'Olga Mironova', role: 'Glasha' },
      { name: 'Liubomiras Laucevicius', role: 'Kosach' },
    ],
    staff: [{ name: 'Aleksei Rodionov', role: 'Cinematographer' }],
    filmingLocations: ['Byelorussian SSR'],
  }),
  crawled({
    id: 'CRWL-2030',
    source: 'FilmAtlas',
    title: "Ivan's Childhood",
    originalTitle: 'Ivanovo detstvo',
    releaseDate: '06 Apr 1962',
    genre: 'War Drama',
    origin: 'Soviet Union',
    director: 'Andrei Tarkovsky',
    cast: ['Nikolai Burlyaev', 'Valentin Zubkov', 'Yevgeni Zharikov'],
  }),

  // FSD-1011 — The Handmaiden
  crawled({
    id: 'CRWL-2031',
    source: 'FilmAtlas',
    title: '아가씨',
    originalTitle: 'The Handmaiden',
    releaseDate: '01 Jun 2016',
    genre: 'Erotic Thriller',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Kim Min-hee', 'Kim Tae-ri', 'Ha Jung-woo'],
    fullCast: [
      { name: 'Kim Min-hee', role: 'Lady Hideko' },
      { name: 'Kim Tae-ri', role: 'Sook-hee' },
      { name: 'Ha Jung-woo', role: 'Count Fujiwara' },
    ],
  }),
  crawled({
    id: 'CRWL-2032',
    source: 'GlobalFilm Index',
    title: 'The Handmaiden',
    releaseDate: '01 Jun 2016',
    genre: 'Erotic Thriller, Romance',
    origin: 'South Korea',
    director: 'Park Chan-wook',
    cast: ['Kim Min-hee', 'Kim Tae-ri', 'Ha Jung-woo'],
    fullCast: [
      { name: 'Kim Min-hee', role: 'Lady Hideko' },
      { name: 'Kim Tae-ri', role: 'Sook-hee' },
      { name: 'Ha Jung-woo', role: 'Count Fujiwara' },
      { name: 'Cho Jin-woong', role: 'Kouzuki' },
    ],
    staff: [{ name: 'Cho Young-wuk', role: 'Composer' }],
    filmingLocations: ['Gunsan, South Korea', 'Damyang, South Korea'],
  }),
  crawled({
    id: 'CRWL-2033',
    source: 'ReelTrace Archive',
    title: 'The Housemaid',
    originalTitle: '하녀',
    releaseDate: '12 May 2010',
    genre: 'Thriller',
    origin: 'South Korea',
    director: 'Im Sang-soo',
    cast: ['Jeon Do-yeon', 'Lee Jung-jae', 'Youn Yuh-jung'],
  }),

  // FSD-1012 — Wild Tales
  crawled({
    id: 'CRWL-2034',
    source: 'MovieMesh Crawler',
    title: 'Relatos Salvajes',
    originalTitle: 'Wild Tales',
    releaseDate: '21 Aug 2014',
    genre: 'Black Comedy, Anthology',
    origin: 'Argentina',
    director: 'Damián Szifron',
    cast: ['Ricardo Darín', 'Oscar Martínez', 'Erica Rivas'],
    fullCast: [
      { name: 'Ricardo Darín', role: 'Simón' },
      { name: 'Oscar Martínez', role: 'Mauricio' },
      { name: 'Erica Rivas', role: 'Romina' },
    ],
    filmingLocations: ['Buenos Aires, Argentina', 'Salta Province, Argentina'],
  }),
  crawled({
    id: 'CRWL-2035',
    source: 'GlobalFilm Index',
    title: 'Wild Tales',
    releaseDate: '21 Aug 2014',
    genre: 'Anthology',
    origin: 'Argentina',
    director: 'Damián Szifron',
    cast: ['Ricardo Darín', 'Oscar Martínez', 'Erica Rivas'],
  }),
  crawled({
    id: 'CRWL-2036',
    source: 'FilmAtlas',
    title: 'El Secreto de Sus Ojos',
    originalTitle: 'The Secret in Their Eyes',
    releaseDate: '13 Aug 2009',
    genre: 'Mystery Drama',
    origin: 'Argentina',
    director: 'Juan José Campanella',
    cast: ['Ricardo Darín', 'Soledad Villamil', 'Pablo Rago'],
  }),

  // FSD-1013 — Timbuktu
  crawled({
    id: 'CRWL-2037',
    source: 'ReelTrace Archive',
    title: 'Timbuktu',
    releaseDate: '10 Dec 2014',
    genre: 'Drama',
    origin: 'Mauritania',
    director: 'Abderrahmane Sissako',
    cast: ['Ibrahim Ahmed', 'Toulou Kiki', 'Abel Jafri'],
    fullCast: [
      { name: 'Ibrahim Ahmed', role: 'Kidane' },
      { name: 'Toulou Kiki', role: 'Satima' },
      { name: 'Abel Jafri', role: 'Abdelkerim' },
    ],
  }),
  crawled({
    id: 'CRWL-2038',
    source: 'MovieMesh Crawler',
    title: 'Le Chagrin des Vautours',
    originalTitle: 'Timbuktu',
    releaseDate: '10 Dec 2014',
    genre: 'Drama',
    origin: 'Mali',
    director: 'Abderrahmane Sissako',
    cast: ['Ibrahim Ahmed', 'Toulou Kiki', 'Fatoumata Diawara'],
    staff: [{ name: 'Sofian El Fani', role: 'Cinematographer' }],
    filmingLocations: ['Oualata, Mauritania'],
  }),
  crawled({
    id: 'CRWL-2039',
    source: 'FilmAtlas',
    title: 'Bamako',
    releaseDate: '13 Sep 2006',
    genre: 'Drama',
    origin: 'Mali',
    director: 'Abderrahmane Sissako',
    cast: ['Aïssa Maïga', 'Tiécoura Traoré', 'Maimouna Hélène Diarra'],
  }),

  // FSD-1014 — Jurassic Park
  crawled({
    id: 'CRWL-2040',
    source: 'GlobalFilm Index',
    title: 'Jurassic Park',
    releaseDate: '11 Jun 1993',
    genre: 'Science Fiction, Adventure',
    origin: 'United States',
    director: 'Steven Spielberg',
    cast: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
    fullCast: [
      { name: 'Sam Neill', role: 'Dr. Alan Grant' },
      { name: 'Laura Dern', role: 'Dr. Ellie Sattler' },
      { name: 'Jeff Goldblum', role: 'Dr. Ian Malcolm' },
      { name: 'Richard Attenborough', role: 'John Hammond' },
    ],
    staff: [
      { name: 'John Williams', role: 'Composer' },
      { name: 'Dean Cundey', role: 'Cinematographer' },
    ],
    filmingLocations: ['Kauai, Hawaii, USA'],
  }),
  crawled({
    id: 'CRWL-2041',
    source: 'CineData Worldwide',
    title: 'Jurassic Park',
    originalTitle: 'Jurassic Park (Deutsche Fassung)',
    releaseDate: '16 Sep 1993',
    genre: 'Science Fiction',
    origin: 'United States',
    director: 'Steven Spielberg',
    cast: ['Sam Neill', 'Laura Dern', 'Jeff Goldblum'],
  }),
  crawled({
    id: 'CRWL-2042',
    source: 'ReelTrace Archive',
    title: 'The Lost World: Jurassic Park',
    releaseDate: '23 May 1997',
    genre: 'Science Fiction, Adventure',
    origin: 'United States',
    director: 'Steven Spielberg',
    cast: ['Jeff Goldblum', 'Julianne Moore', 'Pete Postlethwaite'],
  }),
];

function findCrawled(id: string): CrawledRecord {
  const found = CRAWLED_RECORDS.find((r) => r.id === id);
  if (!found) throw new Error(`Unknown crawled record: ${id}`);
  return found;
}

function candidate(id: string, confidence: number): SuggestionCandidate {
  return { record: findCrawled(id), confidence };
}

/** Mocked suggestion API — >=3 crawled candidates per DB title, confidence-ranked. */
export const SUGGESTIONS: Record<string, SuggestionCandidate[]> = {
  'FSD-1001': [candidate('CRWL-2001', 96), candidate('CRWL-2002', 91), candidate('CRWL-2003', 34)],
  'FSD-1002': [candidate('CRWL-2004', 97), candidate('CRWL-2005', 90), candidate('CRWL-2006', 45)],
  'FSD-1003': [candidate('CRWL-2008', 98), candidate('CRWL-2007', 94), candidate('CRWL-2009', 52)],
  'FSD-1004': [candidate('CRWL-2010', 95), candidate('CRWL-2011', 90), candidate('CRWL-2012', 21)],
  'FSD-1005': [candidate('CRWL-2014', 99), candidate('CRWL-2013', 93), candidate('CRWL-2015', 38)],
  'FSD-1006': [candidate('CRWL-2017', 99), candidate('CRWL-2016', 92), candidate('CRWL-2018', 40)],
  'FSD-1007': [candidate('CRWL-2019', 95), candidate('CRWL-2020', 90), candidate('CRWL-2021', 30)],
  'FSD-1008': [candidate('CRWL-2022', 88), candidate('CRWL-2023', 84), candidate('CRWL-2024', 42)],
  'FSD-1009': [candidate('CRWL-2025', 93), candidate('CRWL-2026', 89), candidate('CRWL-2027', 47)],
  'FSD-1010': [candidate('CRWL-2029', 94), candidate('CRWL-2028', 87), candidate('CRWL-2030', 29)],
  'FSD-1011': [candidate('CRWL-2032', 97), candidate('CRWL-2031', 91), candidate('CRWL-2033', 33)],
  'FSD-1012': [candidate('CRWL-2034', 96), candidate('CRWL-2035', 90), candidate('CRWL-2036', 27)],
  'FSD-1013': [candidate('CRWL-2037', 92), candidate('CRWL-2038', 85), candidate('CRWL-2039', 25)],
  'FSD-1014': [candidate('CRWL-2040', 99), candidate('CRWL-2041', 93), candidate('CRWL-2042', 44)],
};

export function cloneDbMovies(): DbFilmRecord[] {
  return DB_MOVIES.map((movie) => ({ ...movie }));
}

/** Returns a copy of `base` with `fields` swapped in from `source` — drives the merge preview. */
export function applyOverrides<T extends FilmRecord>(
  base: T,
  source: FilmRecord,
  fields: Set<FieldKey> | FieldKey[],
): T {
  const result: T = { ...base };
  for (const field of fields) {
    (result as Record<FieldKey, FilmRecord[FieldKey]>)[field] = source[field];
  }
  return result;
}

export function formatFieldValue(field: FieldKey, record: FilmRecord): string {
  if (field === 'cast') return record.cast.join(', ');
  if (field === 'title') {
    return record.originalTitle ? `${record.title} (${record.originalTitle})` : record.title;
  }
  return String(record[field]);
}

export function matchesQuery(record: FilmRecord, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    record.id.toLowerCase().includes(q) ||
    record.title.toLowerCase().includes(q) ||
    (record.originalTitle?.toLowerCase().includes(q) ?? false) ||
    record.director.toLowerCase().includes(q) ||
    record.origin.toLowerCase().includes(q)
  );
}
