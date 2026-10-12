import DOMPurify from "isomorphic-dompurify";

/**
 * Renders a job's description / remark / note exactly as formatted in the
 * admin editor (headings, lists, tables, links, text alignment).
 *
 * The backend sanitizes on save; this is the second pass before render, with
 * the same allow-list. Plain-text values (older jobs, bulk upload) keep their
 * line breaks. Styles: `.job-rich-text` in app/globals.css.
 */

const LOOKS_LIKE_HTML = /<\/?[a-z][\w-]*(\s[^>]*)?>/i;

const ALLOWED_STYLES = new Set([
  "text-align", "color", "background-color", "font-weight", "font-style",
  "text-decoration", "font-size", "padding-left", "margin-left", "width",
]);

let hooksInstalled = false;
function installHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "style") return;
    const kept = String(data.attrValue)
      .split(";")
      .map((decl) => decl.trim())
      .filter((decl) => {
        const [prop, ...rest] = decl.split(":");
        const value = rest.join(":").toLowerCase();
        return ALLOWED_STYLES.has(String(prop).trim().toLowerCase()) && !/url\(|expression|javascript:/.test(value);
      });
    data.attrValue = kept.join("; ");
    if (!kept.length) data.keepAttr = false;
  });
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("href")) {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

export function sanitizeJobHtml(html) {
  installHooks();
  return DOMPurify.sanitize(String(html ?? ""), {
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "textarea", "select", "button"],
    FORBID_ATTR: ["srcset"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  });
}

export default function JobRichText({ value, className = "" }) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (!LOOKS_LIKE_HTML.test(text)) {
    return <div className={`job-rich-text whitespace-pre-line ${className}`}>{text}</div>;
  }
  return <div className={`job-rich-text ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeJobHtml(text) }} />;
}
