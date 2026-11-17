import { metricTone } from '../lib/demoAnalysis.js'

export default function Gauge({ value }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const tone = metricTone(value, false)

  return (
    <div className={`gauge tone-${tone}`}>
      <svg viewBox="0 0 148 148" aria-hidden="true">
        <circle className="gauge-track" cx="74" cy="74" r={radius} />
        <circle
          className="gauge-value"
          cx="74"
          cy="74"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <strong>{value}%</strong>
        <span>risk</span>
      </div>
    </div>
  )
}
