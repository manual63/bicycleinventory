import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";

const spin = keyframes`to { transform: rotate(360deg); }`;
const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1.5px); }
`;
const scroll = keyframes`to { stroke-dashoffset: -32; }`;
const whoosh = keyframes`
  0% { transform: translateX(12px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateX(-24px); opacity: 0; }
`;

const WHEEL_RADIUS = 18;
const spokeAngles = [0, 30, 60, 90, 120, 150];

/** One wheel: tire, rim, and a spinning spoke group. */
const Wheel = ({ cx, cy }: { cx: number; cy: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={WHEEL_RADIUS} strokeWidth={3.5} />
    <circle cx={cx} cy={cy} r={WHEEL_RADIUS - 3} strokeWidth={0.75} opacity={0.5} />
    <g className="spin">
      {spokeAngles.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * (WHEEL_RADIUS - 3);
        const dy = Math.sin(rad) * (WHEEL_RADIUS - 3);
        return <line key={angle} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} strokeWidth={0.75} />;
      })}
    </g>
    <circle cx={cx} cy={cy} r={2} fill="currentColor" />
  </g>
);

/**
 * A mountain bike rolling along: wheels and cranks spin, the bike bobs, the trail scrolls.
 * Pure SVG + CSS keyframes, colored with currentColor so it follows the theme.
 */
export const AnimatedBike = () => (
  <Box
    role="img"
    aria-label="Bike riding along a trail"
    sx={{
      color: "primary.main",
      bgcolor: (theme) => theme.alpha(theme.palette.primary.main, 0.08),
      borderRadius: 3,
      py: 1,
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      "& svg": { width: "100%", maxWidth: 260, height: "auto", display: "block" },
      "& .spin": { transformBox: "fill-box", transformOrigin: "center", animation: `${spin} 0.8s linear infinite` },
      "& .crank": { transformBox: "view-box", transformOrigin: "88px 70px", animation: `${spin} 1.2s linear infinite` },
      "& .bob": { animation: `${bob} 0.4s ease-in-out infinite` },
      "& .trail": { animation: `${scroll} 0.5s linear infinite` },
      "& .whoosh": { animation: `${whoosh} 0.9s ease-out infinite` },
      "& .whoosh:nth-of-type(2)": { animationDelay: "0.3s" },
      "& .whoosh:nth-of-type(3)": { animationDelay: "0.6s" },
      "@media (prefers-reduced-motion: reduce)": {
        "& .spin, & .crank, & .bob, & .trail, & .whoosh": { animation: "none" },
      },
    }}
  >
    <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Speed lines behind the rider */}
      <g strokeWidth={2} opacity={0.6}>
        <line className="whoosh" x1={4} y1={42} x2={20} y2={42} />
        <line className="whoosh" x1={10} y1={54} x2={24} y2={54} />
        <line className="whoosh" x1={2} y1={66} x2={16} y2={66} />
      </g>

      {/* Trail */}
      <line className="trail" x1={0} y1={91} x2={200} y2={91} strokeWidth={2} strokeDasharray="20 12" opacity={0.45} />

      <g className="bob">
        <Wheel cx={50} cy={70} />
        <Wheel cx={148} cy={70} />

        {/* Frame */}
        <g strokeWidth={3.5}>
          <polyline points="50,70 88,70 78,38" />          {/* chainstay + seat tube */}
          <line x1={50} y1={70} x2={78} y2={40} />         {/* seatstay */}
          <line x1={80} y1={42} x2={128} y2={38} />        {/* top tube */}
          <line x1={88} y1={70} x2={127} y2={44} />        {/* down tube */}
          <line x1={128} y1={36} x2={148} y2={70} />       {/* fork */}
        </g>

        {/* Cockpit + saddle */}
        <g strokeWidth={3}>
          <line x1={126} y1={36} x2={124} y2={27} />       {/* stem */}
          <line x1={117} y1={26} x2={132} y2={27} />       {/* bar */}
          <line x1={77} y1={38} x2={76} y2={30} />         {/* seatpost */}
          <line x1={67} y1={29} x2={84} y2={29} strokeWidth={4} />
        </g>

        {/* Chainring + spinning crank arms with pedals */}
        <circle cx={88} cy={70} r={6} strokeWidth={2} />
        <g className="crank" strokeWidth={2.5}>
          <line x1={88} y1={70} x2={88} y2={81} />
          <line x1={84} y1={81} x2={92} y2={81} strokeWidth={3} />
          <line x1={88} y1={70} x2={88} y2={59} />
          <line x1={84} y1={59} x2={92} y2={59} strokeWidth={3} />
        </g>
      </g>
    </svg>
  </Box>
);
