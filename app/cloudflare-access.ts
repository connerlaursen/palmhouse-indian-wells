import { env } from 'cloudflare:workers';
import { headers } from 'next/headers';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export type CloudflareAccessUser = {
  userId: string;
  displayName: string;
  email: string;
};

const LOCAL_USER: CloudflareAccessUser = {
  userId: 'local-sitekeeper',
  displayName: 'Local sitekeeper',
  email: 'seedy@sites.test',
};

const jwksByUrl = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function normalizeTeamDomain(value: string): string {
  return value
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

function accessJwks(teamDomain: string) {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  let jwks = jwksByUrl.get(url);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(url));
    jwksByUrl.set(url, jwks);
  }
  return jwks;
}

function payloadEmail(payload: JWTPayload): string | null {
  return typeof payload.email === 'string' && payload.email.includes('@')
    ? payload.email.trim().toLowerCase()
    : null;
}

export async function getCloudflareAccessUser(): Promise<CloudflareAccessUser | null> {
  const teamDomainValue = env.CF_ACCESS_TEAM_DOMAIN?.trim();
  const audience = env.CF_ACCESS_AUD?.trim();

  if (process.env.NODE_ENV !== 'production' && (!teamDomainValue || !audience)) {
    return LOCAL_USER;
  }

  if (!teamDomainValue || !audience) return null;

  const requestHeaders = await headers();
  const token = requestHeaders.get('cf-access-jwt-assertion');
  if (!token) return null;

  const teamDomain = normalizeTeamDomain(teamDomainValue);

  try {
    const { payload } = await jwtVerify(token, accessJwks(teamDomain), {
      audience,
      issuer: `https://${teamDomain}`,
    });
    const email = payloadEmail(payload);
    if (!email) return null;

    return {
      userId: typeof payload.sub === 'string' ? payload.sub : email,
      displayName: email,
      email,
    };
  } catch {
    return null;
  }
}

export function cloudflareAccessSignOutPath(): string {
  return '/cdn-cgi/access/logout';
}
