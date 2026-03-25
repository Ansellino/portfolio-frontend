import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const viteEnv = loadEnv(process.env.NODE_ENV || 'production', rootDir, '');

const SITE_URL = (process.env.VITE_SITE_URL || viteEnv.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '');
const API_BASE_URL = (process.env.VITE_API_BASE_URL || viteEnv.VITE_API_BASE_URL || '').replace(/\/$/, '');

const staticRoutes = ['/', '/projects', '/experience', '/certifications', '/blog', '/about', '/contact'];

function unwrapList(payload) {
  const body = payload?.data ?? payload;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

async function fetchSlugs(endpoint) {
  if (!API_BASE_URL) return [];

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) return [];

    const payload = await response.json();
    return unwrapList(payload)
      .map((item) => item?.slug)
      .filter((slug) => typeof slug === 'string' && slug.length > 0);
  } catch {
    return [];
  }
}

function toUrlEntry(route, priority = '0.7', changefreq = 'weekly') {
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;
  return [
    '  <url>',
    `    <loc>${SITE_URL}${cleanRoute}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

async function main() {
  const [projectSlugs, blogSlugs] = await Promise.all([
    fetchSlugs('/projects?isPublished=true&limit=1000'),
    fetchSlugs('/blog?isPublished=true&limit=1000'),
  ]);

  const dynamicProjectRoutes = projectSlugs.map((slug) => `/projects/${slug}`);
  const dynamicBlogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

  const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicProjectRoutes, ...dynamicBlogRoutes]));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map((route) => {
      if (route === '/') return toUrlEntry(route, '1.0', 'daily');
      if (route.startsWith('/blog/')) return toUrlEntry(route, '0.8', 'weekly');
      if (route.startsWith('/projects/')) return toUrlEntry(route, '0.8', 'weekly');
      return toUrlEntry(route);
    }),
    '</urlset>',
  ].join('\n');

  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

  const robotsTxt = [
    'User-agent: *',
    'Disallow: /admin/',
    'Disallow: /admin/*',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ].join('\n');

  await writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
}

main();
