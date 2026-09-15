import { env } from 'cloudflare:workers';
import { getChatGPTUser, type ChatGPTUser } from '@/app/chatgpt-auth';

const LOCAL_ADMIN_EMAIL = 'seedy@sites.test';

export function isAdminUser(user: ChatGPTUser) {
  const configuredEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configuredEmail) return user.email.trim().toLowerCase() === configuredEmail;
  return process.env.NODE_ENV !== 'production' && user.email === LOCAL_ADMIN_EMAIL;
}

export async function getAdminUser() {
  const user = await getChatGPTUser();
  return user && isAdminUser(user) ? user : null;
}
