declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    ADMIN_EMAIL?: string;
    ADMIN_EMAILS?: string;
    CF_ACCESS_AUD?: string;
    CF_ACCESS_TEAM_DOMAIN?: string;
  }
}
