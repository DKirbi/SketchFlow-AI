import type { CrawledRecord, DbFilmRecord, SuggestionCandidate } from './mockData';

function db(record: DbFilmRecord): DbFilmRecord {
  return record;
}

function crawled(record: CrawledRecord): CrawledRecord {
  return record;
}

export const WIZARDING_DB: DbFilmRecord[] = [
  db({
    id: 'HP-1001',
    title: 'Gryffindor Quidditch XI',
    releaseDate: '01 Sep 1993',
    genre: 'Magical sport',
    origin: 'Hogwarts',
    director: 'Oliver Wood',
    cast: ['Harry Potter', 'Katie Bell', 'Angelina Johnson'],
    fullCast: [
      { name: 'Harry Potter', role: 'Seeker' },
      { name: 'Katie Bell', role: 'Chaser' },
      { name: 'Angelina Johnson', role: 'Chaser' },
      { name: 'Alicia Spinnet', role: 'Chaser' },
      { name: 'Fred Weasley', role: 'Beater' },
    ],
    staff: [
      { name: 'Oliver Wood', role: 'Captain' },
      { name: 'Minerva McGonagall', role: 'Head of House' },
    ],
    filmingLocations: ['Hogwarts Quidditch pitch'],
  }),
  db({
    id: 'HP-1002',
    title: 'Harry Potter',
    originalTitle: 'The Boy Who Lived',
    releaseDate: '31 Jul 1980',
    genre: 'Seeker',
    origin: 'Hogwarts',
    director: 'Albus Dumbledore',
    cast: ['Ron Weasley', 'Hermione Granger', 'Neville Longbottom'],
    fullCast: [
      { name: 'Ron Weasley', role: 'Friend' },
      { name: 'Hermione Granger', role: 'Friend' },
      { name: 'Neville Longbottom', role: 'Classmate' },
    ],
    filmingLocations: ['Privet Drive', 'Hogwarts'],
  }),
  db({
    id: 'HP-1003',
    title: 'Cedric Diggory',
    releaseDate: '01 Sep 1994',
    genre: 'Triwizard champion',
    origin: 'Hufflepuff',
    director: 'Amos Diggory',
    cast: ['Cho Chang', 'Harry Potter', 'Viktor Krum'],
    filmingLocations: ['Hogwarts grounds'],
  }),
  db({
    id: 'HP-1004',
    title: 'Quidditch World Cup',
    releaseDate: '25 Aug 1994',
    genre: 'Cup',
    origin: 'Dartmoor',
    director: 'Ludo Bagman',
    cast: ['Viktor Krum', 'Ireland Seeker', 'Ludovic Bagman'],
    staff: [{ name: 'Arthur Weasley', role: 'Ministry attendant' }],
    filmingLocations: ['Dartmoor campsite'],
  }),
  db({
    id: 'HP-1005',
    title: 'Triwizard Tournament',
    releaseDate: '31 Oct 1994',
    genre: 'Tournament',
    origin: 'Hogwarts',
    director: 'Bartemius Crouch',
    cast: ['Harry Potter', 'Cedric Diggory', 'Fleur Delacour'],
    filmingLocations: ['Black Lake', 'Forbidden Forest'],
  }),
  db({
    id: 'HP-1006',
    title: 'Seeker',
    releaseDate: '01 Sep 1991',
    genre: 'Position',
    origin: 'Hogwarts',
    director: 'Madam Hooch',
    cast: ['Harry Potter', 'Cho Chang', 'Draco Malfoy'],
  }),
];

export const WIZARDING_CRAWLED: CrawledRecord[] = [
  crawled({
    id: 'HPCR-2001',
    source: 'Daily Prophet Index',
    title: 'Gryffindor Quidditch Team',
    originalTitle: 'Gryffindor Quidditch XI',
    releaseDate: '01 Sep 1993',
    genre: 'Magical sport',
    origin: 'Hogwarts',
    director: 'Oliver Wood',
    cast: ['Harry Potter', 'Katie Bell', 'Angelina Johnson'],
    filmingLocations: ['Hogwarts Quidditch pitch'],
  }),
  crawled({
    id: 'HPCR-2002',
    source: 'Quidditch Archive',
    title: 'Gryffindor XI',
    releaseDate: '01 Sep 1993',
    genre: 'Magical sport',
    origin: 'Hogwarts',
    director: 'Oliver Wood',
    cast: ['Harry Potter', 'Katie Bell', 'Angelina Johnson'],
  }),
  crawled({
    id: 'HPCR-2003',
    source: 'Witch Weekly',
    title: 'Slytherin Quidditch XI',
    releaseDate: '01 Sep 1993',
    genre: 'Magical sport',
    origin: 'Hogwarts',
    director: 'Marcus Flint',
    cast: ['Draco Malfoy', 'Marcus Flint', 'Vincent Crabbe'],
  }),
  crawled({
    id: 'HPCR-2004',
    source: 'Daily Prophet Index',
    title: 'Harry Potter',
    originalTitle: 'The Boy Who Lived',
    releaseDate: '31 Jul 1980',
    genre: 'Seeker',
    origin: 'Hogwarts',
    director: 'Albus Dumbledore',
    cast: ['Ron Weasley', 'Hermione Granger', 'Neville Longbottom'],
  }),
  crawled({
    id: 'HPCR-2005',
    source: 'Hogwarts Registry',
    title: 'Harry J. Potter',
    releaseDate: '31 Jul 1980',
    genre: 'Seeker',
    origin: 'Hogwarts',
    director: 'Albus Dumbledore',
    cast: ['Ron Weasley', 'Hermione Granger', 'Neville Longbottom'],
  }),
  crawled({
    id: 'HPCR-2006',
    source: 'Witch Weekly',
    title: 'James Potter',
    releaseDate: '27 Mar 1960',
    genre: 'Seeker',
    origin: 'Hogwarts',
    director: 'Albus Dumbledore',
    cast: ['Lily Potter', 'Sirius Black', 'Remus Lupin'],
  }),
  crawled({
    id: 'HPCR-2007',
    source: 'Hogwarts Registry',
    title: 'Cedric Diggory',
    releaseDate: '01 Sep 1994',
    genre: 'Triwizard champion',
    origin: 'Hufflepuff',
    director: 'Amos Diggory',
    cast: ['Cho Chang', 'Harry Potter', 'Viktor Krum'],
  }),
  crawled({
    id: 'HPCR-2008',
    source: 'Daily Prophet Index',
    title: 'C. Diggory',
    releaseDate: '01 Sep 1994',
    genre: 'Triwizard champion',
    origin: 'Hufflepuff',
    director: 'Amos Diggory',
    cast: ['Cho Chang', 'Harry Potter', 'Viktor Krum'],
  }),
  crawled({
    id: 'HPCR-2009',
    source: 'Witch Weekly',
    title: 'Cedric Diggle',
    releaseDate: '01 Sep 1994',
    genre: 'Triwizard champion',
    origin: 'Hufflepuff',
    director: 'Amos Diggory',
    cast: ['Cho Chang', 'Harry Potter', 'Viktor Krum'],
  }),
  crawled({
    id: 'HPCR-2010',
    source: 'Quidditch Archive',
    title: 'Quidditch World Cup 1994',
    releaseDate: '25 Aug 1994',
    genre: 'Cup',
    origin: 'Dartmoor',
    director: 'Ludo Bagman',
    cast: ['Viktor Krum', 'Ireland Seeker', 'Ludovic Bagman'],
  }),
  crawled({
    id: 'HPCR-2011',
    source: 'Daily Prophet Index',
    title: 'World Cup',
    releaseDate: '25 Aug 1994',
    genre: 'Cup',
    origin: 'Dartmoor',
    director: 'Ludo Bagman',
    cast: ['Viktor Krum', 'Ireland Seeker', 'Ludovic Bagman'],
  }),
  crawled({
    id: 'HPCR-2012',
    source: 'Witch Weekly',
    title: 'Inter-House Quidditch Cup',
    releaseDate: '01 Jun 1994',
    genre: 'Cup',
    origin: 'Hogwarts',
    director: 'Minerva McGonagall',
    cast: ['Harry Potter', 'Marcus Flint', 'Cedric Diggory'],
  }),
  crawled({
    id: 'HPCR-2013',
    source: 'Hogwarts Registry',
    title: 'Triwizard Tournament',
    releaseDate: '31 Oct 1994',
    genre: 'Tournament',
    origin: 'Hogwarts',
    director: 'Bartemius Crouch',
    cast: ['Harry Potter', 'Cedric Diggory', 'Fleur Delacour'],
  }),
  crawled({
    id: 'HPCR-2014',
    source: 'Daily Prophet Index',
    title: 'Triwizard',
    releaseDate: '31 Oct 1994',
    genre: 'Tournament',
    origin: 'Hogwarts',
    director: 'Bartemius Crouch',
    cast: ['Harry Potter', 'Cedric Diggory', 'Viktor Krum'],
  }),
  crawled({
    id: 'HPCR-2015',
    source: 'Witch Weekly',
    title: 'Goblet of Fire contest',
    releaseDate: '31 Oct 1994',
    genre: 'Tournament',
    origin: 'Hogwarts',
    director: 'Albus Dumbledore',
    cast: ['Harry Potter', 'Cedric Diggory', 'Fleur Delacour'],
  }),
  crawled({
    id: 'HPCR-2016',
    source: 'Quidditch Archive',
    title: 'Seeker',
    releaseDate: '01 Sep 1991',
    genre: 'Position',
    origin: 'Hogwarts',
    director: 'Madam Hooch',
    cast: ['Harry Potter', 'Cho Chang', 'Draco Malfoy'],
  }),
  crawled({
    id: 'HPCR-2017',
    source: 'Hogwarts Registry',
    title: 'Seeker position',
    releaseDate: '01 Sep 1991',
    genre: 'Position',
    origin: 'Hogwarts',
    director: 'Madam Hooch',
    cast: ['Harry Potter', 'Cho Chang', 'Draco Malfoy'],
  }),
  crawled({
    id: 'HPCR-2018',
    source: 'Witch Weekly',
    title: 'Chaser',
    releaseDate: '01 Sep 1991',
    genre: 'Position',
    origin: 'Hogwarts',
    director: 'Madam Hooch',
    cast: ['Katie Bell', 'Angelina Johnson', 'Alicia Spinnet'],
  }),
];

function findCrawled(id: string): CrawledRecord {
  const found = WIZARDING_CRAWLED.find((record) => record.id === id);
  if (!found) throw new Error(`Unknown crawled record: ${id}`);
  return found;
}

function candidate(id: string, confidence: number): SuggestionCandidate {
  return { record: findCrawled(id), confidence };
}

export const WIZARDING_SUGGESTIONS: Record<string, SuggestionCandidate[]> = {
  'HP-1001': [candidate('HPCR-2001', 96), candidate('HPCR-2002', 88), candidate('HPCR-2003', 31)],
  'HP-1002': [candidate('HPCR-2004', 99), candidate('HPCR-2005', 91), candidate('HPCR-2006', 28)],
  'HP-1003': [candidate('HPCR-2007', 97), candidate('HPCR-2008', 90), candidate('HPCR-2009', 36)],
  'HP-1004': [candidate('HPCR-2010', 95), candidate('HPCR-2011', 84), candidate('HPCR-2012', 42)],
  'HP-1005': [candidate('HPCR-2013', 98), candidate('HPCR-2014', 86), candidate('HPCR-2015', 33)],
  'HP-1006': [candidate('HPCR-2016', 94), candidate('HPCR-2017', 89), candidate('HPCR-2018', 40)],
};

export function cloneWizardingDb(): DbFilmRecord[] {
  return WIZARDING_DB.map((record) => ({ ...record }));
}
