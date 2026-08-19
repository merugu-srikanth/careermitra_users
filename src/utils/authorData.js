import { cache } from "react";

const BLOGS_URL = "https://careermitra.in/api/blogs";
const AUTHOR_URL = (id) => `https://careermitra.in/api/authors/${id}`;

// How long the blogs list / author record are reused before Next.js
// re-fetches them from the external API (seconds).
const REVALIDATE_SECONDS = 300;

export const isMongoId = (s) => /^[a-f0-9]{24}$/i.test(s);

export const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const trimCategory = (c) => (c ? { id: c.id || c._id, name: c.name, slug: c.slug } : null);

const trimCategoryTree = (tree) =>
  Array.isArray(tree)
    ? tree.map((t) => ({
        parent: trimCategory(t.parent),
        children: Array.isArray(t.children) ? t.children.map(trimCategory) : [],
      }))
    : [];

// The external API embeds each category's full HTML description inside
// every article's categoryTree/primary_category, which is what makes the
// raw blogs list ~4MB for ~100 posts. Strip that down to just what the UI
// needs (name/slug for building links, plus view/like counts).
const trimBlog = (b) => ({
  _id: b._id,
  slug: b.slug,
  title: b.title,
  featured_image: b.featured_image || null,
  views: b.views || 0,
  likes: b.likes || 0,
  category: b.categories?.[0]?.name || null,
  primary_category: trimCategory(b.primary_category),
  categoryTree: trimCategoryTree(b.categoryTree),
  author: b.author ? { _id: b.author._id, author_name: b.author.author_name || b.author.name } : null,
});

// Cached + deduped per request: multiple callers (generateMetadata + Page)
// within the same render share this single external fetch instead of
// re-downloading the full blog list each time.
const fetchAllBlogs = cache(async () => {
  const res = await fetch(BLOGS_URL, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  const json = await res.json();
  if (Array.isArray(json?.data?.articles)) return json.data.articles;
  if (Array.isArray(json?.data)) return json.data;
  return [];
});

/**
 * Resolves an author by Mongo id or by the slugified author_name used in
 * `/author/[authorId]` URLs, and returns a lightweight payload containing
 * the author profile, their articles (with category/views already
 * attached), and a handful of suggested articles by other authors.
 *
 * Deduped per request via React's `cache()`, and the underlying external
 * fetches are ISR-cached for REVALIDATE_SECONDS so repeat visits across
 * different users don't re-pay the round trip.
 */
export const getAuthorProfile = cache(async (authorId) => {
  if (!authorId) return null;

  try {
    const blogs = await fetchAllBlogs();

    let resolvedId = authorId;
    if (!isMongoId(authorId)) {
      const match = blogs
        .map((b) => b.author)
        .filter(Boolean)
        .find((a) => slugify(a.author_name || a.name || "") === authorId);
      if (!match?._id) return null;
      resolvedId = match._id;
    }

    const authorRes = await fetch(AUTHOR_URL(resolvedId), { next: { revalidate: REVALIDATE_SECONDS } });
    if (!authorRes.ok) return null;
    const authorJson = await authorRes.json();
    if (!authorJson?.success || !authorJson?.data) return null;

    const author = authorJson.data;
    const assignedRefs = Array.isArray(author.assignedBlogs) ? author.assignedBlogs : [];
    const bySlug = new Map(blogs.map((b) => [b.slug, b]));

    const assignedBlogs = assignedRefs.map((ref) => {
      const full = bySlug.get(ref.slug);
      return full
        ? trimBlog(full)
        : { _id: ref._id, slug: ref.slug, title: ref.title, category: ref.category || null };
    });

    const assignedIds = new Set(assignedRefs.map((b) => b._id));
    const suggestedBlogs = blogs
      .filter((b) => !assignedIds.has(b._id))
      .slice(0, 6)
      .map(trimBlog);

    const authorHandleBase = author.email?.split("@")[0] || author.author_name || author.name || "author";

    return {
      author: {
        _id: author._id,
        author_name: author.author_name || author.name || "Author",
        bio: author.bio || "",
        avatar_url: author.avatar_url || "",
        social_links: author.social_links || {},
        role: author.role || "",
        handle: `@${authorHandleBase.toLowerCase().replace(/[^a-z0-9_]/gi, "")}`,
        createdAt: author.createdAt || null,
        updatedAt: author.updatedAt || null,
      },
      assignedBlogs,
      suggestedBlogs,
    };
  } catch (e) {
    console.error("Error fetching author profile", e);
    return null;
  }
});
