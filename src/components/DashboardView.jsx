import { summarize } from '../lib/demoAnalysis.js'
import RecentChecks from './RecentChecks.jsx'

export default function DashboardView({ items, total, query, displayName, onOpen, onAnalyze }) {
  const stats = summarize(items)
  const hasQuery = query.trim().length > 0

  return (
    <div className="page-stack">
      <header className="page-intro">
        <h1>My Dashboard</h1>
        <p>
          Welcome back, {displayName}.{' '}
          {hasQuery
            ? `Counts below use checks matching “${query.trim()}”.`
            : 'These totals come from simulated checks saved in this browser.'}
        </p>
      </header>

      <div className="stat-grid">
        <article className="stat-card">
          <span>Checks</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="stat-card safe">
          <span>Safe</span>
          <strong>{stats.counts.Safe}</strong>
        </article>
        <article className="stat-card suspicious">
          <span>Suspicious</span>
          <strong>{stats.counts.Suspicious}</strong>
        </article>
        <article className="stat-card fake">
          <span>Fake</span>
          <strong>{stats.counts.Fake}</strong>
        </article>
      </div>

      <article className="panel average-card">
        <div>
          <h2>Average deception probability</h2>
          <p>Mean of the simulated risk scores in the current list.</p>
        </div>
        <strong>{stats.averages.deception}%</strong>
      </article>

      {stats.total === 0 ? (
        <div className="panel empty-inline">
          <p>Nothing to summarize yet.</p>
          <button type="button" className="primary-btn" onClick={onAnalyze}>
            Analyze News
          </button>
        </div>
      ) : (
        <RecentChecks
          items={items}
          total={total}
          query={query}
          onOpen={onOpen}
          limit={3}
          heading="Latest in this view"
        />
      )}
    </div>
  )
}
