import AuthorProfilePage from "./AuthorDetailClient";
import { generatePersonSchema, generateWebPageSchema } from '@/utils/schemaHelpers';

async function getAuthorData(authorId) {
  const isMongoId = (s) => /^[a-f0-9]{24}$/i.test(s);
  const slugify = (s = '') => String(s).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  try {
    let resolvedId = authorId;
    if (!isMongoId(authorId)) {
      const listRes = await fetch("https://careermitra.in/api/blogs?limit=500");
      const listJson = await listRes.json();
      const blogs = Array.isArray(listJson?.data) ? listJson.data : [];
      const match = blogs
        .map((b) => b.author)
        .filter(Boolean)
        .find((a) => slugify(a.author_name || a.name || "") === authorId);
      if (!match?._id) return null;
      resolvedId = match._id;
    }

    const res = await fetch(`https://careermitra.in/api/authors/${resolvedId}`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (e) {
    console.error("Error fetching author data on server", e);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { authorId } = await params;
  const data = await getAuthorData(authorId);
  if (!data) {
    return {
      title: "Author | Career Mitra",
    };
  }
  const author_name = data.author_name || data.name || "Author";
  const bio = data.bio || "";
  const avatar_url = data.avatar_url || "";

  const slugify = (s = '') => String(s).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  return {
    title: `${author_name} — Author at Career Mitra`,
    description: bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`,
    keywords: `${author_name}, career mitra author, career blog, government jobs`,
    alternates: {
      canonical: `https://www.careermitra.in/author/${slugify(author_name || authorId)}`,
    },
    openGraph: {
      type: "profile",
      images: avatar_url ? [{ url: avatar_url }] : [],
    },
  };
}

export default async function Page({ params }) {
  const { authorId } = await params;
  const data = await getAuthorData(authorId);
  
  let schemas = [];
  if (data) {
    const author_name = data.author_name || data.name || "Author";
    const bio = data.bio || "";
    const avatar_url = data.avatar_url || "";
    const slugify = (s = '') => String(s).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    const personSchema = generatePersonSchema({
      name: author_name,
      description: bio,
      image: avatar_url,
      url: `https://www.careermitra.in/author/${slugify(author_name || authorId)}`
    });

    const webPageSchema = generateWebPageSchema({
      name: `${author_name} — Author at Career Mitra`,
      description: bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`,
      url: `/author/${slugify(author_name || authorId)}`
    });

    schemas = [personSchema, webPageSchema].filter(Boolean);
  }

  return (
    <>
      {schemas.map((s, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <AuthorProfilePage initialData={data} />
    </>
  );
}
