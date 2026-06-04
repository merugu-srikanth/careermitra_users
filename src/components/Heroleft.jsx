import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── Options ─────────────────────────────────────────────────────────────
   Fan order (left → right matching the image):
   Option5(far-left green)  Option4(mid-left yellow)  Option3(top red)
   Option2(mid-right blue)  Option1(far-right teal)
────────────────────────────────────────────────────────────────────────── */
const OPTIONS = [
    { id: 1, label: "Internships", sub: "Govt. internships near you", color: "#10b981", path: "#internship" },
    { id: 2, label: "Skill-Up", sub: "Top upskilling programmes", color: "#3b82f6", path: "#internship" },
    { id: 3, label: "Career Guide", sub: "Free expert guidance", color: "#ef4444", path: "/contact-us" },
    { id: 4, label: "Job Alerts", sub: "Age & qualification alerts", color: "#f59e0b", path: "/jobs" },
    { id: 5, label: "Diverse Fields", sub: "Admin, defence & policy", color: "#8b5cf6", path: "/contact-us" },
];

/* ── Icons (thin-line style matching the image) ────────────────────────── */
const ICONS = {
    0: (c) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
    ),
    1: (c) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
            <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
    ),
    2: (c) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ),
    3: (c) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    4: (c) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
    ),
};

/* ── Layout ─────────────────────────────────────────────────────────────── */
const W = 640, H = 520;
const HUB_X = W / 2;
const HUB_Y = 410;
const HUB_R = 60;
const NODE_R = 68;
const SPOKE = 230; /* hub center → node center */

/*
  Fan angles (standard math: 0°=right, 90°=down, 180°=left, 270°=up)
  We want nodes spread upward. "up" = 270°.
  Fan spread: ±65° from straight up.
  Left-to-right in image: 5(purple), 4(yellow), 3(red/top), 2(blue), 1(teal)
*/
const FAN = [
    { oi: 4, deg: 205 }, /* Option 5 — far left  */
    { oi: 3, deg: 238 }, /* Option 4 — mid left  */
    { oi: 2, deg: 272 }, /* Option 3 — top center */
    { oi: 1, deg: 306 }, /* Option 2 — mid right */
    { oi: 0, deg: 338 }, /* Option 1 — far right */
];

function rad(deg) { return (deg * Math.PI) / 180; }

const NODES = FAN.map(({ oi, deg }) => ({
    oi,
    x: HUB_X + SPOKE * Math.cos(rad(deg)),
    y: HUB_Y + SPOKE * Math.sin(rad(deg)),
    deg,
}));

/* Curved path: hub perimeter → node perimeter with gentle quadratic curve */
function curvePath(nx, ny) {
    const dx = nx - HUB_X, dy = ny - HUB_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist, uy = dy / dist;

    const sx = HUB_X + ux * (HUB_R + 4);
    const sy = HUB_Y + uy * (HUB_R + 4);
    const ex = nx - ux * (NODE_R + 3);
    const ey = ny - uy * (NODE_R + 3);

    /* Control point: midpoint nudged slightly toward hub for subtle curve */
    const mx = (sx + ex) / 2, my = (sy + ey) / 2;
    const cx = mx + (HUB_X - mx) * 0.15;
    const cy = my - 10;

    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

export default function HubSpokeDiagram({ onNav }) {
    const navigate = useNavigate();
    const nav = onNav || navigate;

    const [shown, setShown] = useState([]);
    const [hov, setHov] = useState(null);

    useEffect(() => {
        NODES.forEach((_, i) =>
            setTimeout(() => setShown((p) => [...p, i]), 200 + i * 180)
        );
    }, []);

    return (
        <div className=" mt-0">
            <svg
                viewBox={`30 10 ${W - 60} ${H - 0}`}
                width="100%"
                style={{ maxWidth: 640, height: "auto", overflow: "visible" }}
            >
                <defs>
                    <linearGradient id="cmTextGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    {/* Arrow markers per color */}
                    {OPTIONS.map((o) => (
                        <marker
                            key={o.color}
                            id={`a${o.color.slice(1)}`}
                            markerWidth="9" markerHeight="9"
                            refX="7.5" refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0,0 0,7 8.5,3.5" fill="url(#textGradient)" />
                        </marker>
                    ))}

                    {/* Hub gradient */}
                    {/* <radialGradient id="hg" cx="42%" cy="36%" r="66%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="10%" stopColor="#1a1a1a" />
          </radialGradient> */}

                    {/* Hub text gradient */}
                    <linearGradient id="cmTextGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                </defs>

                {/* ── Stem lines below hub ── */}
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF8C00" />   {/* Orange */}
                    <stop offset="100%" stopColor="#008000" /> {/* Green */}
                </linearGradient>
                {OPTIONS.map((o, i) => (
                    <line
                        key={i}
                        x1={HUB_X - 22 + i * 11} y1={HUB_Y + HUB_R + 2}
                        x2={HUB_X - 22 + i * 11} y2={HUB_Y + HUB_R + 36}
                        stroke={`url(#textGradient)`} strokeWidth="3.5" strokeLinecap="round"

                        opacity={shown.length ? 1 : 0}
                        style={{ transition: `opacity 0.5s ${i * 0.08}s` }}
                    />
                ))}

                {/* ── Curved arrows ── */}
                {NODES.map(({ oi, x, y }, fi) => {
                    const o = OPTIONS[oi];
                    return (
                        <path
                            key={fi}
                            d={curvePath(x, y)}
                            fill="none"
                            stroke={`url(#textGradient)`}
                            strokeWidth={hov === fi ? 2.4 : 1.9}
                            strokeLinecap="round"
                            markerEnd={`url(#a${o.color.slice(1)})`}
                            opacity={shown.includes(fi) ? 1 : 0}
                            style={{ transition: `opacity 0.5s ${fi * 0.16}s, stroke-width 0.2s` }}
                        />
                    );
                })}

                {/* ── Hub center ── */}
                {/* Outer thin ring */}
                <circle cx={HUB_X} cy={HUB_Y} r={HUB_R + 14}
                    fill="none" stroke="#555" strokeWidth="1" strokeOpacity="0.4" />

                {/* 5 color dots evenly spaced on outer ring */}
                {/* {OPTIONS.map((o, i) => {
                    const a = rad((360 / 5) * i - 90);
                    return (
                        <circle key={i}
                            cx={HUB_X + (HUB_R + 14) * Math.cos(a)}
                            cy={HUB_Y + (HUB_R + 14) * Math.sin(a)}
                            r="5" fill={o.color}
                        />
                    );
                })} */}

                {/* Hub body */}
                <circle cx={HUB_X} cy={HUB_Y} r={HUB_R} fill="url(#hg)" />
                <circle cx={HUB_X} cy={HUB_Y} r={HUB_R}
                    fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />

                {/* Hub text */}
                {/* <text x={HUB_X} y={HUB_Y - 10} textAnchor="middle"
          fontSize="20" fontWeight="900" fill="#FF8C00" letterSpacing="0.08em"
          fontFamily="'Nunito', system-ui, sans-serif">CAREER</text> */}
                <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF8C00" />   {/* Orange */}
                        <stop offset="100%" stopColor="#008000" /> {/* Green */}
                    </linearGradient>
                </defs>

                {/* CAREER (Top) */}
                <text
                    x={HUB_X}
                    y={HUB_Y - 15}
                    textAnchor="middle"
                    fontSize="20"
                    fontWeight="900"
                    fill="url(#textGradient)"
                    letterSpacing="0.08em"
                    fontFamily="'Nunito', system-ui, sans-serif"
                    dy="8"
                >
                    CAREER
                </text>

                {/* MITRA (Bottom Center) */}
                <text
                    x={HUB_X}
                    y={HUB_Y + 15}
                    textAnchor="middle"
                    fontSize="20"
                    fontWeight="900"
                    fill="url(#textGradient)"
                    letterSpacing="0.08em"
                    fontFamily="'Nunito', system-ui, sans-serif"
                    dy="4"
                >
                    MITRA
                </text>
                {/* <text x={HUB_X} y={HUB_Y + 8} textAnchor="middle"
          fontSize="20" fontWeight="900" fill="#238d13" letterSpacing="0.08em"
          fontFamily="'Nunito', system-ui, sans-serif">MITRA</text> */}


                {/* ── Option nodes ── */}
                {NODES.map(({ oi, x, y }, fi) => {
                    const o = OPTIONS[oi];
                    const Ico = ICONS[oi];
                    const isV = shown.includes(fi);
                    const isH = hov === fi;

                    return (
                        <g
                            key={fi}
                            style={{
                                cursor: "pointer",
                                opacity: isV ? 1 : 0,
                                transform: `scale(${isV ? 1 : 0.7})`,
                                transformOrigin: `${x}px ${y}px`,
                                transition: `opacity 0.5s ${fi * 0.16 + 0.08}s, transform 0.5s ${fi * 0.16 + 0.08}s`,
                            }}
                            onClick={() => nav(o.path)}
                            onMouseEnter={() => setHov(fi)}
                            onMouseLeave={() => setHov(null)}
                        >
                            {/* Soft shadow */}


                            {/* Node: white fill + colored ring */}
                            {/* <circle cx={x} cy={y} r={NODE_R}
                    // fill={o.color}
                    stroke={o.color}    
                    strokeWidth={isH ? 4.5 : 3.5}
                    style={{
                    transition: "stroke-width 0.2s",
                    filter: isH ? `drop-shadow(0 4px 16px ${o.color}55)` : "none",
                    }}
                /> */}

                            {/* Inner ring (faint) */}

                            <circle cx={x} cy={y} r={NODE_R - 9}
                                fill="none" stroke={"#454342"} />

                            {/* Icon */}


                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF8C00" />   {/* Orange */}
                                <stop offset="100%" stopColor="#008000" /> {/* Green */}
                            </linearGradient>
                            <foreignObject x={x - 15} y={y - 34} width={30} height={30}>
                                <div
                                    xmlns="http://www.w3.org/1999/xhtml"
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
                                >
                                    {/* {Ico(o.color)}
                  {Ico(isH ? "#ffffff" : "#ffffff")} */}
                                    {Ico(isH ? "url(#textGradient)" : "url(#textGradient)")}
                                </div>
                            </foreignObject>

                            {/* "OPTION 0N" label */}
                            {/* <text x={x} y={y + 7} textAnchor="middle"
                fontSize="7" fontWeight="700" fill={o.color}
                letterSpacing="0.09em" fillOpacity="0.65"
                fontFamily="'Nunito', system-ui, sans-serif">
                {`OPTION 0${oi + 1}`}
              </text> */}

                            {/* Main name */}
                            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF8C00" />   {/* Orange */}
                                <stop offset="100%" stopColor="#008000" /> {/* Green */}
                            </linearGradient>
                            <text x={x} y={y + 13} textAnchor="middle"
                                fontSize="15" fontWeight="800" fill="url(#textGradient)"
                                fontFamily="'Nunito', system-ui, sans-serif">
                                {o.label}
                            </text>

                            {/* 3 sub-text lines */}
                            {/* {[o.sub, "Lorem ipsum dolor sit amet,", "consectetur adipiscing elit."].map((ln, li) => (
                <text key={li} x={x} y={y + 33 + li * 10} textAnchor="middle"
                  fontSize="6.5" fill="#aaa" fontWeight="400"
                  fontFamily="'Nunito', system-ui, sans-serif">
                  {ln}
                </text>
              ))} */}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}