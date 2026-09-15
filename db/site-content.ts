import { env } from 'cloudflare:workers';
import {
  defaultSiteContent,
  isSiteContent,
  type SiteContent,
} from '@/lib/site-content';

const CONTENT_ID = 'main';

async function ensureTable() {
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      updated_by TEXT NOT NULL
    )`,
  ).run();
}

export async function getSiteContent(): Promise<SiteContent> {
  await ensureTable();
  const row = await env.DB.prepare(
    'SELECT content FROM site_content WHERE id = ?',
  ).bind(CONTENT_ID).first<{ content: string }>();

  if (row) {
    try {
      const parsed: unknown = JSON.parse(row.content);
      if (isSiteContent(parsed)) return parsed;
    } catch {
      // Replace malformed stored content with the safe defaults below.
    }
  }

  await saveSiteContent(defaultSiteContent, 'system');
  return defaultSiteContent;
}

export async function saveSiteContent(content: SiteContent, updatedBy: string) {
  await ensureTable();
  const updatedAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO site_content (id, content, updated_at, updated_by)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       updated_at = excluded.updated_at,
       updated_by = excluded.updated_by`,
  ).bind(CONTENT_ID, JSON.stringify(content), updatedAt, updatedBy).run();

  return { content, updatedAt };
}
