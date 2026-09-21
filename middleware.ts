import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0].toLowerCase();
  if (hostname !== 'indianwells.us') return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.protocol = 'https:';
  destination.hostname = 'www.indianwells.us';
  destination.port = '';
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: '/:path*',
};
