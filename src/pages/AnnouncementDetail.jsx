import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

const ANNOUNCEMENT_API_BASE =
  import.meta.env.VITE_ANNOUNCEMENT_API_BASE || "http://localhost:5000";
const ANNOUNCEMENTS_API = `${ANNOUNCEMENT_API_BASE}/api/announcements`;

const imageBase64Cache = new Map();

const normalizeAnnouncement = (item) => ({
  id: item?.id || item?._id || "",
  title: item?.title || "Announcement",
  slug: item?.slug || "",
  url: item?.url || null,
  info: item?.info || "",
  image: item?.image || null,
  date: item?.date || null,
  time: item?.time || "",
  status: item?.status || "active",
  publishedAt: item?.publishedAt || item?.published_at || null,
  createdBy: item?.createdBy || item?.created_by || null,
  createdAt: item?.createdAt || item?.created_at || null,
  updatedAt: item?.updatedAt || item?.updated_at || null,
});

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sanitizeHtml = (html) => {
  if (!html) return "";
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target", "rel"] }).replace(
    /<a /g,
    '<a target="_blank" rel="noopener noreferrer" '
  );
};

export default function AnnouncementDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState(null);
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resolvedImage, setResolvedImage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchBySlugAndId = async () => {
      try {
        setLoading(true);
        setError("");

        const listRes = await axios.get(ANNOUNCEMENTS_API, {
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(listRes?.data?.data)
          ? listRes.data.data.map(normalizeAnnouncement)
          : [];

        if (!cancelled) {
          setLatestAnnouncements(
            list.filter((item) => item.status === "active" && item.slug)
          );
        }

        const matched = list.find((item) => item.slug === slug);

        if (!matched?.id) {
          if (!cancelled) {
            setError("Announcement not found.");
            setAnnouncement(null);
          }
          return;
        }

        const detailRes = await axios.get(`${ANNOUNCEMENTS_API}/${matched.id}`, {
          headers: { Accept: "application/json" },
        });

        const detail = normalizeAnnouncement(detailRes?.data?.data || {});

        if (!cancelled) {
          setAnnouncement(detail?.id ? detail : matched);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e?.response?.data?.message || "Failed to load announcement details."
          );
          setAnnouncement(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBySlugAndId();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    const convertImageToBase64 = async () => {
      const source = announcement?.image;

      if (!source) {
        setResolvedImage("");
        return;
      }

      if (source.startsWith("data:")) {
        setResolvedImage(source);
        return;
      }

      const cached = imageBase64Cache.get(source);
      if (cached) {
        setResolvedImage(cached);
        return;
      }

      try {
        const response = await fetch(source);
        const blob = await response.blob();

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result || "");
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (!cancelled && typeof base64 === "string") {
          imageBase64Cache.set(source, base64);
          setResolvedImage(base64);
        }
      } catch {
        if (!cancelled) {
          setResolvedImage(source);
        }
      }
    };

    convertImageToBase64();

    return () => {
      cancelled = true;
    };
  }, [announcement?.image]);

  const metaItems = useMemo(() => {
    if (!announcement) return [];

    return [
      { label: "Slug", value: announcement.slug || "N/A" },
      { label: "Status", value: announcement.status || "active" },
      { label: "Published At", value: formatDate(announcement.publishedAt) },
      { label: "Date", value: formatDate(announcement.date) },
      { label: "Time", value: announcement.time || "N/A" },
    ];
  }, [announcement]);

  const latestFive = useMemo(
    () => latestAnnouncements.filter((item) => item.slug !== slug).slice(0, 5),
    [latestAnnouncements, slug]
  );

  if (loading) {
    return (
      <section
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "140px 16px 60px",
        }}
      >
        <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: "14px 16px",
              color: "#111827",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Loading announcement...
          </div>
        </div>
      </section>
    );
  }

  if (error || !announcement) {
    return (
      <section
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          padding: "140px 16px 60px",
        }}
      >
        <div
          style={{
            width: "min(1120px, 100%)",
            borderRadius: 14,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#7f1d1d",
            padding: "20px 18px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Announcement</h2>
          <p style={{ marginTop: 10, marginBottom: 0 }}>{error || "Announcement not found."}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: 16,
              border: "none",
              borderRadius: 999,
              background: "linear-gradient(90deg, #f97316, #22c55e)",
              color: "#fff",
              fontWeight: 700,
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
        Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "40px 16px 60px",
      }}
    >
      <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid #d1d5db",
            background: "#ffffff",
            color: "#111827",
            borderRadius: 10,
            padding: "9px 12px",
            cursor: "pointer",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          <span aria-hidden="true">←</span>
          Home
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 16,
          }}
        >
          <style>{`
            @media (min-width: 1024px) {
              .announcement-detail-grid {
                grid-template-columns: minmax(0, 1fr) 320px;
                align-items: start;
              }
            }
          `}</style>

          <div className="announcement-detail-grid" style={{ display: "grid", gap: 16 }}>
            <article style={{ display: "grid", gap: 14 }}>
              <header
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: "20px 18px",
                }}
              >
                <h1 style={{ margin: 0, color: "#111827", fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", lineHeight: 1.2 }}>
                  {announcement.title}
                </h1>
                <p style={{ margin: "8px 0 0", color: "#4b5563", fontSize: 14 }}>
                  {formatDate(announcement.date)} | {announcement.time || "N/A"}
                </p>
              </header>

              {announcement.image ? (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={resolvedImage || announcement.image}
                    alt={announcement.title}
                    style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : null}

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: "20px 18px 24px",
                  display: "grid",
                  gap: 18,
                }}
              >
                <div
                  style={{ color: "#1f2937", lineHeight: 1.7, fontSize: 15 }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.info) }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                    gap: 10,
                  }}
                >
                  {metaItems.map((meta) => (
                    <div
                      key={meta.label}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        background: "#f9fafb",
                        padding: "10px 12px",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>
                        {meta.label}
                      </div>
                      <div style={{ fontSize: 14, color: "#111827", marginTop: 4 }}>
                        {meta.value}
                      </div>
                    </div>
                  ))}
                </div>

                {announcement.url ? (
                  <a
                    href={announcement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: "fit-content",
                      borderRadius: 10,
                      textDecoration: "none",
                      background: "linear-gradient(90deg, #f97316, #22c55e)",
                      color: "#fff",
                      fontWeight: 700,
                      padding: "10px 18px",
                    }}
                  >
                    Open Official Link
                  </a>
                ) : null}
              </div>
            </article>

            <aside
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: "14px",
                position: "sticky",
                top: 120,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 17, color: "#111827" }}>Latest Announcements</h3>
              <p style={{ margin: "6px 0 12px", fontSize: 12.5, color: "#6b7280" }}>
                Check the latest 5 updates.
              </p>

              <div style={{ display: "grid", gap: 8 }}>
                {latestFive.length ? (
                  latestFive.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      to={`/announcements/${item.slug}`}
                      style={{
                        textDecoration: "none",
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        background: "#f9fafb",
                        padding: "10px",
                        display: "grid",
                        gap: 4,
                      }}
                    >
                      <span style={{ color: "#111827", fontSize: 13.5, fontWeight: 700, lineHeight: 1.35 }}>
                        {item.title}
                      </span>
                      <span style={{ color: "#6b7280", fontSize: 12 }}>
                        {formatDate(item.date)} | {item.time || "N/A"}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div
                    style={{
                      border: "1px dashed #d1d5db",
                      borderRadius: 10,
                      background: "#f9fafb",
                      color: "#6b7280",
                      fontSize: 12.5,
                      padding: "10px",
                    }}
                  >
                    No other announcements found.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
