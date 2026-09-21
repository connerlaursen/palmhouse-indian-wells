import { env } from 'cloudflare:workers';
import {
  getCloudflareAccessUser,
  type CloudflareAccessUser,
} from '@/app/cloudflare-access';

const LOCAL_ADMIN_EMAIL = 'seedy@sites.test';

function configuredAdminEmails(): Set<string> {
  const configuredEmails = env.ADMIN_EMAILS?.trim() || env.ADMIN_EMAIL?.trim();
  if (!configuredEmails) return new Set();

  return new Set(
    configuredEmails
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminUser(user: CloudflareAccessUser) {
  const configuredEmails = configuredAdminEmails();
  if (configuredEmails.size > 0) {
    return configuredEmails.has(user.email.trim().toLowerCase());
  }
  return process.env.NODE_ENV !== 'production' && user.email === LOCAL_ADMIN_EMAIL;
}

export async function getAdminUser() {
  const user = await getCloudflareAccessUser();
  return user && isAdminUser(user) ? user : null;
}
