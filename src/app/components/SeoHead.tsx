import { getSiteUrl } from '@/lib/env';
import { useEffect } from 'react';

type SeoHeadProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  /** Full URL overrides canonicalPath */
  canonicalUrl?: string;
  ogType?: 'website' | 'product';
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export default function SeoHead({
  title,
  description,
  canonicalPath = '',
  canonicalUrl,
  ogType = 'website',
  ogImage,
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const site = getSiteUrl();
  const canonical = canonicalUrl ?? `${site}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    if (description) setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:title', title, 'property');
    if (description) setMeta('og:description', description, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:url', canonical, 'property');
    if (ogImage) setMeta('og:image', ogImage, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    if (description) setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;

    const ids = ['seo-jsonld'];
    ids.forEach((id) => document.getElementById(id)?.remove());

    if (jsonLd) {
      const scripts = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      scripts.forEach((data, i) => {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.id = scripts.length === 1 ? 'seo-jsonld' : `seo-jsonld-${i}`;
        s.textContent = JSON.stringify(data);
        document.head.appendChild(s);
      });
    }

    return () => {
      document.querySelectorAll('[id^="seo-jsonld"]').forEach((n) => n.remove());
    };
  }, [title, description, canonical, ogType, ogImage, noindex, jsonLd]);

  return null;
}

export function defaultJsonLdOrganization() {
  const site = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FITLOCKA',
    url: site,
    description: 'Authentic retro jerseys and curated sport culture collections.',
  };
}

export function jsonLdWebSite() {
  const site = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FITLOCKA',
    url: site,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site}/shop?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
