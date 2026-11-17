import { formatWhen } from '../lib/demoAnalysis.js'

const PALETTES = [
  ['#0e7490', '#134e4a', '#67e8f9'],
  ['#9f1239', '#7c2d12', '#fb7185'],
  ['#a16207', '#1e3a5f', '#fbbf24'],
  ['#1d4ed8', '#0f766e', '#22d3ee'],
  ['#334155', '#115e59', '#5eead4'],
  ['#5b21b6', '#0f172a', '#67e8f9'],
]

function Thumb({ id, index }) {
  const [from, to, accent] = PALETTES[index % PALETTES.length]
  const gradientId = `thumb-${id}`
  return (
    <svg className="thumb" viewBox="0 0 320 180" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${gradientId})`} />
      <circle cx="250" cy="36" r="42" fill={accent} opacity="0.35" />
      <rect x="28" y="108" width="168" height="12" rx="6" fill="#f8fafc" opacity="0.85" />
      <rect x="28" y="130" width="112" height="8" rx="4" fill="#e2e8f0" opacity="0.55" />
      <path d="M210 180 250 96l28 42 18-16 24 58H210Z" fill="#041018" opacity="0.35" />
    </svg>
  )
}

export default function RecentChecks({
  items,
  total,
  query,
  onOpen,
  onViewAll,
  limit,
  heading = 'Recent Checks',
}) {
  const shown = typeof limit === 'number' ? items.slice(0, limit) : items
  const hasQuery = query.trim().length > 0

  return (
    <section className="panel" aria-labelledby="recent-heading">
      <div className="panel-head">
        <div>
          <h2 id="recent-heading">{heading}</h2>
          <p>
            {hasQuery
              ? `${items.length} of ${total} checks match “${query.trim()}”.`
              : 'Saved in this browser. Labels are simulated demo verdicts.'}
          </p>
        </div>
        {onViewAll && items.length > (limit ?? items.length) && (
          <button type="button" className="text-btn" onClick={onViewAll}>
            View all
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="empty-inline">
          {hasQuery
            ? 'No checks match that search.'
            : 'No checks yet. Analyze a headline or URL to store one here.'}
        </div>
      ) : (
        <div className={limit === 3 ? 'check-grid' : 'check-grid stretch'}>
          {shown.map((item) => (
            <button
              key={item.id}
              type="button"
              className="check-card"
              onClick={() => onOpen(item)}
            >
              <Thumb id={item.id} index={item.thumb ?? 0} />
              <span className="check-body">
                <span className={`badge ${item.verdict.toLowerCase()}`}>{item.verdict}</span>
                <strong>{item.title}</strong>
                <span className="check-meta">
                  {item.sourceLabel} · {formatWhen(item.createdAt)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
