import { useEffect, useRef, useState } from "react";

export default function AnimatedSection({ children, animation = "fade-up", className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getStyle = () => {
    const base = { transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms` };
    if (!visible) {
      if (animation === "fade-up") return { ...base, opacity: 0, transform: "translateY(40px)" };
      if (animation === "fade-left") return { ...base, opacity: 0, transform: "translateX(-40px)" };
      if (animation === "fade-right") return { ...base, opacity: 0, transform: "translateX(40px)" };
      return { ...base, opacity: 0 };
    }
    return { ...base, opacity: 1, transform: "translate(0)" };
  };

  return (
    <div ref={ref} style={getStyle()} className={className}>
      {children}
    </div>
  );
}