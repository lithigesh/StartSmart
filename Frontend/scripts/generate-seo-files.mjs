import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");

const normalizeUrl = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const getSiteUrl = () => {
  // Prefer explicit env vars; fall back to Vercel-provided values.
  const explicit =
    process.env.SITE_URL ||
    process.env.VITE_SITE_URL ||
    process.env.VITE_PUBLIC_URL ||
    process.env.PUBLIC_URL;

  if (explicit) return normalizeUrl(explicit);

  // Vercel: VERCEL_URL is usually like "my-app.vercel.app" (no protocol)
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return normalizeUrl(`https://${vercelUrl}`);

  // Local fallback
  return "http://localhost:5173";
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const writeFile = (filePath, contents) => {
  fs.writeFileSync(filePath, contents, "utf8");
};

const isoDate = new Date().toISOString().slice(0, 10);
const siteUrl = getSiteUrl();

const publicRoutes = ["/"];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicRoutes
  .map((route) => {
    const loc = `${siteUrl}${route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${isoDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "/" ? "1.0" : "0.7"}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/
Disallow: /investor
Disallow: /investor/
Disallow: /entrepreneur
Disallow: /entrepreneur/
Disallow: /submit-idea
Disallow: /edit-idea

Sitemap: ${siteUrl}/sitemap.xml
`;

ensureDir(publicDir);
writeFile(path.join(publicDir, "sitemap.xml"), sitemapXml);
writeFile(path.join(publicDir, "robots.txt"), robotsTxt);

console.log(`[seo] Wrote public/sitemap.xml and public/robots.txt for ${siteUrl}`);
