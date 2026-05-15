// Centralized env access. Backend URL and site URL fall back to the
// SOP-locked production values when env vars are missing — this keeps dev
// from blowing up on URL parse errors before .env.local is wired up, and
// matches what Vercel will run with anyway.

const DEFAULT_BACKEND_URL = 'https://www.apexflowlabs.com';
const DEFAULT_SITE_URL = 'https://books.apexflowlabs.com';

export const env = {
  backendUrl: (process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, ''),
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
  apiBearer: process.env.APEX_API_BEARER ?? '',
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? '',
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL ?? '',
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',
};
