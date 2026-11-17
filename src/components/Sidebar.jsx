import {
  AnalyzeIcon,
  DashboardIcon,
  HistoryIcon,
  InsightsIcon,
  SettingsIcon,
  ShieldIcon,
} from './Icons.jsx'

const NAV = [
  { id: 'analyze', label: 'Analyze', icon: AnalyzeIcon },
  { id: 'recent', label: 'Recent Checks', icon: HistoryIcon },
  { id: 'dashboard', label: 'My Dashboard', icon: DashboardIcon },
  { id: 'insights', label: 'Insights', icon: InsightsIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ view, open, onNavigate, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`backdrop ${open ? 'visible' : ''}`}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <button type="button" className="brand" onClick={() => onNavigate('analyze')}>
          <span className="brand-mark">
            <ShieldIcon />
          </span>
          <span>
            <strong>TruthShield AI</strong>
            <small>Credibility demo</small>
          </span>
        </button>

        <nav className="side-nav" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={active ? 'nav-item active' : 'nav-item'}
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <p className="side-note">
          Scores stay in this browser. Nothing is sent to an AI service.
        </p>
      </aside>
    </>
  )
}
