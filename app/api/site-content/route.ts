import { NextResponse } from 'next/server';
import { getSiteContent } from '@/db/site-content';
import { defaultSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json(defaultSiteContent, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
    });
  }
}
