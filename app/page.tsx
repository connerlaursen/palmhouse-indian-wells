'use client';

import { useEffect, useMemo, useState } from 'react';

const EVOLVE_URL =
  'https://evolve.com/vacation-rentals/us/ca/indian-wells/435461';

const photos = [
  ['property-01.jpg', 'Private pool and sun deck'],
  ['property-02.jpg', 'Living room with gas fireplace'],
  ['property-03.jpg', 'Shaded outdoor lounge'],
  ['property-04.jpg', 'Open-plan living and kitchen'],
  ['property-05.jpg', 'Dedicated workspace'],
  ['property-06.jpg', 'Primary bedroom with king bed'],
  ['property-07.jpg', 'Well-appointed kitchen'],
  ['property-08.jpg', 'Primary bedroom and ensuite access'],
  ['property-09.jpg', 'Chef-ready gas range and coffee bar'],
  ['property-10.jpg', 'Bright living room'],
  ['property-11.jpg', 'Dining for the whole group'],
  ['property-12.jpg', 'Open, easy gathering spaces'],
  ['property-13.jpg', 'Bedroom with pool access'],
  ['property-14.jpg', 'Dining room and kitchen'],
  ['property-15.jpg', 'Quiet sitting area'],
  ['property-16.jpg', 'Kitchen island with counter seating'],
] as const;

const amenities = [
  ['Pool & spa', 'Your own private outdoor pool and hot tub.'],
  ['Chef’s kitchen', 'Gas range, generous prep space, and a dining table for eight.'],
  ['Fast Wi-Fi', 'Reliable internet and a dedicated spot to catch up on work.'],
  ['Dog-friendly', 'Bring your four-legged travel companion along.'],
  ['Climate control', 'Central air conditioning and heating for every season.'],
  ['Easy parking', 'Private driveway parking for up to three vehicles.'],
] as const;

const reviews = [
  {
    title: 'Great value & very well stocked',
    quote:
      'Everything was great! House was clean, pool and spa were clean. The kitchen was extremely well stocked.',
    name: 'Todd',
  },
  {
    title: 'Every detail was thought out',
    quote:
      'Awesome location and the house is in great shape, well stocked, and every detail was well thought out. Highly recommend!',
    name: 'John',
  },
  {
    title: 'Exactly what we needed',
    quote:
      'House was extremely well kept and had everything we needed. We really enjoyed our stay!',
    name: 'Rachel',
  },
] as const;

const destinationGroups = [
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
] as const;

const seasonalEvents = [
  {
    season: 'January · February',
    tone: 'The desert wakes up',
    events: [
      ['The American Express PGA TOUR', 'https://www.theamexgolf.com/'],
      ['Concert Series at The Gardens on El Paseo', 'https://www.simon.com/mall/the-gardens-on-el-paseo/about'],
      ['La Quinta Car Show', 'https://www.lqcarshow.com/'],
      ['Dr. George Charity Car Show', 'https://palmspringscruisinassociation.com/dr-george-charity-car-show/'],
      ['Art on Main Street in La Quinta', 'https://oldtownlaquinta.com/art-on-main-street/'],
      ['Riverside County Fair & Date Festival', 'https://www.datefest.org/'],
    ],
  },
  {
    season: 'March · April',
    tone: 'The headline season',
    events: [
      ['BNP Paribas Open', 'https://bnpparibasopen.com/'],
      ['Fashion Week El Paseo', 'https://fashionweekelpaseo.com/'],
      ['Palm Desert Food & Wine', 'https://palmdesertfoodandwine.com/'],
      ['Coachella', 'https://www.coachella.com/'],
      ['Stagecoach', 'https://www.stagecoachfestival.com/'],
      ['Indian Wells junior tennis', 'https://www.indianwellstennisgarden.com/events/'],
    ],
  },
  {
    season: 'May · September',
    tone: 'Long days, local pace',
    events: [
      ['Greater Palm Springs Restaurant Week', 'https://www.visitgreaterpalmsprings.com/restaurant-week/'],
      ['Thursday VillageFest · summer 7–10pm', 'https://villagefest.org/about-us/'],
      ['Museum, tram & pool days', 'https://www.visitgreaterpalmsprings.com/things-to-do/'],
      ['Summer concerts and arena events', 'https://acrisurearena.com/events/'],
    ],
  },
  {
    season: 'October · December',
    tone: 'Golden-hour season',
    events: [
      ['Palm Desert Golf Cart Parade', 'https://golfcartparade.org/'],
      ['College of the Desert Street Fair · weekends', 'https://codaastreetfair.com/'],
      ['Palm Springs Vintage Market', 'https://palmspringsvintagemarket.com/'],
      ['Indian Wells pickleball events', 'https://www.indianwellstennisgarden.com/events/'],
      ['El Paseo holiday tree lighting', 'https://www.simon.com/mall/the-gardens-on-el-paseo/about'],
      ['Palm Desert Thanksgiving Day 5K', 'https://www.visitgreaterpalmsprings.com/events/'],
      ['Photos with Santa at The Gardens', 'https://www.simon.com/mall/the-gardens-on-el-paseo/about'],
      ['IRONMAN 70.3 La Quinta', 'https://www.ironman.com/races/im703-la-quinta'],
    ],
  },
] as const;

type CalendarResponse = {
  beginDate: string;
  endDate: string;
  statusByDay: Record<string, string>;
  syncedAt: string;
};

const pad = (value: number) => String(value).padStart(2, '0');
const dayKey = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
const displayDate = (key: string | null) => {
  if (!key) return 'Choose a date';
  const date = new Date(
    Number(key.slice(0, 4)),
    Number(key.slice(4, 6)) - 1,
    Number(key.slice(6, 8)),
  );
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

function MonthCalendar({
  month,
  statuses,
  loading,
  selectedStart,
  selectedEnd,
  onSelect,
}: {
  month: Date;
  statuses: Record<string, string>;
  loading: boolean;
  selectedStart: string | null;
  selectedEnd: string | null;
  onSelect: (key: string) => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const blanks = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cells = Array.from({ length: blanks + daysInMonth }, (_, index) =>
    index < blanks ? null : index - blanks + 1,
  );

  return (
    <div className="month-calendar">
      <h3>
        {month.toLocaleString('en-US', { month: 'long' })}{' '}
        <span>{year}</span>
      </h3>
      <div className="weekdays" aria-hidden="true">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day, index) => {
          if (!day) return <span className="empty-day" key={`empty-${index}`} />;
          const date = new Date(year, monthIndex, day);
          const key = dayKey(date);
          const status = statuses[key];
          const past = date < today;
          const unavailable = status === 'NX';
          const checkoutOnly = status === 'NO';
          const inRange =
            Boolean(selectedStart && selectedEnd) &&
            key > selectedStart! &&
            key < selectedEnd!;
          const selected = key === selectedStart || key === selectedEnd;
          const disabled = loading || past || unavailable;
          const label = `${date.toLocaleString('en-US', { month: 'long' })} ${day}, ${year}${
            unavailable ? ', booked' : checkoutOnly ? ', checkout only' : ', available'
          }`;
          return (
            <button
              aria-label={label}
              className={`${unavailable ? 'unavailable' : ''} ${checkoutOnly ? 'limited' : ''} ${inRange ? 'in-range' : ''} ${selected ? 'selected' : ''}`}
              disabled={disabled}
              key={key}
              onClick={() => onSelect(key)}
              type="button"
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null);
  const [calendarError, setCalendarError] = useState(false);
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);

  const baseMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);
  const visibleMonth = new Date(
    baseMonth.getFullYear(),
    baseMonth.getMonth() + monthOffset,
    1,
  );
  const nextMonth = new Date(
    baseMonth.getFullYear(),
    baseMonth.getMonth() + monthOffset + 1,
    1,
  );

  useEffect(() => {
    fetch('/api/availability')
      .then((response) => {
        if (!response.ok) throw new Error('Availability unavailable');
        return response.json() as Promise<CalendarResponse>;
      })
      .then((data) => setCalendar(data))
      .catch(() => setCalendarError(true));
  }, []);

  useEffect(() => {
    if (activePhoto === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
      if (event.key === 'ArrowRight') {
        setActivePhoto((value) => (value === null ? 0 : (value + 1) % photos.length));
      }
      if (event.key === 'ArrowLeft') {
        setActivePhoto((value) =>
          value === null ? 0 : (value - 1 + photos.length) % photos.length,
        );
      }
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [activePhoto]);

  const selectDate = (key: string) => {
    if (!selectedStart || selectedEnd || key <= selectedStart) {
      setSelectedStart(key);
      setSelectedEnd(null);
      return;
    }
    const hasBlockedNight = Object.entries(calendar?.statusByDay ?? {}).some(
      ([date, status]) => date > selectedStart && date < key && status === 'NX',
    );
    if (hasBlockedNight) {
      setSelectedStart(key);
      setSelectedEnd(null);
      return;
    }
    setSelectedEnd(key);
  };

  return (
    <main id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Palmhouse Indian Wells home">
          <img src="/images/logo-palm-houses-transparent.png" alt="Palm Houses" />
          <span>Indian Wells, California</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#home">The home</a>
          <a href="#gallery">Gallery</a>
          <a href="#explore">Explore</a>
          <a href="#story">Our story</a>
        </nav>
        <a className="header-cta" href={EVOLVE_URL} target="_blank" rel="noreferrer">
          Book your stay <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Indian Wells · California</p>
          <h1 id="hero-title">A quieter kind of <em>desert escape.</em></h1>
          <p className="hero-intro">
            A private three-bedroom retreat with a pool, spa, and room to settle in—just
            minutes from world-class tennis, golf, and the best of the Coachella Valley.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#stay">Check availability <span>→</span></a>
          </div>
          <dl className="hero-facts" aria-label="Property facts">
            <div><dt>Guests</dt><dd>6</dd></div>
            <div><dt>Bedrooms</dt><dd>3</dd></div>
            <div><dt>Bathrooms</dt><dd>2</dd></div>
            <div><dt>Reviews</dt><dd>4.98 <span>★</span></dd></div>
          </dl>
        </div>
        <div className="hero-image" role="img" aria-label="Palm-lined private pool at the Indian Wells home">
        </div>
      </section>

      <section className="intro-section" id="home" aria-labelledby="home-title">
        <div className="intro-heading">
          <p className="eyebrow"><span /> Come settle in</p>
          <h2 id="home-title">Room to gather.<br /><em>Space to exhale.</em></h2>
        </div>
        <div className="intro-body">
          <p className="lead">
            Recently refreshed and thoughtfully stocked, Palmhouse pairs an open, sunlit
            interior with the private outdoor living that makes the desert feel effortless.
          </p>
          <p>
            Slide into the pool, unwind in the spa, cook together in the generous kitchen,
            or take a slow evening by the gas fireplace. With three bedrooms, two baths,
            and indoor-outdoor spaces made for conversation, the home gives up to six guests
            an easy place to reconnect.
          </p>
        </div>
      </section>

      <section className="feature-split" aria-label="Property highlights">
        <div className="feature-image feature-image-main" />
        <div className="feature-content">
          <p className="eyebrow light"><span /> The good stuff</p>
          <h2>Everything you need.<br /><em>Nothing you don’t.</em></h2>
          <div className="amenity-list">
            {amenities.map(([title, copy], index) => (
              <article key={title}>
                <span>{pad(index + 1)}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sleep-section" aria-labelledby="sleep-title">
        <div className="sleep-copy">
          <p className="eyebrow"><span /> Rest easy</p>
          <h2 id="sleep-title">Three rooms.<br /><em>Six dreamers.</em></h2>
          <p>Soft light, quiet corners, and a real bed for everyone.</p>
        </div>
        <div className="sleep-cards">
          {[
            ['Primary suite', 'King bed', 'property-06.jpg'],
            ['Guest room', 'Queen bed', 'property-08.jpg'],
            ['Guest room', 'Queen bed', 'property-13.jpg'],
          ].map(([room, bed, image]) => (
            <article key={`${room}-${image}`}>
              <img src={`/images/${image}`} alt={`${room} with ${bed.toLowerCase()}`} />
              <div><span>{room}</span><h3>{bed}</h3></div>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow"><span /> Have a look around</p>
            <h2 id="gallery-title">Made for<br /><em>slow mornings.</em></h2>
          </div>
          <button className="text-button" type="button" onClick={() => setActivePhoto(0)}>
            View all {photos.length} photos <span>↗</span>
          </button>
        </div>
        <div className="gallery-grid">
          {[1, 0, 3, 2, 10, 6, 14].map((photoIndex, gridIndex) => (
            <button
              className={`gallery-item gallery-item-${gridIndex + 1}`}
              key={photos[photoIndex][0]}
              onClick={() => setActivePhoto(photoIndex)}
              type="button"
            >
              <img src={`/images/${photos[photoIndex][0]}`} alt={photos[photoIndex][1]} />
              <span>{photos[photoIndex][1]}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="availability-section" id="stay" aria-labelledby="availability-title">
        <div className="availability-intro">
          <p className="eyebrow light"><span /> Plan your stay</p>
          <h2 id="availability-title">Find your place<br /><em>in the sun.</em></h2>
          <p>
            This calendar reads current availability from the Evolve listing. Select a
            possible stay, then continue to Evolve for the latest rate, policies, and secure
            booking.
          </p>
          <div className="calendar-legend">
            <span><i className="available-dot" /> Available</span>
            <span><i className="unavailable-dot" /> Booked</span>
            <span><i className="limited-dot" /> Checkout only</span>
          </div>
          <p className="source-note">
            {calendarError
              ? 'Live calendar is temporarily unavailable. Evolve has the current dates.'
              : calendar
                ? 'Live availability loaded from Evolve.'
                : 'Loading live availability…'}
          </p>
        </div>
        <div className="calendar-panel">
          <div className="calendar-controls">
            <button
              aria-label="Previous month"
              disabled={monthOffset === 0}
              onClick={() => setMonthOffset((value) => Math.max(0, value - 1))}
              type="button"
            >
              ←
            </button>
            <span>Choose your dates</span>
            <button
              aria-label="Next month"
              onClick={() => setMonthOffset((value) => Math.min(11, value + 1))}
              type="button"
            >
              →
            </button>
          </div>
          <div className="calendar-months">
            <MonthCalendar
              loading={!calendar && !calendarError}
              month={visibleMonth}
              onSelect={selectDate}
              selectedEnd={selectedEnd}
              selectedStart={selectedStart}
              statuses={calendar?.statusByDay ?? {}}
            />
            <MonthCalendar
              loading={!calendar && !calendarError}
              month={nextMonth}
              onSelect={selectDate}
              selectedEnd={selectedEnd}
              selectedStart={selectedStart}
              statuses={calendar?.statusByDay ?? {}}
            />
          </div>
          <div className="booking-bar">
            <div><span>Check in</span><strong>{displayDate(selectedStart)}</strong></div>
            <div><span>Check out</span><strong>{displayDate(selectedEnd)}</strong></div>
            <a href={EVOLVE_URL} target="_blank" rel="noreferrer">
              Continue on Evolve <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow"><span /> Guest notes</p>
            <h2 id="reviews-title">The kind words<br /><em>we keep.</em></h2>
          </div>
          <div className="rating-lockup"><strong>4.98</strong><span>★★★★★<br />51 Evolve reviews</span></div>
        </div>
        <div className="review-grid">
          {reviews.map((review, index) => (
            <article key={review.name}>
              <span className="quote-mark">“</span>
              <p>{review.quote}</p>
              <footer><div><strong>{review.title}</strong><span>{review.name} · Evolve guest</span></div><span>0{index + 1}</span></footer>
            </article>
          ))}
        </div>
        <a className="text-button inline-link" href={`${EVOLVE_URL}#reviews`} target="_blank" rel="noreferrer">
          Read all reviews on Evolve <span>↗</span>
        </a>
      </section>

      <section className="explore-section" id="explore" aria-labelledby="explore-title">
        <div className="explore-header">
          <p className="eyebrow light"><span /> Beyond the backyard</p>
          <h2 id="explore-title">Close to everything.<br /><em>Far from ordinary.</em></h2>
          <p>
            Indian Wells puts the whole valley within reach—from stadium seats and festival
            stages to mountain trails, date shakes, gallery walks, and more than 110 golf courses.
          </p>
        </div>
        <div className="destination-grid">
          {destinationGroups.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>
              <span className="destination-number">{item.number}</span>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <div><span>{item.copy}</span><strong>{item.meta}</strong></div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
        <div className="local-strip">
          {[
            ['El Paseo', '4 mi', 'Shopping, dining & design'],
            ['Old Town La Quinta', '4.9 mi', 'Patios, cafés & village charm'],
            ['The Living Desert', '5.8 mi', 'Wildlife & desert gardens'],
            ['Palm Springs', '18 mi', 'Art, architecture & nightlife'],
            ['Aerial Tramway', '28.2 mi', 'A cool climb above the valley'],
          ].map(([name, distance, copy]) => (
            <article key={name}><span>{distance}</span><h3>{name}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="events-flow" aria-labelledby="events-title">
          <div className="events-heading">
            <div>
              <p className="eyebrow light"><span /> Save the season</p>
              <h2 id="events-title">There’s always a<br /><em>reason to return.</em></h2>
            </div>
            <p>
              A guest-friendly calendar of the valley’s signature traditions. Event dates can
              move each year, so follow the links for the current schedule before making plans.
            </p>
          </div>
          <div className="season-grid">
            {seasonalEvents.map((block, index) => (
              <article key={block.season}>
                <span>0{index + 1}</span>
                <p>{block.season}</p>
                <h3>{block.tone}</h3>
                <ul>
                  {block.events.map(([event, href]) => (
                    <li key={event}><a href={href} target="_blank" rel="noreferrer">{event}<span>↗</span></a></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section" id="story" aria-labelledby="story-title">
        <div className="story-mark"><img src="/images/logo-palm-houses-transparent.png" alt="" /></div>
        <div className="story-copy">
          <p className="eyebrow"><span /> A note from the owners</p>
          <h2 id="story-title">A home made<br /><em>for gathering.</em></h2>
          <blockquote>
            “We want every stay at Palmhouse to feel uncomplicated: a stocked kitchen, a
            comfortable bed, a quiet pool, and the freedom to enjoy the desert at your own pace.”
          </blockquote>
          <p>
            We care for this place as a home, not a hotel room. The details are simple on
            purpose—spaces that invite you to linger, useful things where you expect to find
            them, and an easy base for whichever version of the valley brought you here.
          </p>
        </div>
        <div className="story-image" />
      </section>

      <section className="final-cta" aria-labelledby="final-title">
        <span className="final-sun" aria-hidden="true" />
        <p>Indian Wells · California</p>
        <h2 id="final-title">Your desert days<br /><em>start here.</em></h2>
        <a href={EVOLVE_URL} target="_blank" rel="noreferrer">View dates & book on Evolve <span>↗</span></a>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/images/logo-palm-houses-transparent.png" alt="Palm Houses" /><p>A private desert retreat in Indian Wells, California.</p></div>
        <nav aria-label="Footer navigation">
          <a href="#home">The home</a><a href="#gallery">Gallery</a><a href="#stay">Availability</a><a href="#explore">Explore</a>
        </nav>
        <div className="footer-end"><a href={EVOLVE_URL} target="_blank" rel="noreferrer">Evolve listing 435461 ↗</a><span>indianwells.us</span></div>
      </footer>

      {activePhoto !== null && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label="Property photo gallery">
          <button className="modal-close" aria-label="Close gallery" onClick={() => setActivePhoto(null)} type="button">×</button>
          <button className="modal-arrow modal-prev" aria-label="Previous photo" onClick={() => setActivePhoto((activePhoto - 1 + photos.length) % photos.length)} type="button">←</button>
          <figure>
            <img src={`/images/${photos[activePhoto][0]}`} alt={photos[activePhoto][1]} />
            <figcaption><span>{pad(activePhoto + 1)} / {photos.length}</span><p>{photos[activePhoto][1]}</p></figcaption>
          </figure>
          <button className="modal-arrow modal-next" aria-label="Next photo" onClick={() => setActivePhoto((activePhoto + 1) % photos.length)} type="button">→</button>
        </div>
      )}
    </main>
  );
}
