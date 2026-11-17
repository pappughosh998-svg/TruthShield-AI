import { METRICS, summarize } from '../lib/demoAnalysis.js'

export default function InsightsView({ items, query, onAnalyze }) {
  const stats = summarize(items)
  const hasQuery = query.trim().length > 0
  const maxCount = Math.max(stats.counts.Safe, stats.counts.Fake, stats.counts.Suspicious, 1)

  return (
    <div className="page-stack">
      <header className="page-intro">
        <h1>Insights</h1>
        <p>
          {hasQuery
            ? `Patterns for checks matching “${query.trim()}”.`
            : 'A local summary of your simulated checks. This is not a research finding.'}
        </p>
      </header>

      {stats.total === 0 ? (
        <section className="panel empty-inline">
          <p>Run a few demo analyses to see how Safe, Fake, and Suspicious labels spread.</p>
          <button type="button" className="primary-btn" onClick={onAnalyze}>
            Analyze News
          </button>
        </section>
      ) : (
        <>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Verdict mix</h2>
                <p>{stats.total} simulated checks in this view.</p>
              </div>
            </div>
            <ul className="mix-list">
              {['Safe', 'Suspicious', 'Fake'].map((label) => (
                <li key={label}>
                  <div className="metric-top">
                    <span>{label}</span>
                    <strong>{stats.counts[label]}</strong>
                  </div>
                  <div className="bar" aria-hidden="true">
                    <span
                      className={`bar-fill tone-${label.toLowerCase()}`}
                      style={{ width: `${(stats.counts[label] / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Average scores</h2>
                <p>Each bar is the mean of that simulated metric.</p>
              </div>
            </div>
            <ul className="metric-list">
              <li>
                <div className="metric-top">
                  <span>Deception Probability</span>
                  <strong>{stats.averages.deception}%</strong>
                </div>
                <div className="bar" aria-hidden="true">
                  <span className="bar-fill tone-fake" style={{ width: `${stats.averages.deception}%` }} />
                </div>
              </li>
              {METRICS.map((metric) => (
                <li key={metric.key}>
                  <div className="metric-top">
                    <span>{metric.label}</span>
                    <strong>{stats.averages[metric.key]}%</strong>
                  </div>
                  <div className="bar" aria-hidden="true">
                    <span
                      className="bar-fill tone-suspicious"
                      style={{ width: `${stats.averages[metric.key]}%` }}
                    />
                  </div>
                  <p>{metric.hint}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  )
}
