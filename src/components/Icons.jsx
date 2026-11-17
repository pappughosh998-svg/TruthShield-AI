function Svg({ children }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ShieldIcon() {
  return (
    <Svg>
      <path
        {...stroke}
        d="M12 3.2 19 6.1v5.2c0 4.4-2.8 7.5-7 9.5-4.2-2-7-5.1-7-9.5V6.1L12 3.2Z"
      />
      <path {...stroke} d="m8.8 12 2.1 2.1 4.3-4.4" />
    </Svg>
  )
}

export function AnalyzeIcon() {
  return (
    <Svg>
      <circle {...stroke} cx="11" cy="11" r="6.2" />
      <path {...stroke} d="m16 16 4 4" />
      <path {...stroke} d="M11 8.2v5.4M8.4 11h5.2" />
    </Svg>
  )
}

export function HistoryIcon() {
  return (
    <Svg>
      <circle {...stroke} cx="12" cy="12" r="8" />
      <path {...stroke} d="M12 8v4.2l2.8 1.8" />
    </Svg>
  )
}

export function DashboardIcon() {
  return (
    <Svg>
      <rect {...stroke} x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect {...stroke} x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
      <rect {...stroke} x="13.5" y="11" width="7" height="9.5" rx="1.5" />
      <rect {...stroke} x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    </Svg>
  )
}

export function InsightsIcon() {
  return (
    <Svg>
      <path {...stroke} d="M4 19.5h16" />
      <path {...stroke} d="M7 16.5v-4" />
      <path {...stroke} d="M12 16.5V7" />
      <path {...stroke} d="M17 16.5v-6.5" />
    </Svg>
  )
}

export function SettingsIcon() {
  return (
    <Svg>
      <circle {...stroke} cx="12" cy="12" r="3" />
      <path
        {...stroke}
        d="M12 3.5v2.2M12 18.3v2.2M4.8 6.6l1.6 1.6M17.6 15.8l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.4l1.6-1.6M17.6 8.2l1.6-1.6"
      />
    </Svg>
  )
}

export function SearchIcon() {
  return (
    <Svg>
      <circle {...stroke} cx="11" cy="11" r="6.2" />
      <path {...stroke} d="m16 16 4 4" />
    </Svg>
  )
}

export function BellIcon() {
  return (
    <Svg>
      <path
        {...stroke}
        d="M6 16.5h12l-1.2-1.8V10a4.8 4.8 0 0 0-9.6 0v4.7L6 16.5Z"
      />
      <path {...stroke} d="M10 16.5a2 2 0 0 0 4 0" />
    </Svg>
  )
}

export function MenuIcon() {
  return (
    <Svg>
      <path {...stroke} d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  )
}
