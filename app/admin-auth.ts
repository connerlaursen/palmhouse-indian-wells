import { env } from 'cloudflare:workers';
import {
  getCloudflareAccessUser,
  type CloudflareAccessUser,
} from '@/app/cloudflare-access';

const LOCAL_ADMIN_EMAIL = 'seedy@sites.test';

export function isAdminUser(user: CloudflareAccessUser) {
  const configuredEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configuredEmail) return user.email.trim().toLowerCase() === configuredEmail;
  return process.env.NODE_ENV !== 'production' && user.email === LOCAL_ADMIN_EMAIL;
}

export async function getAdminUser() {
  const user = await getCloudflareAccessUser();
  return user && isAdminUser(user) ? user : null;
}
