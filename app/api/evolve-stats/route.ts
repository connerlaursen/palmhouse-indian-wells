import { NextResponse } from 'next/server';

const LISTING_URL = 'https://evolve.com/vacation-rentals/us/ca/indian-wells/435461';
const READER_URL = `https://r.jina.ai/https://${LISTING_URL.replace(/^https?:\/\//, '')}`;
const ALGOLIA_APP_ID = '2U6AXFDIV3';
// This is Evolve's browser-exposed, search-only key; it cannot modify their index.
const ALGOLIA_SEARCH_KEY = 'bb822d4fb11ce6c3a7356f182a0d5c90';
const ALGOLIA_RECORD_URL =
  `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/prod_EvolveListings/435461` +
  '?attributesToRetrieve=Average%20Rating%2CNumber%20of%20Reviews%2CobjectID';
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

function parseReaderMarkdown(markdown: string): Stats | null {
  const reviewsSection = markdown.match(
    /## Reviews\s+([0-5](?:\.\d{1,2})?)\s+([\d,]+) reviews?/i,
  );
  if (!reviewsSection) return null;
  return validStats(reviewsSection[1], reviewsSection[2].replaceAll(',', ''));
}

async function fetchDirectStats() {
  const response = await fetch(LISTING_URL, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (compatible; PalmhouseIndianWells/1.0)',
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Evolve returned ${response.status}`);
  return parseEmbeddedJson(await response.text());
}

async function fetchAlgoliaStats() {
  const response = await fetch(ALGOLIA_RECORD_URL, {
    headers: {
      'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      'X-Algolia-API-Key': ALGOLIA_SEARCH_KEY,
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Evolve index returned ${response.status}`);
  const record = (await response.json()) as Record<string, unknown>;
  const stats = validStats(record['Average Rating'], record['Number of Reviews']);
  if (!stats) throw new Error('Evolve index did not include review totals');
  return stats;
}

async function fetchReaderStats() {
  const response = await fetch(READER_URL, {
    headers: {
      Accept: 'text/plain',
      'User-Agent': 'Mozilla/5.0 (compatible; PalmhouseIndianWells/1.0)',
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Reader returned ${response.status}`);
  const stats = parseReaderMarkdown(await response.text());
  if (!stats) throw new Error('Reader response did not include review totals');
  return stats;
}

export async function GET() {
  const diagnostics: string[] = [];
  let stats: Stats | null = null;
  try {
    stats = await fetchAlgoliaStats();
  } catch (error) {
    diagnostics.push(error instanceof Error ? error.message : 'Evolve index request failed');
  }
  if (!stats) {
    try {
      stats = await fetchDirectStats();
    } catch (error) {
      diagnostics.push(error instanceof Error ? error.message : 'Direct Evolve request failed');
    }
  }
  if (!stats) {
    try {
      stats = await fetchReaderStats();
    } catch (error) {
      diagnostics.push(error instanceof Error ? error.message : 'Reader request failed');
    }
  }

  if (stats) {
    return NextResponse.json(
      { ...stats, live: true, syncedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  }

  return NextResponse.json(
    { ...FALLBACK, live: false, syncedAt: null, diagnostics },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  );
}
