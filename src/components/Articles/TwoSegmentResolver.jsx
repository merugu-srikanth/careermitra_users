"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ArticleList, { CardSkeleton } from "./ArticleList";
import ArticleDetail, { DetailSkeleton } from "./ArticleDetail";

const toSlug = (name = "", apiSlug = "") =>
  apiSlug || String(name).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

// Module-level cache — shared across all renders, 5-min TTL
let _cache = null, _cacheAt = 0;
function getFilters() {
  if (_cache && Date.now() - _cacheAt < 300_000) return Promise.resolve(_cache);
  return fetch("https://careermitra.in/api/blogs/filters")
    .then(r => r.json())
    .then(d => {
      const data = d.data || d;
      _cache = { parents: data.parents || [], children: data.children || [] };
      _cacheAt = Date.now();
      return _cache;
    });
}

export default function TwoSegmentResolver() {
  const params = useParams();
  const { parentSlug, slug } = params;
  const [type, setType] = useState(null); // null | 'category' | 'article'

  useEffect(() => {
    setType(null);
    getFilters()
      .then(({ parents, children }) => {
        const parent = parents.find(p => toSlug(p.name, p.slug) === parentSlug);
        if (parent) {
          const isChild = children.some(
            c => c.parent_id === parent.id && toSlug(c.name, c.slug) === slug
          );
          if (isChild) { setType("category"); return; }
        }
        setType("article");
      })
      .catch(() => setType("article"));
  }, [parentSlug, slug]);

  if (!type) {
    const isLikelyCategory = slug && slug.length < 25 && (slug.split('-').length <= 3 || slug === 'preparation-guide' || slug === 'state-government-jobs' || slug === 'career-guidance');
    if (isLikelyCategory) {
      return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      );
    }
    return <DetailSkeleton />;
  }

  // ArticleList and ArticleDetail both call useParams() internally
  // At route /:parentSlug/:slug, useParams() returns { parentSlug, slug }
  // ArticleList reads params.slug as pathChild (updated below)
  // ArticleDetail reads params.slug as the article slug
  if (type === "category") return <ArticleList />;
  return <ArticleDetail />;
}
