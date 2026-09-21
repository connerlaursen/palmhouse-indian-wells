import { NextResponse } from 'next/server';
import { getCloudflareAccessUser } from '@/app/cloudflare-access';
import { isAdminUser } from '@/app/admin-auth';
import { getSiteContent, saveSiteContent } from '@/db/site-content';
import { isSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

async function authorize() {
  const user = await getCloudflareAccessUser();
  if (!user) return { error: NextResponse.json({ error: 'Sign in required.' }, { status: 401 }) };
  if (!isAdminUser(user)) {
    return { error: NextResponse.json({ error: 'This account does not have access.' }, { status: 403 }) };
  }
  return { user };
}

export async function GET() {
  const auth = await authorize();
  if (auth.error) return auth.error;
  return NextResponse.json(await getSiteContent(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(request: Request) {
  const auth = await authorize();
  if (auth.error || !auth.user) return auth.error;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'The editor sent invalid data.' }, { status: 400 });
  }

  if (!isSiteContent(payload)) {
    return NextResponse.json(
      { error: 'Complete every field and use full http:// or https:// links.' },
      { status: 400 },
    );
  }

  const saved = await saveSiteContent(payload, auth.user.email);
  return NextResponse.json(saved, { headers: { 'Cache-Control': 'no-store' } });
}
