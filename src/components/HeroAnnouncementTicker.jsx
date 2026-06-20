import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

const ANNOUNCEMENT_API_BASE =
  import.meta.env.VITE_ANNOUNCEMENT_API_BASE || "https://www.careermitra.in";
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

const sanitizeHtml = (html) => {
  if (!html) return "";
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target", "rel"] }).replace(
    /<a /g,
    '<a target="_blank" rel="noopener noreferrer" '
  );
};

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function AnnouncementModal({ item, onClose, onNavigate }) {
  const [resolvedImage, setResolvedImage] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    const convert = async () => {
      const source = item?.image;
      if (!source) { setResolvedImage(""); return; }
      if (source.startsWith("data:")) { setResolvedImage(source); return; }
      const cached = imageBase64Cache.get(source);
      if (cached) { setResolvedImage(cached); return; }
      try {
        const blob = await (await fetch(source)).blob();
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
        if (!cancelled) setResolvedImage(source);
      }
    };
    convert();
    return () => { cancelled = true; };
  }, [item?.image]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 96vw)",
          maxHeight: "88vh",
          overflowY: "auto",
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#ffffff",
          boxShadow: "0 24px 90px rgba(0,0,0,0.6)",
          color: "#111827",
        }}
      >
        {/* Header */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 12, justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 800 }}>{item.title}</h3>
            <p style={{ margin: "6px 0 0", color: "rgba(17,24,39,0.65)", fontSize: 13 }}>
              {formatDate(item.date)}{item.time ? ` | ${item.time}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#f3f4f6",
              color: "#111827",
              borderRadius: 999,
              width: 34,
              height: 34,
              fontSize: 18,
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Image */}
        {item.image ? (
          <img
            src={resolvedImage || item.image}
            alt={item.title}
            style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }}
          />
        ) : null}

        {/* Body */}
        <div style={{ padding: 20, display: "grid", gap: 14 }}>
          {item.info ? (
            <div
              style={{ color: "#1f2937", lineHeight: 1.65, fontSize: 14 }}
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.info) }}
            />
          ) : null}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#fff",
                  background: "linear-gradient(90deg, #f97316, #ea580c)",
                  textDecoration: "none",
                }}
              >
                Apply Now
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : null}

            {item.slug ? (
              <button
                onClick={() => { onClose(); onNavigate(item.slug, item.id); }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1.5px solid #22c55e",
                  borderRadius: 999,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#16a34a",
                  background: "#f0fdf4",
                }}
              >
                View More
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroAnnouncementTicker() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setLoadError("");
        const res = await axios.get(ANNOUNCEMENTS_API, { headers: { Accept: "application/json" } });
        const list = Array.isArray(res?.data?.data)
          ? res.data.data.map(normalizeAnnouncement)
          : [];
        if (!cancelled) setAnnouncements(list.filter((item) => item.status === "active"));
      } catch (error) {
        if (!cancelled) setLoadError(error?.response?.data?.message || "Failed to load announcements");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, []);

  const activeAnnouncements = useMemo(() => announcements, [announcements]);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const shouldScroll = activeAnnouncements.length > 2;

  useEffect(() => {
    let timer = null;
    if (shouldScroll) {
      setScrollEnabled(false);
      timer = window.setTimeout(() => setScrollEnabled(true), 60000);
    } else {
      setScrollEnabled(false);
    }
    return () => { if (timer) window.clearTimeout(timer); };
  }, [shouldScroll]);

  const scrollingList = useMemo(() => {
    if (!scrollEnabled) return activeAnnouncements;
    return [...activeAnnouncements, ...activeAnnouncements];
  }, [activeAnnouncements, scrollEnabled]);

  const noAnnouncements = !isLoading && activeAnnouncements.length === 0;

  return (
    <>
      <style>{`
        @keyframes announcementTickerMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .announcement-shell {
          margin-top: 80px;
          min-height: 48px;
        }

        .announcement-track {
          display: inline-flex;
          min-width: max-content;
          align-items: center;
          gap: 6px;
          animation: none;
        }

        .announcement-track.scrolling {
          animation: announcementTickerMove 42s linear infinite;
          will-change: transform;
        }

        .announcement-shell:hover .announcement-track.scrolling {
          animation-play-state: paused;
        }

        .ticker-apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: linear-gradient(90deg, #f97316, #ea580c);
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          line-height: 1;
          transition: opacity 0.15s;
        }
        .ticker-apply-btn:hover { opacity: 0.88; }

        .ticker-arrow-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.18);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.35);
          border-radius: 999px;
          width: 22px;
          height: 22px;
          cursor: pointer;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .ticker-arrow-btn:hover {
          background: rgba(34, 197, 94, 0.32);
        }

        @media (max-width: 767px) {
          .announcement-shell {
            margin-top: 72px;
            min-height: 44px;
          }
          .announcement-track {
            animation-duration: 32s;
          }
        }
      `}</style>

      <div
        className="announcement-shell"
        style={{
          position: "relative",
          zIndex: 15,
          background: "radial-gradient(ellipse at 30% 50%, #0a1f0d 0%, #050a06 70%, #020502 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(34,197,94,0.12)",
          overflow: "hidden",
          height: 48,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Label badge */}
        <div
          style={{
            flexShrink: 0,
            borderRight: "1px solid rgba(255,255,255,0.15)",
            fontSize: 11,
            color: "#fbbf24",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0 10px",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          Announcement
        </div>

        <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1, paddingLeft: 8 }}>
          {isLoading ? (
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
              Loading announcements...
            </div>
          ) : noAnnouncements ? (
            <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 12.5, fontWeight: 600 }}>
              CareerMitra: No announcements available right now.
            </div>
          ) : loadError ? (
            <div style={{ color: "#fca5a5", fontSize: 12 }}>{loadError}</div>
          ) : (
            <div className={`announcement-track${shouldScroll && scrollEnabled ? " scrolling" : ""}`}>
              {scrollingList.map((item, index) => (
                <div
                  key={`${item.slug || item.id}-${index}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  {/* Blinking dot */}
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                    animation: "none",
                    opacity: 0.9,
                  }} />

                  {/* Title — click opens modal */}
                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncement(item)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 12.5,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: 0,
                    }}
                  >
                    {item.title}
                  </button>

                  {/* Apply Now — only if URL exists */}
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ticker-apply-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply Now
                      <svg width="9" height="9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : null}

                  {/* → Arrow — navigates to detail page */}
                  {item.slug ? (
                    <button
                      type="button"
                      className="ticker-arrow-btn"
                      aria-label={`View ${item.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/announcements/${item.slug}`, { state: { id: item.id } });
                      }}
                    >
                      <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : null}

                  {/* Date */}
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
                    {formatDate(item.date)}
                  </span>

                  {/* Separator */}
                  <span style={{ color: "#22c55e", fontSize: 14, opacity: 0.6 }}>|</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnnouncementModal
        item={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        onNavigate={(slug, id) => navigate(`/announcements/${slug}`, { state: { id } })}
      />
    </>
  );
}
