import { NextResponse } from 'next/server';

const CALENDAR_URL = 'https://evolve.com/api/calendar?listingId=435461';

type EvolveCalendarData = {
  availability?: {
    beginDate?: string;
    endDate?: string;
    apcdByDate?: Array<Record<string, string>>;
  };
};

export async function GET() {
  try {
    const response = await fetch(CALENDAR_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) throw new Error(`Evolve returned ${response.status}`);

    const data = (await response.json()) as EvolveCalendarData;
    const availability = data?.availability;
    const statusByDay = availability?.apcdByDate?.[0] ?? {};

    return NextResponse.json(
      {
        beginDate: availability?.beginDate ?? null,
        endDate: availability?.endDate ?? null,
        statusByDay,
        syncedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: 'Live availability is temporarily unavailable.' },
      { status: 502 },
    );
  }
}
