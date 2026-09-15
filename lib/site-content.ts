export type DestinationCard = {
  number: string;
  label: string;
  title: string;
  copy: string;
  meta: string;
  href: string;
};

export type LocalLink = {
  name: string;
  distance: string;
  copy: string;
  href: string;
};

export type SeasonalEvent = {
  label: string;
  href: string;
};

export type SeasonalCard = {
  season: string;
  tone: string;
  events: SeasonalEvent[];
};

export type SiteContent = {
  destinations: DestinationCard[];
  localLinks: LocalLink[];
  seasons: SeasonalCard[];
};

export const defaultSiteContent: SiteContent = {
  destinations: [
    {
      number: '01',
      label: 'The big weekends',
      title: 'Coachella & Stagecoach',
      copy: 'The festival shuttle hub is about 0.6 mile from the house—close enough for an easy start and a quiet landing afterward.',
      meta: '0.6 mi to shuttle',
      href: 'https://www.coachella.com/',
    },
    {
      number: '02',
      label: 'Center court',
      title: 'Indian Wells Tennis Garden',
      copy: 'Walk or make the short hop to the home of the BNP Paribas Open and a full calendar of tennis and community events.',
      meta: '0.6 mi',
      href: 'https://bnpparibasopen.com/',
    },
    {
      number: '03',
      label: 'Tee time',
      title: 'Golf in every direction',
      copy: 'Indian Wells Golf Resort, Indian Wells Country Club, Toscana, La Quinta Resort, Shadow Mountain, and more are all close by.',
      meta: '1.8 mi to nearest course',
      href: 'https://www.visitgreaterpalmsprings.com/things-to-do/golf/',
    },
    {
      number: '04',
      label: 'Desert miles',
      title: 'Trails, palms & open sky',
      copy: 'Choose Bump and Grind, the Coachella Valley Preserve, Indian Canyons, or a day among the granite and Joshua trees.',
      meta: '5.7 mi to nearest trail',
      href: 'https://www.nps.gov/jotr/planyourvisit/index.htm',
    },
  ],
  localLinks: [
    {
      name: 'El Paseo',
      distance: '4 mi',
      copy: 'Shopping, dining & design',
      href: 'https://www.elpaseocatalogue.com/',
    },
    {
      name: 'Old Town La Quinta',
      distance: '4.9 mi',
      copy: 'Patios, cafés & village charm',
      href: 'https://oldtownlaquinta.com/',
    },
    {
      name: 'The Living Desert',
      distance: '5.8 mi',
      copy: 'Wildlife & desert gardens',
      href: 'https://www.livingdesert.org/',
    },
    {
      name: 'Palm Springs',
      distance: '18 mi',
      copy: 'Art, architecture & nightlife',
      href: 'https://visitpalmsprings.com/',
    },
    {
      name: 'Aerial Tramway',
      distance: '28.2 mi',
      copy: 'A cool climb above the valley',
      href: 'https://pstramway.com/',
    },
  ],
  seasons: [
    {
      season: 'January · February',
      tone: 'The desert wakes up',
      events: [
        { label: 'The American Express PGA TOUR', href: 'https://www.theamexgolf.com/' },
        { label: 'Concert Series at The Gardens on El Paseo', href: 'https://www.simon.com/mall/the-gardens-on-el-paseo/about' },
        { label: 'La Quinta Car Show', href: 'https://www.lqcarshow.com/' },
        { label: 'Dr. George Charity Car Show', href: 'https://palmspringscruisinassociation.com/dr-george-charity-car-show/' },
        { label: 'Art on Main Street in La Quinta', href: 'https://oldtownlaquinta.com/art-on-main-street/' },
        { label: 'Riverside County Fair & Date Festival', href: 'https://www.datefest.org/' },
      ],
    },
    {
      season: 'March · April',
      tone: 'The headline season',
      events: [
        { label: 'BNP Paribas Open', href: 'https://bnpparibasopen.com/' },
        { label: 'Fashion Week El Paseo', href: 'https://fashionweekelpaseo.com/' },
        { label: 'Palm Desert Food & Wine', href: 'https://palmdesertfoodandwine.com/' },
        { label: 'Coachella', href: 'https://www.coachella.com/' },
        { label: 'Stagecoach', href: 'https://www.stagecoachfestival.com/' },
        { label: 'Indian Wells junior tennis', href: 'https://www.indianwellstennisgarden.com/events/' },
      ],
    },
    {
      season: 'May · September',
      tone: 'Long days, local pace',
      events: [
        { label: 'Greater Palm Springs Restaurant Week', href: 'https://www.visitgreaterpalmsprings.com/restaurant-week/' },
        { label: 'Thursday VillageFest · summer 7–10pm', href: 'https://villagefest.org/about-us/' },
        { label: 'Museum, tram & pool days', href: 'https://www.visitgreaterpalmsprings.com/things-to-do/' },
        { label: 'Summer concerts and arena events', href: 'https://acrisurearena.com/events/' },
      ],
    },
    {
      season: 'October · December',
      tone: 'Golden-hour season',
      events: [
        { label: 'Palm Desert Golf Cart Parade', href: 'https://golfcartparade.org/' },
        { label: 'College of the Desert Street Fair · weekends', href: 'https://codaastreetfair.com/' },
        { label: 'Palm Springs Vintage Market', href: 'https://palmspringsvintagemarket.com/' },
        { label: 'Indian Wells pickleball events', href: 'https://www.indianwellstennisgarden.com/events/' },
        { label: 'El Paseo holiday tree lighting', href: 'https://www.simon.com/mall/the-gardens-on-el-paseo/about' },
        { label: 'Palm Desert Thanksgiving Day 5K', href: 'https://www.visitgreaterpalmsprings.com/events/' },
        { label: 'Photos with Santa at The Gardens', href: 'https://www.simon.com/mall/the-gardens-on-el-paseo/about' },
        { label: 'IRONMAN 70.3 La Quinta', href: 'https://www.ironman.com/races/im703-la-quinta' },
      ],
    },
  ],
};

const isHttpUrl = (value: unknown) => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isText = (value: unknown, max: number) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= max;

export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const content = value as Partial<SiteContent>;
  if (!Array.isArray(content.destinations) || content.destinations.length !== 4) return false;
  if (!Array.isArray(content.localLinks) || content.localLinks.length !== 5) return false;
  if (!Array.isArray(content.seasons) || content.seasons.length !== 4) return false;

  const validDestinations = content.destinations.every((item) =>
    isText(item?.number, 8) &&
    isText(item?.label, 80) &&
    isText(item?.title, 120) &&
    isText(item?.copy, 500) &&
    isText(item?.meta, 100) &&
    isHttpUrl(item?.href),
  );
  const validLocalLinks = content.localLinks.every((item) =>
    isText(item?.name, 120) &&
    isText(item?.distance, 60) &&
    isText(item?.copy, 240) &&
    isHttpUrl(item?.href),
  );
  const validSeasons = content.seasons.every((item) =>
    isText(item?.season, 100) &&
    isText(item?.tone, 120) &&
    Array.isArray(item?.events) &&
    item.events.length >= 1 &&
    item.events.length <= 12 &&
    item.events.every((event) => isText(event?.label, 160) && isHttpUrl(event?.href)),
  );

  return validDestinations && validLocalLinks && validSeasons;
}
