import { useEffect, useRef, useState } from 'react'
import { buildCheck, parseArticleUrl } from '../lib/demoAnalysis.js'
import RecentChecks from './RecentChecks.jsx'
import ResultsPanel from './ResultsPanel.jsx'

export default function AnalyzeView({
  result,
  note,
  recent,
  total,
  query,
  onAnalyze,
  onOpen,
  onViewAll,
}) {
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function submit() {
    if (busy) return
    const raw = mode === 'url' ? url : text
    if (!raw.trim()) {
      setError(mode === 'url' ? 'Enter an article URL first.' : 'Paste a headline or excerpt first.')
      return
    }
    if (mode === 'url' && !parseArticleUrl(raw)) {
      setError('Enter a valid link, such as https://example.com/story.')
      return
    }
    if (raw.trim().length > 5000) {
      setError('Keep the demo input under 5,000 characters.')
      return
    }

    setError('')
    setBusy(true)
    timerRef.current = window.setTimeout(() => {
      onAnalyze(buildCheck(mode, raw))
      setBusy(false)
    }, 650)
  }

  return (
    <div className="analyze-page">
      <div className="analyze-top">
        <section className="panel" aria-labelledby="analyze-heading">
          <div className="panel-head">
            <div>
              <h2 id="analyze-heading">Analyze News</h2>
              <p>Paste text or an article link. The score is generated locally for this demo.</p>
            </div>
          </div>

          <div className="tabs" role="tablist" aria-label="Analysis input">
            <button
              type="button"
              role="tab"
              id="tab-text"
              aria-selected={mode === 'text'}
              aria-controls="panel-text"
              className={mode === 'text' ? 'tab active' : 'tab'}
              onClick={() => {
                setMode('text')
                setError('')
              }}
            >
              Paste Text
            </button>
            <button
              type="button"
              role="tab"
              id="tab-url"
              aria-selected={mode === 'url'}
              aria-controls="panel-url"
              className={mode === 'url' ? 'tab active' : 'tab'}
              onClick={() => {
                setMode('url')
                setError('')
              }}
            >
              Article URL
            </button>
          </div>

          {mode === 'text' ? (
            <div id="panel-text" role="tabpanel" aria-labelledby="tab-text">
              <label className="field-label" htmlFor="article-text">
                Article text
              </label>
              <textarea
                id="article-text"
                className="editor"
                value={text}
                placeholder="Paste a headline or article excerpt. Words like “shocking” or “according to” move the demo scores."
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') submit()
                }}
              />
            </div>
          ) : (
            <div id="panel-url" role="tabpanel" aria-labelledby="tab-url">
              <label className="field-label" htmlFor="article-url">
                Article URL
              </label>
              <input
                id="article-url"
                className="editor url-input"
                type="url"
                inputMode="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    submit()
                  }
                }}
              />
            </div>
          )}

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button type="button" className="primary-btn" onClick={submit} disabled={busy}>
              {busy ? 'Analyzing demo…' : 'Analyze News'}
            </button>
            <span>{mode === 'text' ? 'Ctrl+Enter to analyze' : 'Press Enter to analyze'}</span>
          </div>
        </section>

        <ResultsPanel result={result} note={note} />
      </div>

      <RecentChecks
        items={recent}
        total={total}
        query={query}
        onOpen={onOpen}
        onViewAll={onViewAll}
        limit={3}
      />
    </div>
  )
}
