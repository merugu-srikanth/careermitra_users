export default function AnimatedBg() {
  const circles = Array.from({ length: 10 });

  return (
    <div className=" absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#fad099] to-[#faf7f2]">

      {circles.map((_, i) => (
        <span
          key={i}
          className="absolute block bg-orange-500/40 bottom-[-150px]"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 120}px`,
            height: `${20 + Math.random() * 120}px`,
            animation: `floatUp ${10 + Math.random() * 30}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Keyframes inline (still no CSS file needed) */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
}