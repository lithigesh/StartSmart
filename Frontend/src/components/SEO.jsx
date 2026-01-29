import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const normalizeUrl = (value) => {
  if (!value) return null;
  return value.endsWith("/") && value !== "/" ? value.slice(0, -1) : value;
};

const getSiteOrigin = () => {
  const configured =
    import.meta.env.VITE_SITE_URL ||
    import.meta.env.VITE_PUBLIC_URL ||
    import.meta.env.PUBLIC_URL;

  const origin = configured
    ? configured
    : typeof window !== "undefined"
    ? window.location.origin
    : "";

  return normalizeUrl(origin);
};

const buildAbsoluteUrl = (origin, pathname) => {
  const safeOrigin = normalizeUrl(origin) || "";
  const safePath = pathname?.startsWith("/") ? pathname : pathname ? `/${pathname}` : "/";
  return safeOrigin ? `${safeOrigin}${safePath}` : safePath;
};

const safeJsonLd = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const DEFAULTS = {
  siteName: "StartSmart",
  titleSuffix: "StartSmart",
  description:
    "StartSmart is an AI-powered startup evaluation & funding ecosystem for entrepreneurs, investors, and admins.",
  imagePath: "/w_startSmart_icon.png",
};

export default function SEO({
  title,
  description,
  pathname,
  canonical,
  image,
  noindex,
  nofollow,
  jsonLd,
  lang,
}) {
  const origin = getSiteOrigin();

  const computed = useMemo(() => {
    const pageTitle = title
      ? `${title} — ${DEFAULTS.titleSuffix}`
      : `${DEFAULTS.siteName} — Smarter Beginning for Smarter Startups`;

    const pageDescription = description || DEFAULTS.description;

    const canonicalUrl = canonical
      ? canonical
      : buildAbsoluteUrl(origin, pathname || (typeof window !== "undefined" ? window.location.pathname : "/"));

    const imageUrl = image
      ? image.startsWith("http")
        ? image
        : buildAbsoluteUrl(origin, image)
      : buildAbsoluteUrl(origin, DEFAULTS.imagePath);

    const robots =
      noindex || nofollow
        ? `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`
        : "index,follow";

    return {
      pageTitle,
      pageDescription,
      canonicalUrl,
      imageUrl,
      robots,
    };
  }, [title, description, pathname, canonical, image, noindex, nofollow, origin]);

  const jsonLdItems = safeJsonLd(jsonLd);

  return (
    <Helmet>
      {lang ? <html lang={lang} /> : null}
      <title>{computed.pageTitle}</title>
      <meta name="description" content={computed.pageDescription} />
      <meta name="robots" content={computed.robots} />

      <link rel="canonical" href={computed.canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={DEFAULTS.siteName} />
      <meta property="og:title" content={computed.pageTitle} />
      <meta property="og:description" content={computed.pageDescription} />
      <meta property="og:url" content={computed.canonicalUrl} />
      <meta property="og:image" content={computed.imageUrl} />
      <meta property="og:image:secure_url" content={computed.imageUrl} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={DEFAULTS.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={computed.pageTitle} />
      <meta name="twitter:description" content={computed.pageDescription} />
      <meta name="twitter:image" content={computed.imageUrl} />

      {jsonLdItems.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Helmet>
  );
}
