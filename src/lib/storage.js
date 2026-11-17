const HISTORY_KEY = 'truthshield.history'
const SETTINGS_KEY = 'truthshield.settings'

export const defaultSettings = {
  displayName: 'Alex Morgan',
}

function isCheck(item) {
  return Boolean(
    item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      item.scores &&
      typeof item.scores.deception === 'number' &&
      typeof item.scores.spam === 'number' &&
      typeof item.scores.credibility === 'number' &&
      typeof item.scores.emotional === 'number' &&
      typeof item.scores.linguistic === 'number',
  )
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw == null) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed.filter(isCheck)
  } catch {
    return null
  }
}

export function saveHistory(items) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 24)))
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...defaultSettings }
    const parsed = JSON.parse(raw)
    const displayName =
      typeof parsed.displayName === 'string' && parsed.displayName.trim()
        ? parsed.displayName.trim().slice(0, 40)
        : defaultSettings.displayName
    return { displayName }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({ displayName: settings.displayName }),
  )
}

export function seedHistory() {
  const now = Date.now()
  return [
    {
      id: 'seed-safe',
      title: 'Health agency publishes seasonal vaccine guidance',
      excerpt:
        'Public health officials released the annual influenza vaccine composition and clinic schedule.',
      input:
        'Public health officials released the annual influenza vaccine composition and clinic schedule.',
      mode: 'text',
      sourceLabel: 'Pasted text',
      createdAt: now - 1000 * 60 * 42,
      verdict: 'Safe',
      thumb: 0,
      simulated: true,
      scores: {
        deception: 18,
        spam: 12,
        credibility: 86,
        emotional: 22,
        linguistic: 81,
      },
    },
    {
      id: 'seed-fake',
      title: 'Shocking report claims 5G towers rewrite human DNA overnight',
      excerpt:
        'A viral post says a secret frequency exposed in a leaked clip can rewrite DNA. No source is named.',
      input:
        'SHOCKING: secret 5G towers exposed. You will not believe this miracle frequency rewrites human DNA overnight!',
      mode: 'text',
      sourceLabel: 'Pasted text',
      createdAt: now - 1000 * 60 * 60 * 5,
      verdict: 'Fake',
      thumb: 1,
      simulated: true,
      scores: {
        deception: 91,
        spam: 88,
        credibility: 14,
        emotional: 93,
        linguistic: 27,
      },
    },
    {
      id: 'seed-suspicious',
      title: 'Unverified memo says city water treatment changed last week',
      excerpt:
        'An unsigned note claims treatment chemicals changed without a public notice. The city has not confirmed it.',
      input:
        'An unsigned memo claims the city water treatment plant changed chemicals last week without notice.',
      mode: 'text',
      sourceLabel: 'Pasted text',
      createdAt: now - 1000 * 60 * 60 * 26,
      verdict: 'Suspicious',
      thumb: 2,
      simulated: true,
      scores: {
        deception: 56,
        spam: 34,
        credibility: 41,
        emotional: 48,
        linguistic: 58,
      },
    },
  ]
}
