import { useEffect, useRef, useState } from 'react'
import { BellIcon, MenuIcon, SearchIcon } from './Icons.jsx'

const NOTICES = [
  {
    id: 'local-only',
    title: 'Checks stay on this device',
    body: 'Recent checks are saved in localStorage and never leave the browser.',
  },
  {
    id: 'simulated',
    title: 'Results are simulated',
    body: 'Deception and credibility scores are demo numbers, not a live fact-check.',
  },
]

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'TS'
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function TopBar({ query, onQuery, displayName, onMenu, onOpenSettings }) {
  const [noticesOpen, setNoticesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [noticesSeen, setNoticesSeen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!noticesOpen && !profileOpen) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setNoticesOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [noticesOpen, profileOpen])

  return (
    <header className="topbar">
      <button type="button" className="icon-btn menu-btn" onClick={onMenu} aria-label="Open menu">
        <MenuIcon />
      </button>

      <label className="search">
        <SearchIcon />
        <span className="sr-only">Search recent checks</span>
        <input
          type="search"
          value={query}
          placeholder="Search checks"
          onChange={(event) => onQuery(event.target.value)}
        />
      </label>

      <div className="topbar-actions" ref={rootRef}>
        <div className="menu-anchor">
          <button
            type="button"
            className="icon-btn"
            aria-label="Notifications"
            aria-expanded={noticesOpen}
            onClick={() => {
              setNoticesOpen((open) => !open)
              setProfileOpen(false)
              setNoticesSeen(true)
            }}
          >
            <BellIcon />
            {!noticesSeen && <span className="alert-dot" />}
          </button>
          {noticesOpen && (
            <div className="popover" role="dialog" aria-label="Notifications">
              <p className="popover-kicker">Demo notifications</p>
              <ul>
                {NOTICES.map((notice) => (
                  <li key={notice.id}>
                    <strong>{notice.title}</strong>
                    <span>{notice.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="menu-anchor">
          <button
            type="button"
            className="avatar-btn"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((open) => !open)
              setNoticesOpen(false)
            }}
          >
            <span className="avatar">{initials(displayName)}</span>
          </button>
          {profileOpen && (
            <div className="popover profile-popover" role="dialog" aria-label="Profile">
              <p className="popover-kicker">Local profile</p>
              <strong>{displayName}</strong>
              <span>Analyst · this browser only</span>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  setProfileOpen(false)
                  onOpenSettings()
                }}
              >
                Open settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
