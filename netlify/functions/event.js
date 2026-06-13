import { getStore } from '@netlify/blobs';

const ALLOWED_EVENTS = new Set([
  // Pages (Eleventy output paths — case matches filename)
  'page_view:/',
  'page_view:/about/',
  'page_view:/process/',
  'page_view:/projects/',
  'page_view:/fieldnotes/',
  'page_view:/projects/Barometer/',
  'page_view:/projects/Sophos/',
  'page_view:/projects/Wellkind/',
  'page_view:/projects/Cornerstone/',
  'page_view:/projects/eFuse/',
  // Project card clicks (from .project-card id = client slug in frontmatter)
  'project_card_click:barometer',
  'project_card_click:sophos',
  'project_card_click:wellkind',
  'project_card_click:al',  // Cornerstone — client slug is "al" (Angie's List)
  'project_card_click:efuse',
  // UI interactions
  'theme_toggle',
]);

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!ALLOWED_EVENTS.has(body?.e)) {
    return new Response(null, { status: 400 });
  }

  const store = getStore('events');
  const key = new Date().toISOString().slice(0, 10);
  const existing = (await store.get(key)) ?? '';
  const line = JSON.stringify({ t: Date.now(), e: body.e }) + '\n';
  await store.set(key, existing + line);

  return new Response(null, { status: 204 });
};

export const config = { path: '/api/event' };
