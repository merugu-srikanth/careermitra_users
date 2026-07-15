"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BlogContext = createContext(null);

const getPrimaryCategory = (blog) =>
  blog?.categories?.[0]?.name || blog?.category || 'General';

const getAuthorName = (blog) =>
  blog?.author?.author_name || blog?.author_name || 'Career Mitra';

const getAuthorId = (blog) =>
  blog?.author?._id || blog?.author_id || blog?.authorId || '';

const normalizeBlog = (blog) => ({
  ...blog,
  primaryCategory: getPrimaryCategory(blog),
  authorDisplayName: getAuthorName(blog),
  authorId: getAuthorId(blog),
  authorAvatar: blog?.author?.avatar_url || null,
});

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("https://careermitra.in/api/blogs?page=1&limit=200");
      const data = await res.json();
      const d = data.data || data;
      const allBlogs = (d.articles || []).map(normalizeBlog);
      setBlogs(allBlogs);
    } catch (err) {
      console.error("Failed to fetch blogs in BlogContext:", err);
      setError("Unable to connect to the articles database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading, error, refreshBlogs: fetchBlogs }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogs() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogs must be used within a BlogProvider");
  }
  return context;
}
