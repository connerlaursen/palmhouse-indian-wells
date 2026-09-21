# Palmhouse Indian Wells

A responsive vacation-rental website for a private desert home in Indian Wells, California.

Production domain: [www.indianwells.us](https://www.indianwells.us)

The application is deployed directly to Cloudflare Workers and uses a
Cloudflare D1 database. The private sitekeeper routes are protected with
Cloudflare Access.

## Features

- 42-photo property gallery
- Live Evolve availability calendar
- Automatically refreshed Evolve rating and review count
- Local attractions and seasonal event guide
- Private, owner-only Sitekeeper editor for attraction and event content
- Mobile, tablet, and desktop layouts

## Local development

This project uses Node.js 22+, pnpm, Next.js, Vinext, and Cloudflare D1.

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

The hosted Sitekeeper authorization allowlist is configured with the comma-separated `ADMIN_EMAILS` runtime environment variable. The singular `ADMIN_EMAIL` variable remains supported for backwards compatibility. Do not commit private credentials or local environment files.
