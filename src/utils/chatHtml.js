import DOMPurify from "isomorphic-dompurify";

// Chat messages only ever need basic WhatsApp-style formatting — restrict
// to that tag set so nothing else (scripts, images, iframes) can slip in
// via the rich-text editor's HTML output.
export const sanitizeChatHtml = (html) =>
  DOMPurify.sanitize(html || "", { ALLOWED_TAGS: ["b", "strong", "i", "em", "ul", "li", "p", "br"], ALLOWED_ATTR: [] });

export const isChatHtmlEmpty = (html) => !html || !html.replace(/<[^>]*>/g, "").trim();
