import Link from 'next/link';
import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';
import { isAdminUser } from '@/app/admin-auth';
import { getSiteContent } from '@/db/site-content';
import { defaultSiteContent } from '@/lib/site-content';
import AdminEditor from './AdminEditor';
import './admin.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');

  if (!isAdminUser(user)) {
    return (
      <main className="admin-gate">
        <Link className="admin-wordmark" href="/">Palmhouse · Indian Wells</Link>
        <section>
          <p className="admin-kicker">Private sitekeeper</p>
          <h1>This account doesn’t have access.</h1>
          <p>Sign in with the owner account, or return to the public website.</p>
          <div className="admin-gate-actions">
            <a href={chatGPTSignOutPath('/admin')}>Use another account</a>
            <Link href="/">Return to the website</Link>
          </div>
        </section>
      </main>
    );
  }

  let content = defaultSiteContent;
  try {
    content = await getSiteContent();
  } catch {
    // The editor remains usable with safe defaults if D1 needs to initialize.
  }

  return (
    <AdminEditor
      initialContent={content}
      userName={user.displayName}
      signOutPath={chatGPTSignOutPath('/')}
    />
  );
}
