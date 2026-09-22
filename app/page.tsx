'use client';

import { useEffect, useMemo, useState } from 'react';
import { defaultSiteContent, type SiteContent } from '@/lib/site-content';

const EVOLVE_URL =
  'https://evolve.com/vacation-rentals/us/ca/indian-wells/435461';

const photos = [
  ['gallery-01.jpg', 'Private pool and sun deck'],
  ['gallery-02.jpg', 'Shaded patio seating'],
  ['gallery-03.jpg', 'Open-plan living and kitchen'],
  ['gallery-04.jpg', 'Living room with fireplace'],
  ['gallery-05.jpg', 'Living room'],
  ['gallery-06.jpg', 'Open-plan gathering space'],
  ['gallery-07.jpg', 'Dedicated workspace'],
  ['gallery-08.jpg', 'Quiet sitting area'],
  ['gallery-09.jpg', 'Open-plan living area'],
  ['gallery-10.jpg', 'Chef-ready kitchen'],
  ['gallery-11.jpg', 'Chef-ready kitchen'],
  ['gallery-12.jpg', 'Chef-ready kitchen'],
  ['gallery-13.jpg', 'Dining area'],
  ['gallery-14.jpg', 'Dining table for the whole group'],
  ['gallery-15.jpg', 'Primary bedroom with king bed'],
  ['gallery-16.jpg', 'Primary suite'],
  ['gallery-17.jpg', 'Primary bedroom details'],
  ['gallery-18.jpg', 'Full bathroom'],
  ['gallery-19.jpg', 'Primary shower and tub'],
  ['gallery-20.jpg', 'Second bedroom with queen bed'],
  ['gallery-21.jpg', 'Second bedroom'],
  ['gallery-22.jpg', 'Full bathroom'],
  ['gallery-23.jpg', 'Third bedroom with queen bed'],
  ['gallery-24.jpg', 'Third bedroom'],
  ['gallery-25.jpg', 'Third bedroom and dresser'],
  ['gallery-26.jpg', 'Laundry room'],
  ['gallery-27.jpg', 'Poolside dining area'],
  ['gallery-28.jpg', 'Outdoor dining beside the pool'],
  ['gallery-29.jpg', 'Barbecue and dog-friendly yard'],
  ['gallery-30.jpg', 'Private spa and poolside seating'],
  ['gallery-31.jpg', 'Outdoor lounge beside the pool'],
  ['gallery-32.jpg', 'Private pool and backyard'],
  ['gallery-33.jpg', 'Pool with sun loungers'],
  ['gallery-34.jpg', 'Poolside chaises and shaded seating'],
  ['gallery-35.jpg', 'Pool and rear exterior'],
  ['gallery-36.jpg', 'Fire-pit seating beside the pool'],
  ['gallery-37.jpg', 'Backyard pool and fire-pit lounge'],
  ['gallery-38.jpg', 'Backyard seating and outdoor rinse station'],
  ['gallery-39.jpg', 'Landscaped front walkway'],
  ['gallery-40.jpg', 'Covered front entry'],
  ['gallery-41.jpg', 'Driveway parking for three vehicles'],
  ['gallery-42.jpg', 'Front exterior and desert landscaping'],
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

type CalendarResponse = {
  beginDate: string;
  endDate: string;
  statusByDay: Record<string, string>;
  syncedAt: string;
};

const pad = (value: number) => String(value).padStart(2, '0');
const dayKey = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;

function MonthCalendar({
  month,
  statuses,
  loading,
}: {
  month: Date;
  statuses: Record<string, string>;
  loading: boolean;
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
          const disabled = loading || past || unavailable;
          const label = `${date.toLocaleString('en-US', { month: 'long' })} ${day}, ${year}${
            unavailable ? ', booked' : checkoutOnly ? ', checkout only' : ', available'
          }`;
          return (
            <time
              aria-label={label}
              className={`calendar-day ${unavailable ? 'unavailable' : ''} ${checkoutOnly ? 'limited' : ''} ${disabled ? 'disabled' : ''}`}
              dateTime={`${year}-${pad(monthIndex + 1)}-${pad(day)}`}
              key={key}
            >
              {day}
            </time>
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
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [evolveStats, setEvolveStats] = useState({ rating: 4.98, reviewCount: 51 });

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
    Promise.allSettled([
      fetch('/api/site-content').then(async (response) => {
        if (!response.ok) throw new Error('Content unavailable');
        setSiteContent((await response.json()) as SiteContent);
      }),
      fetch('/api/evolve-stats').then(async (response) => {
        if (!response.ok) throw new Error('Ratings unavailable');
        const data = (await response.json()) as { rating: number; reviewCount: number };
        setEvolveStats({ rating: data.rating, reviewCount: data.reviewCount });
      }),
    ]);
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
          <h1 id="hero-title">A carefree <em>desert escape.</em></h1>
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
            <div><dt>Reviews</dt><dd>{evolveStats.rating.toFixed(2)} <span>★</span></dd></div>
          </dl>
        </div>
        <div className="hero-image" role="img" aria-label="Palm-lined private pool at the Indian Wells home">
        </div>
      </section>

      <section className="intro-section" id="home" aria-labelledby="home-title">
        <div className="intro-heading">
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
          <h2 id="sleep-title">Three rooms.<br /><em>Six dreamers.</em></h2>
          <p>Soft light, quiet corners, and a real bed for everyone.</p>
        </div>
        <div className="sleep-cards">
          {[
            ['Primary suite', 'King bed', 'property-06.jpg'],
            ['Guest room', 'Queen bed', 'bedroom-02-evolve-20.jpg'],
            ['Guest room', 'Queen bed', 'bedroom-03-evolve-25.jpg'],
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
            <h2 id="gallery-title">For any occasion<br /><em>picture yourself here.</em></h2>
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
          <h2 id="availability-title">Claim your place<br /><em>in the sun.</em></h2>
          <p>
            View availability below. Then, select <strong>BOOK YOUR STAY</strong> which will
            take you to our booking agent website, Evolve, for the latest rates, policies and
            secure booking.
          </p>
          <div className="calendar-legend">
            <span><i className="available-dot" /> Available</span>
            <span><i className="unavailable-dot" /> Booked</span>
            <span><i className="limited-dot" /> Checkout only</span>
          </div>
          {!calendar && (
            <p className="source-note">
              {calendarError
                ? 'Live calendar is temporarily unavailable. Evolve has the current dates.'
                : 'Loading live availability…'}
            </p>
          )}
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
            <span>Availability calendar</span>
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
              statuses={calendar?.statusByDay ?? {}}
            />
            <MonthCalendar
              loading={!calendar && !calendarError}
              month={nextMonth}
              statuses={calendar?.statusByDay ?? {}}
            />
          </div>
          <div className="booking-bar">
            <a href={EVOLVE_URL} target="_blank" rel="noreferrer">
              Book your stay <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div>
            <h2 id="reviews-title">The kind words<br /><em>we keep.</em></h2>
          </div>
          <div className="rating-lockup">
            <strong>{evolveStats.rating.toFixed(2)}</strong>
            <span>★★★★★<br />{evolveStats.reviewCount} Evolve {evolveStats.reviewCount === 1 ? 'review' : 'reviews'}</span>
          </div>
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
          <h2 id="explore-title">Close to everything.<br /><em>Far from ordinary.</em></h2>
          <p>
            Indian Wells puts the whole valley within reach—from stadium seats and festival
            stages to mountain trails, date shakes, gallery walks, and more than 110 golf courses.
          </p>
        </div>
        <div className="destination-grid">
          {siteContent.destinations.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>
              <p>{item.label}</p>
              <h3>{item.title}</h3>
              <div><span>{item.copy}</span><strong>{item.meta}</strong></div>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
        <div className="local-strip">
          {siteContent.localLinks.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.name}>
              <span>{item.distance}</span><h3>{item.name}</h3><p>{item.copy}</p><b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
        <div className="events-flow" aria-labelledby="events-title">
          <div className="events-heading">
            <div>
              <h2 id="events-title">There’s always a<br /><em>reason to return.</em></h2>
            </div>
            <p>
              A guest-friendly calendar of the valley’s signature traditions. Event dates can
              move each year, so follow the links for the current schedule before making plans.
            </p>
          </div>
          <div className="season-grid">
            {siteContent.seasons.map((block) => (
              <article key={block.season}>
                <p>{block.season}</p>
                <h3>{block.tone}</h3>
                <ul>
                  {block.events.map((event) => (
                    <li key={`${event.label}-${event.href}`}><a href={event.href} target="_blank" rel="noreferrer">{event.label}<span>↗</span></a></li>
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
        <div className="footer-end"><a href="/admin">Sitekeeper login ↗</a><span>indianwells.us</span></div>
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
