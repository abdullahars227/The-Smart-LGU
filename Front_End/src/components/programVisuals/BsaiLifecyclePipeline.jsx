/**
 * Animated AI lifecycle: Data → Model → Evaluation → Ship (SVG + CSS, no raster images).
 */
const ROUTE_D =
  'M 64 108 C 118 38 168 38 188 108 C 238 178 288 178 328 108 C 378 38 428 38 458 108'

const STAGES = [
  { x: 64, label: 'Data', fs: 11 },
  { x: 188, label: 'Model', fs: 11 },
  { x: 328, label: 'Evaluation', fs: 9.5 },
  { x: 458, label: 'Ship', fs: 11 },
]

export default function BsaiLifecyclePipeline() {
  return (
    <div className="bsai-pipeline">
      <svg
        className="bsai-pipeline__svg"
        viewBox="0 0 520 210"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated flow from data through model and evaluation to shipping"
      >
        <defs>
          <linearGradient id="bsaiPipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="45%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#0f5132" />
          </linearGradient>
          <linearGradient id="bsaiNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ecfdf5" />
          </linearGradient>
          <filter id="bsaiPipeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint grid */}
        <g opacity="0.35" stroke="rgba(15, 81, 50, 0.12)" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`v${i}`} x1={40 + i * 72} y1="24" x2={40 + i * 72} y2="186" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`h${i}`} x1="24" y1={40 + i * 44} x2="496" y2={40 + i * 44} />
          ))}
        </g>

        {/* Static ghost path */}
        <path
          d={ROUTE_D}
          fill="none"
          stroke="rgba(15, 81, 50, 0.1)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Main animated route */}
        <path
          id="bsai-lifecycle-route"
          d={ROUTE_D}
          fill="none"
          stroke="url(#bsaiPipeGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          className="bsai-pipeline__route"
          filter="url(#bsaiPipeGlow)"
        />

        {/* Brighter “flow” overlay (moving dashes) */}
        <path
          d={ROUTE_D}
          fill="none"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          className="bsai-pipeline__route bsai-pipeline__route--flow"
          pointerEvents="none"
        />

        {/* Stage nodes */}
        {STAGES.map((n, i) => (
          <g key={n.label}>
            <circle
              cx={n.x}
              cy="108"
              r="22"
              fill="url(#bsaiNodeGrad)"
              stroke="rgba(15, 81, 50, 0.35)"
              strokeWidth="1.5"
              className={`bsai-pipeline__node bsai-pipeline__node--${i}`}
            />
            <circle
              cx={n.x}
              cy="108"
              r="28"
              fill="none"
              stroke="rgba(34, 197, 94, 0.25)"
              strokeWidth="1"
              className={`bsai-pipeline__ring bsai-pipeline__ring--${i}`}
            />
          </g>
        ))}

        {/* Labels sit under each node (single source — no duplicate row below) */}
        <g className="bsai-pipeline__stage-labels" aria-hidden="true">
          {STAGES.map((n) => (
            <text
              key={n.label}
              x={n.x}
              y="154"
              textAnchor="middle"
              className="bsai-pipeline__node-label"
              style={{ fontSize: `${n.fs}px` }}
            >
              {n.label}
            </text>
          ))}
        </g>

        {/* Moving packets */}
        <circle r="5" fill="#22c55e" className="bsai-pipeline__packet">
          <animateMotion dur="10s" repeatCount="indefinite" rotate="auto" calcMode="linear">
            <mpath href="#bsai-lifecycle-route" />
          </animateMotion>
        </circle>
        <circle r="4" fill="#15803d" className="bsai-pipeline__packet bsai-pipeline__packet--lag">
          <animateMotion dur="10s" repeatCount="indefinite" rotate="auto" begin="3.3s" calcMode="linear">
            <mpath href="#bsai-lifecycle-route" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="#86efac" opacity="0.95" className="bsai-pipeline__packet bsai-pipeline__packet--lag2">
          <animateMotion dur="10s" repeatCount="indefinite" rotate="auto" begin="6.6s" calcMode="linear">
            <mpath href="#bsai-lifecycle-route" />
          </animateMotion>
        </circle>
      </svg>
    </div>
  )
}
