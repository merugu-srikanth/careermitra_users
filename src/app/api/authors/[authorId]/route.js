import { NextResponse } from "next/server";
import { getAuthorProfile } from "@/utils/authorData";

// Public read-only author API: given a Mongo id or the slugified author
// name used in /author/[authorId] links, returns the author's profile
// plus their articles (with category/views attached) and a short list of
// suggested articles — everything the profile page needs in one call.
export async function GET(request, { params }) {
  const { authorId } = await params;

  if (!authorId) {
    return NextResponse.json({ success: false, message: "Missing author id" }, { status: 400 });
  }

  const profile = await getAuthorProfile(authorId);

  if (!profile) {
    return NextResponse.json({ success: false, message: "Author not found" }, { status: 404 });
  }

  return NextResponse.json(
    { success: true, data: profile },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}

export const revalidate = 300;
