import { useState } from 'react'

export default function SettingsView({ settings, historyCount, onSave, onClear }) {
  const [name, setName] = useState(settings.displayName)
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)

  function save(event) {
    event.preventDefault()
    const displayName = name.trim().slice(0, 40) || 'Alex Morgan'
    setName(displayName)
    onSave({ displayName })
    setSaved(true)
  }

  return (
    <div className="page-stack">
      <header className="page-intro">
        <h1>Settings</h1>
        <p>Profile and storage for this demo live only in your browser.</p>
      </header>

      <form className="panel settings-form" onSubmit={save}>
        <h2>Profile</h2>
        <label className="field-label" htmlFor="display-name">
          Display name
        </label>
        <input
          id="display-name"
          className="editor url-input"
          value={name}
          maxLength={40}
          onChange={(event) => {
            setName(event.target.value)
            setSaved(false)
          }}
        />
        <div className="form-actions">
          <button type="submit" className="primary-btn">
            Save profile
          </button>
          {saved && <span>Saved on this device.</span>}
        </div>
      </form>

      <section className="panel">
        <h2>Stored checks</h2>
        <p>{historyCount} simulated checks are saved in localStorage.</p>
        {confirming ? (
          <div className="form-actions">
            <button
              type="button"
              className="danger-btn"
              onClick={() => {
                onClear()
                setConfirming(false)
              }}
            >
              Delete saved checks
            </button>
            <button type="button" className="text-btn" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="danger-btn"
            disabled={historyCount === 0}
            onClick={() => setConfirming(true)}
          >
            Clear recent checks
          </button>
        )}
      </section>

      <section className="panel">
        <h2>About this demo</h2>
        <p>
          TruthShield AI does not call a model, scrape articles, or decide what is true. The Analyze
          button builds scores from the characters you type so the interface can be tried end to end.
        </p>
      </section>
    </div>
  )
}
