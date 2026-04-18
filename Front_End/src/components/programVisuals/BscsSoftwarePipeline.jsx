/**
 * Animated software delivery path: Design → Build → Test → Ship (matches BSCS “pipeline” copy).
 */
const ROUTE_D =
  'M 72 100 C 128 32 182 32 200 100 C 248 168 298 168 336 100 C 384 32 438 32 456 100'

const STAGES = [
  { x: 72, label: 'Design', fs: 11 },
  { x: 200, label: 'Build', fs: 11 },
  { x: 336, label: 'Test', fs: 11 },
  { x: 456, label: 'Ship', fs: 11 },
]

export default function BscsSoftwarePipeline() {
  return (
    <div className="bscs-pipeline">
      <svg
        className="bscs-pipeline__svg"
        viewBox="0 0 520 200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated path from design and build through testing to release"
      >
        <defs>
          <linearGradient id="bscsPipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f5132" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="bscsNodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>
          <filter id="bscsPipeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer bands — “stack” metaphor */}
        <g opacity="0.45">
          <rect x="32" y="148" width="456" height="10" rx="4" fill="rgba(34, 197, 94, 0.08)" />
          <rect x="48" y="132" width="424" height="10" rx="4" fill="rgba(15, 81, 50, 0.06)" />
          <rect x="64" y="116" width="392" height="10" rx="4" fill="rgba(34, 197, 94, 0.07)" />
        </g>

        <path
          d={ROUTE_D}
          fill="none"
          stroke="rgba(15, 81, 50, 0.1)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        <path
          id="bscs-sdlc-route"
          d={ROUTE_D}
          fill="none"
          stroke="url(#bscsPipeGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="bscs-pipeline__route"
          filter="url(#bscsPipeGlow)"
        />

        <path
          d={ROUTE_D}
          fill="none"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="2"
          strokeLinecap="round"
          className="bscs-pipeline__route bscs-pipeline__route--flow"
          pointerEvents="none"
        />

        {STAGES.map((n, i) => (
          <g key={n.label}>
            <rect
              x={n.x - 20}
              y="80"
              width="40"
              height="40"
              rx="10"
              fill="url(#bscsNodeGrad)"
              stroke="rgba(15, 81, 50, 0.3)"
              strokeWidth="1.5"
              className={`bscs-pipeline__node bscs-pipeline__node--${i}`}
            />
          </g>
        ))}

        <g className="bscs-pipeline__stage-labels" aria-hidden="true">
          {STAGES.map((n) => (
            <text
              key={n.label}
              x={n.x}
              y="138"
              textAnchor="middle"
              className="bscs-pipeline__node-label"
              style={{ fontSize: `${n.fs}px` }}
            >
              {n.label}
            </text>
          ))}
        </g>

        <circle r="5" fill="#22c55e" className="bscs-pipeline__packet">
          <animateMotion dur="9.5s" repeatCount="indefinite" rotate="auto" calcMode="linear">
            <mpath href="#bscs-sdlc-route" />
          </animateMotion>
        </circle>
        <circle r="4" fill="#0f5132" className="bscs-pipeline__packet bscs-pipeline__packet--b">
          <animateMotion dur="9.5s" repeatCount="indefinite" rotate="auto" begin="3.1s" calcMode="linear">
            <mpath href="#bscs-sdlc-route" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  )
}
