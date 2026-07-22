/** Subtle constellation field for section backgrounds. Opacity ≈ 10–15% (≈ 85–90% transparent). */
const CLUSTERS = [
  {
    // top-left
    stars: [
      { x: 6, y: 18, r: 1.1 },
      { x: 12, y: 28, r: 1.6 },
      { x: 18, y: 16, r: 1.0 },
      { x: 22, y: 34, r: 1.3 },
      { x: 28, y: 22, r: 1.8 },
      { x: 14, y: 40, r: 0.9 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 5],
    ] as [number, number][],
  },
  {
    // top-right
    stars: [
      { x: 72, y: 14, r: 1.2 },
      { x: 78, y: 24, r: 1.7 },
      { x: 84, y: 12, r: 1.0 },
      { x: 88, y: 30, r: 1.4 },
      { x: 94, y: 18, r: 1.9 },
      { x: 80, y: 36, r: 0.95 },
      { x: 90, y: 40, r: 1.1 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 5],
      [3, 6],
    ] as [number, number][],
  },
  {
    // mid-center
    stars: [
      { x: 38, y: 48, r: 1.0 },
      { x: 44, y: 58, r: 1.5 },
      { x: 50, y: 46, r: 1.2 },
      { x: 56, y: 62, r: 1.7 },
      { x: 62, y: 50, r: 1.1 },
      { x: 48, y: 70, r: 0.9 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 5],
    ] as [number, number][],
  },
  {
    // bottom-left
    stars: [
      { x: 8, y: 68, r: 1.0 },
      { x: 14, y: 78, r: 1.4 },
      { x: 20, y: 70, r: 1.1 },
      { x: 24, y: 84, r: 1.6 },
      { x: 30, y: 74, r: 1.0 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
    ] as [number, number][],
  },
  {
    // bottom-right
    stars: [
      { x: 70, y: 72, r: 1.1 },
      { x: 76, y: 82, r: 1.5 },
      { x: 82, y: 70, r: 1.0 },
      { x: 88, y: 86, r: 1.7 },
      { x: 94, y: 76, r: 1.2 },
      { x: 84, y: 90, r: 0.9 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [1, 5],
    ] as [number, number][],
  },
] as const;

type Tone = "ink" | "wine" | "ivory";

const TONE_CLASS: Record<Tone, string> = {
  ink: "text-ink",
  wine: "text-wine",
  ivory: "text-ivory",
};

export default function SectionConstellation({
  tone = "wine",
  opacity = 0.12,
  className = "",
}: {
  tone?: Tone;
  /** 0.1–0.2 ≈ 80–90% transparent */
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${TONE_CLASS[tone]} ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {CLUSTERS.map((cluster, ci) => (
          <g key={ci}>
            {cluster.edges.map(([a, b], ei) => (
              <line
                key={`${ci}-e-${ei}`}
                x1={cluster.stars[a].x}
                y1={cluster.stars[a].y}
                x2={cluster.stars[b].x}
                y2={cluster.stars[b].y}
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {cluster.stars.map((star, si) => (
              <g key={`${ci}-s-${si}`}>
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 0.28}
                  fill="currentColor"
                />
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.r * 0.7}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
