import AuthorProfilePage from "./AuthorDetailClient";
import { generatePersonSchema, generateWebPageSchema } from '@/utils/schemaHelpers';
import { getAuthorProfile, slugify } from '@/utils/authorData';

export async function generateMetadata({ params }) {
  const { authorId } = await params;
  const profile = await getAuthorProfile(authorId);
  if (!profile) {
    return {
      title: "Author - Career Mitra",
    };
  }
  const { author_name, bio, avatar_url } = profile.author;
  const ogImage = !avatar_url || avatar_url.startsWith("data:image")
    ? "https://careermitra.in/default_og_image.png"
    : avatar_url;

  const canonicalUrl = `https://careermitra.in/author/${slugify(author_name || authorId)}`;
  const titleText = `${author_name} - Author at Career Mitra`;
  const descriptionText = bio || `Read articles written by ${author_name} on Career Mitra — career guidance, govt jobs, and more.`;

  return {
    title: titleText,
    description: descriptionText,
    keywords: `${author_name}, career mitra author, career blog, government jobs`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: canonicalUrl,
      type: "profile",
      siteName: "Career Mitra",
      images: [
        {
          url: ogImage,
          width: 400,
          height: 400,
          alt: author_name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: titleText,
      description: descriptionText,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }) {
  const { authorId } = await params;
  const profile = await getAuthorProfile(authorId);

  let schemas = [];
  if (profile) {
    const { author_name, bio, avatar_url } = profile.author;

    const personSchema = generatePersonSchema({
      name: author_name,
      description: bio,
      image: avatar_url,
      url: `https://careermitra.in/author/${slugify(author_name || authorId)}`
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
      <AuthorProfilePage initialData={profile} />
    </>
  );
}
