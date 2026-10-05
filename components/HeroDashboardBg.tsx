/**
 * Arrière-plan du hero : tableau de bord stylisé (courbe, histogramme, anneau, KPI).
 * Purement décoratif (aria-hidden). Animé une seule fois au chargement.
 */
const PANEL = { fill: "rgba(38,50,74,0.55)", stroke: "rgba(167,180,200,0.16)" };
const GRID = "rgba(167,180,200,0.10)";
const SKELETON = "rgba(167,180,200,0.22)";

function Panel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="16" fill={PANEL.fill} stroke={PANEL.stroke} />
      <rect x={x + 20} y={y + 18} width="110" height="8" rx="4" fill={SKELETON} />
      <rect x={x + 20} y={y + 32} width="64" height="6" rx="3" fill="rgba(167,180,200,0.12)" />
    </g>
  );
}

// Courbe principale (panneau en haut à droite)
const LINE = [
  [850, 262], [915, 240], [980, 248], [1045, 210], [1110, 218], [1175, 180], [1240, 188], [1305, 146], [1360, 128]
];
const LINE2 = [
  [850, 280], [915, 272], [980, 262], [1045, 266], [1110, 244], [1175, 248], [1240, 226], [1305, 222], [1360, 204]
];
const toPath = (pts: number[][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

// Histogramme (panneau en bas à gauche)
const BARS = [40, 60, 50, 74, 64, 82, 70, 90];

// Anneau (panneau en bas à droite) : circonférence 2πr avec r = 52
const R = 52;
const C = 2 * Math.PI * R;
const DONUT = [
  { share: 0.46, color: "#4DB3FF" },
  { share: 0.3, color: "#8B8CF8" },
  { share: 0.24, color: "#34D399" }
];

// Nuage de points (haut gauche, très discret)
const DOTS = [
  [70, 70], [104, 96], [138, 62], [172, 110], [206, 84], [240, 128], [274, 92], [308, 140], [342, 112], [376, 150],
  [96, 140], [150, 150], [222, 160], [296, 172]
];

export default function HeroDashboardBg() {
  let offset = 0;

  return (
    <div className="dash-bg" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4DB3FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4DB3FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dashBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B8CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4DB3FF" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Nuage de points */}
        <g fill="#4DB3FF" opacity="0.35">
          {DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 3} />
          ))}
        </g>

        {/* Panneau courbe */}
        <Panel x={820} y={60} w={580} h={250} />
        {[150, 200, 250].map((y) => (
          <line key={y} x1="850" x2="1370" y1={y} y2={y} stroke={GRID} />
        ))}
        <path d={`${toPath(LINE)} L1360 300 L850 300 Z`} fill="url(#dashArea)" className="dash-fade" />
        <path d={toPath(LINE2)} fill="none" stroke="#8B8CF8" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6" />
        <path d={toPath(LINE)} fill="none" stroke="#4DB3FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dash-line" pathLength={1} />
        <circle cx="1360" cy="128" r="6" fill="#4DB3FF" className="dash-pulse" />

        {/* Panneau histogramme */}
        <Panel x={60} y={640} w={440} h={160} />
        {[700, 735].map((y) => (
          <line key={y} x1="84" x2="476" y1={y} y2={y} stroke={GRID} />
        ))}
        {BARS.map((h, i) => (
          <rect
            key={i}
            x={92 + i * 48}
            y={770 - h}
            width="28"
            height={h}
            rx="5"
            fill={i === 5 ? "#F2C811" : "url(#dashBar)"}
            fillOpacity={i === 5 ? 0.85 : 1}
            className="dash-bar"
            style={{ animationDelay: `${300 + i * 70}ms` }}
          />
        ))}

        {/* Tuiles KPI */}
        {[
          { x: 560, label: 72, accent: "#34D399" },
          { x: 750, label: 54, accent: "#4DB3FF" }
        ].map((k) => (
          <g key={k.x}>
            <rect x={k.x} y={640} width="170" height="96" rx="14" fill={PANEL.fill} stroke={PANEL.stroke} />
            <rect x={k.x + 18} y={660} width={k.label} height="7" rx="3.5" fill={SKELETON} />
            <rect x={k.x + 18} y={682} width="86" height="18" rx="5" fill={k.accent} fillOpacity="0.7" />
            <path
              d={`M${k.x + 18} 724 l20 -6 l20 3 l20 -9 l20 4 l20 -10 l20 2 l20 -8`}
              fill="none"
              stroke={k.accent}
              strokeOpacity="0.8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* Panneau anneau */}
        <Panel x={1080} y={460} w={320} h={250} />
        <g transform="rotate(-90 1170 600)">
          <circle cx="1170" cy="600" r={R} fill="none" stroke="rgba(167,180,200,0.12)" strokeWidth="18" />
          {DONUT.map((d) => {
            const len = d.share * C;
            const el = (
              <circle
                key={d.color}
                cx="1170"
                cy="600"
                r={R}
                fill="none"
                stroke={d.color}
                strokeOpacity="0.85"
                strokeWidth="18"
                strokeDasharray={`${len - 3} ${C - len + 3}`}
                strokeDashoffset={-offset}
                className="dash-fade"
              />
            );
            offset += len;
            return el;
          })}
        </g>
        {DONUT.map((d, i) => (
          <g key={d.color}>
            <rect x="1258" y={562 + i * 28} width="12" height="12" rx="3" fill={d.color} fillOpacity="0.85" />
            <rect x="1278" y={565 + i * 28} width={70 - i * 12} height="7" rx="3.5" fill={SKELETON} />
          </g>
        ))}
      </svg>
    </div>
  );
}
