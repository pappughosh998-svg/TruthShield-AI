import RecentChecks from './RecentChecks.jsx'

export default function RecentView({ items, total, query, onOpen, onAnalyze }) {
  return (
    <div className="page-stack">
      <header className="page-intro">
        <h1>Recent Checks</h1>
        <p>Every analysis you run is kept in localStorage on this browser.</p>
      </header>
      <RecentChecks
        items={items}
        total={total}
        query={query}
        onOpen={onOpen}
        heading="Saved analyses"
      />
      {total === 0 && (
        <button type="button" className="primary-btn" onClick={onAnalyze}>
          Analyze News
        </button>
      )}
    </div>
  )
}
