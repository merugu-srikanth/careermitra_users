import { useMemo, useState, useEffect } from "react";
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

function AnnouncementModal({ item, onClose }) {
  const [resolvedImage, setResolvedImage] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    const convertImageToBase64 = async () => {
      const source = item?.image;

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
          // If conversion is blocked (CORS, network, invalid URL), fall back to original URL.
          setResolvedImage(source);
        }
      }
    };

    convertImageToBase64();

    return () => {
      cancelled = true;
    };
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
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        zIndex: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
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
        <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(0,0,0,0.08)", display: "flex", gap: 12, justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.3, fontWeight: 800 }}>{item.title}</h3>
            <p style={{ margin: "6px 0 0", color: "rgba(17,24,39,0.65)", fontSize: 13 }}>
              {formatDate(item.date)} | {item.time}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close announcement"
            style={{
              border: "1px solid rgba(0,0,0,0.15)",
              background: "#f3f4f6",
              color: "#111827",
              borderRadius: 999,
              width: 34,
              height: 34,
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            x
          </button>
        </div>

        {item.image ? (
          <img
            src={resolvedImage || item.image}
            alt={item.title}
            style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block" }}
          />
        ) : null}

        <div style={{ padding: 20, display: "grid", gap: 12 }}>
          <div
            style={{ margin: 0, color: "#1f2937", lineHeight: 1.65 }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.info) }}
          />

          {item.url ? (
            <button
              onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
              style={{
                width: "fit-content",
                border: "none",
                borderRadius: 999,
                padding: "10px 18px",
                cursor: "pointer",
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(90deg, #f97316, #22c55e)",
              }}
            >
              Open Link
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function HeroAnnouncementTicker() {
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

        const res = await axios.get(ANNOUNCEMENTS_API, {
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(res?.data?.data)
          ? res.data.data.map(normalizeAnnouncement)
          : [];

        if (!cancelled) {
          setAnnouncements(list.filter((item) => item.status === "active"));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error?.response?.data?.message ||
              "Failed to load announcements"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeAnnouncements = useMemo(() => announcements, [announcements]);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const openAnnouncement = (item) => {
    setSelectedAnnouncement(item);
  };

  const shouldScroll = activeAnnouncements.length > 2;

  useEffect(() => {
    let timer = null;

    if (shouldScroll) {
      setScrollEnabled(false);
      timer = window.setTimeout(() => {
        setScrollEnabled(true);
      }, 60000);
    } else {
      setScrollEnabled(false);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
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
          min-height: 40px;
        }

        .announcement-track {
          display: inline-flex;
          min-width: max-content;
          align-items: center;
          gap: 18px;
          animation: none;
        }

        .announcement-track.scrolling {
          animation: announcementTickerMove 36s linear infinite;
          will-change: transform;
        }

        .announcement-shell:hover .announcement-track.scrolling {
          animation-play-state: paused;
        }

        @media (max-width: 767px) {
          .announcement-shell {
            margin-top: 72px;
            min-height: 36px;
          }

          .announcement-track {
            animation-duration: 28s;
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
          height: 40,
          display: "flex",
          alignItems: "center",
        }}
      >
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

        <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
          {isLoading ? (
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, paddingLeft: 10 }}>
              Loading announcements...
            </div>
          ) : noAnnouncements ? (
            <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 12.5, paddingLeft: 10, fontWeight: 600 }}>
              CareerMitra Announcement: No announcements available right now.
            </div>
          ) : loadError ? (
            <div style={{ color: "#fca5a5", fontSize: 12, paddingLeft: 10 }}>
              {loadError}
            </div>
          ) : (
            <div className={`announcement-track${shouldScroll && scrollEnabled ? " scrolling" : ""}`}>
              {scrollingList.map((item, index) => (
                <div
                  key={`${item.slug || item.id}-${index}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
                >
                  <button
                    type="button"
                    onClick={() => openAnnouncement(item)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item.title}
                  </button>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                    {formatDate(item.date)} {item.time}
                  </span>
                  <span style={{ color: "#22c55e", fontSize: 12 }}>|</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnnouncementModal
        item={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </>
  );
}
