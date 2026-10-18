export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      (url.startsWith("https://") || url.startsWith("http://")) &&
      !url.includes("paste-your") &&
      !key.includes("paste-your")
  );
}

export function getSiteUrl(): string {
  let siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  siteUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return siteUrl.replace(/\/$/, "");
}
