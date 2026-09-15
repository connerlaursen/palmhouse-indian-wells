import { NextResponse } from 'next/server';

const LISTING_URL = 'https://evolve.com/vacation-rentals/us/ca/indian-wells/435461';
const FALLBACK = { rating: 4.98, reviewCount: 51 };

type Stats = typeof FALLBACK;

function validStats(rating: unknown, reviewCount: unknown): Stats | null {
  const parsedRating = Number(rating);
  const parsedCount = Number(reviewCount);
  if (
    !Number.isFinite(parsedRating) ||
    parsedRating <= 0 ||
    parsedRating > 5 ||
    !Number.isInteger(parsedCount) ||
    parsedCount < 0
  ) {
    return null;
  }
  return { rating: parsedRating, reviewCount: parsedCount };
}

function findStats(value: unknown): Stats | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;

  const direct = validStats(
    item.ratingValue ?? item['Average Rating'],
    item.reviewCount ?? item['Number of Reviews'],
  );
  if (direct) return direct;

  for (const child of Object.values(item)) {
    if (Array.isArray(child)) {
      for (const entry of child) {
        const found = findStats(entry);
        if (found) return found;
      }
    } else if (child && typeof child === 'object') {
      const found = findStats(child);
      if (found) return found;
    }
  }
  return null;
}

function parseEmbeddedJson(html: string): Stats | null {
  const scripts = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    const body = match[1]?.trim();
    if (!body || (!body.startsWith('{') && !body.startsWith('['))) continue;
    try {
      const found = findStats(JSON.parse(body));
      if (found) return found;
    } catch {
      // Ignore ordinary script tags and keep looking for JSON-LD/Next data.
    }
  }
  return null;
}

export async function GET() {
  try {
    const response = await fetch(LISTING_URL, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (compatible; PalmhouseIndianWells/1.0)',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error(`Evolve returned ${response.status}`);
    const stats = parseEmbeddedJson(await response.text());
    if (!stats) throw new Error('Evolve rating data was not present.');

    return NextResponse.json(
      { ...stats, live: true, syncedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json(
      { ...FALLBACK, live: false, syncedAt: null },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    );
  }
}
