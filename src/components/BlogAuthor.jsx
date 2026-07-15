import React from 'react';
import Link from "next/link";

const AUTHOR_STYLES = `
.ba-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #f3f4f6;
  overflow: hidden;
  margin-bottom: 20px;
}
.ba-head {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
}
.ba-head svg { width: 14px; height: 14px; }
.ba-body {
  padding: 20px 16px;
  text-align: center;
}
.ba-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; font-weight: 700; color: #fff;
  margin: 0 auto 12px;
  overflow: hidden;
  flex-shrink: 0;
}
.ba-avatar img {
  width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
}
.ba-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.05rem; font-weight: 700;
  color: #111827; margin: 0 0 4px;
  text-decoration: none; display: block;
  transition: color 0.18s;
}
.ba-name:hover { color: #f97316; }
.ba-role {
  font-size: 0.8rem; color: #9ca3af;
  margin: 0 0 10px;
}
.ba-bio {
  font-size: 0.82rem; color: #6b7280;
  line-height: 1.6; margin: 0 0 14px;
  text-align: left;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.ba-divider {
  height: 1px; background: #f3f4f6; margin: 10px 0 14px;
}
.ba-stats {
  display: flex; justify-content: center; gap: 20px;
  margin-bottom: 14px;
}
.ba-stat { text-align: center; }
.ba-stat strong {
  display: block; font-size: 1rem;
  font-weight: 700; color: #111827;
}
.ba-stat span { font-size: 0.72rem; color: #9ca3af; }
.ba-profile-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.82rem; font-weight: 600;
  color: #f97316; text-decoration: none;
  background: #fff7ed; padding: 8px 16px;
  border-radius: 10px; transition: background 0.18s;
  border: 1px solid rgba(249,115,22,0.15);
}
.ba-profile-link:hover { background: #ffedd5; }
.ba-profile-link svg { width: 12px; height: 12px; }
`;

if (typeof document !== 'undefined' && !document.getElementById('ba-styles')) {
  const el = document.createElement('style');
  el.id = 'ba-styles';
  el.textContent = AUTHOR_STYLES;
  document.head.appendChild(el);
}

const getInitials = (name) =>
  (name || 'CM').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/**
 * BlogAuthor — sidebar author card
 *
 * Props:
 *   author     — blog.author object  { author_name, bio, role, profile_image }
 *   views      — number
 *   tagsCount  — number
 */
const BlogAuthor = ({ author, views = 0, tagsCount = 0 }) => {
  const name = author?.author_name || author?.name || 'Career Mitra';
  const bio = author?.bio || null;
  const role = author?.role || 'Career Expert & Writer';
  const profileImage = author?.profile_image || author?.avatar_url || author?.avatar || null;
  // prefer _id for route; fall back to slug for legacy
  const authorPath = `/author/${slugify(name)}`;

  return (
    <div className="ba-card">
      <div className="ba-head">
        <UserIcon />
        Author
      </div>
      <div className="ba-body">
        <div className="ba-avatar">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            getInitials(name)
          )}
        </div>

        <Link href={authorPath} className="ba-name">{name}</Link>
        <div className="ba-role">{role}</div>

        {bio && <p className="ba-bio">{bio}</p>}

        <div className="ba-divider" />

        {/* <div className="ba-stats">
          <div className="ba-stat">
            <strong>{(views || 0).toLocaleString()}</strong>
            <span>Views</span>
          </div>
          <div className="ba-stat">
            <strong>{tagsCount || 0}</strong>
            <span>Topics</span>
          </div>
          <div className="ba-stat">
            <strong>★ 4.9</strong>
            <span>Rating</span>
          </div>
        </div> */}

        <Link href={authorPath} className="ba-profile-link">
          View Profile <ArrowIcon />
        </Link>
      </div>
    </div>
  );
};

export default BlogAuthor;
