import { useRef, useState, useEffect } from "react";

export default function LazyImage({ src, alt, style = {}, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", ...style }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmerLoad 1.5s infinite",
          borderRadius: "inherit",
        }} />
      )}
      {inView && (
        <img src={src} alt={alt} className={className}
          style={{ ...style, opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
          onLoad={() => setLoaded(true)}
        />
      )}
      <style>{`@keyframes shimmerLoad { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}