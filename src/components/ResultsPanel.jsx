import { describeMetric, formatWhen, METRICS, metricTone } from '../lib/demoAnalysis.js'
import Gauge from './Gauge.jsx'

const NOTES = {
  fresh: 'Updated just now from the text or URL in the form. Still a simulated demo score.',
  opened: 'Opened from your saved checks. The numbers were simulated when this check was created.',
  sample: 'Sample check stored in this browser so the dashboard is visible before you run your own.',
}

export default function ResultsPanel({ result, note }) {
  if (!result) {
    return (
      <section className="panel results-panel" aria-labelledby="results-heading">
        <div className="panel-head">
          <div>
            <h2 id="results-heading">Analysis results</h2>
            <p>Run an analysis to fill these cards with simulated demo scores.</p>
          </div>
        </div>
        <div className="empty-inline">No result selected.</div>
      </section>
    )
  }

  const tone = metricTone(result.scores.deception, false)

  return (
    <section className="panel results-panel" aria-labelledby="results-heading" aria-live="polite">
      <div className="panel-head">
        <div>
          <h2 id="results-heading">Analysis results</h2>
          <p>{NOTES[note] || NOTES.sample}</p>
        </div>
        <span className="sim-pill">Simulated demo</span>
      </div>

      <div className={`verdict-row tone-${tone}`}>
        <span className={`badge ${result.verdict.toLowerCase()}`}>{result.verdict}</span>
        <div>
          <strong>{result.title}</strong>
          <span>
            {result.sourceLabel} · {formatWhen(result.createdAt)}
          </span>
        </div>
      </div>

      <div className="gauge-block">
        <Gauge value={result.scores.deception} />
        <div>
          <h3>Deception Probability</h3>
          <p>
            {result.scores.deception >= 70
              ? 'Demo reading: this sample looks highly deceptive.'
              : result.scores.deception >= 40
                ? 'Demo reading: this sample looks uncertain and needs a closer look.'
                : 'Demo reading: this sample looks relatively low risk.'}
          </p>
        </div>
      </div>

      <ul className="metric-list">
        {METRICS.map((metric) => {
          const value = result.scores[metric.key]
          const barTone = metricTone(value, metric.goodHigh)
          return (
            <li key={metric.key}>
              <div className="metric-top">
                <span>{metric.label}</span>
                <strong>{value}%</strong>
              </div>
              <div className="bar" aria-hidden="true">
                <span className={`bar-fill tone-${barTone}`} style={{ width: `${value}%` }} />
              </div>
              <p>{describeMetric(metric.key, value)}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
