import { useEffect, useMemo, useState } from 'react'
import AnalyzeView from './components/AnalyzeView.jsx'
import DashboardView from './components/DashboardView.jsx'
import InsightsView from './components/InsightsView.jsx'
import RecentView from './components/RecentView.jsx'
import SettingsView from './components/SettingsView.jsx'
import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'
import { filterHistory } from './lib/demoAnalysis.js'
import { loadHistory, loadSettings, saveHistory, saveSettings, seedHistory } from './lib/storage.js'

export default function App() {
  const [view, setView] = useState('analyze')
  const [history, setHistory] = useState(() => loadHistory() ?? seedHistory())
  const [settings, setSettings] = useState(() => loadSettings())
  const [query, setQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('sample')

  useEffect(() => {
    saveHistory(history)
  }, [history])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const filtered = useMemo(() => filterHistory(history, query), [history, query])
  const active = history.find((item) => item.id === selectedId) ?? history[0] ?? null

  function navigate(next) {
    setView(next)
    setSidebarOpen(false)
  }

  function addCheck(entry) {
    setHistory((current) => [entry, ...current].slice(0, 24))
    setSelectedId(entry.id)
    setNote('fresh')
    setView('analyze')
  }

  function openCheck(item) {
    setSelectedId(item.id)
    setNote('opened')
    setView('analyze')
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <Sidebar
        view={view}
        open={sidebarOpen}
        onNavigate={navigate}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="workspace">
        <TopBar
          query={query}
          onQuery={setQuery}
          displayName={settings.displayName}
          onMenu={() => setSidebarOpen(true)}
          onOpenSettings={() => navigate('settings')}
        />
        <main className="content">
          <p className="demo-banner">
            <strong>Simulated demo.</strong> Scores are created in your browser for this interface.
            They are not a real fact-check, and no article is sent to a server.
          </p>

          {view === 'analyze' && (
            <AnalyzeView
              result={active}
              note={active && selectedId === active.id ? note : 'sample'}
              recent={filtered}
              total={history.length}
              query={query}
              onAnalyze={addCheck}
              onOpen={openCheck}
              onViewAll={() => navigate('recent')}
            />
          )}
          {view === 'recent' && (
            <RecentView
              items={filtered}
              total={history.length}
              query={query}
              onOpen={openCheck}
              onAnalyze={() => navigate('analyze')}
            />
          )}
          {view === 'dashboard' && (
            <DashboardView
              items={filtered}
              total={history.length}
              query={query}
              displayName={settings.displayName}
              onOpen={openCheck}
              onAnalyze={() => navigate('analyze')}
            />
          )}
          {view === 'insights' && (
            <InsightsView items={filtered} query={query} onAnalyze={() => navigate('analyze')} />
          )}
          {view === 'settings' && (
            <SettingsView
              settings={settings}
              historyCount={history.length}
              onSave={setSettings}
              onClear={() => {
                setHistory([])
                setSelectedId(null)
                setNote('sample')
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}
