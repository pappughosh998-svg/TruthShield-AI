const SENSATIONAL = [
  'shocking',
  "you won't believe",
  'you will not believe',
  'miracle',
  'secret',
  'exposed',
  'click',
  'urgent',
  'guaranteed',
  'hoax',
  'fake',
  'breaking',
  "they don't want",
  'doctors hate',
  'act now',
]

const CREDIBLE = [
  'according to',
  'study',
  'researchers',
  'published',
  'official',
  'report',
  'data',
  'percent',
  'spokesperson',
  'journal',
]

export const METRICS = [
  {
    key: 'spam',
    label: 'Spam & Clickbait Score',
    hint: 'Higher means the wording looks more promotional or bait-like.',
    goodHigh: false,
  },
  {
    key: 'credibility',
    label: 'Source Credibility',
    hint: 'Higher means the text has more cues of a careful source.',
    goodHigh: true,
  },
  {
    key: 'emotional',
    label: 'Emotional Bias',
    hint: 'Higher means the language looks more emotionally loaded.',
    goodHigh: false,
  },
  {
    key: 'linguistic',
    label: 'Linguistic Integrity Check',
    hint: 'Higher means the wording looks cleaner and more consistent.',
    goodHigh: true,
  },
]

function clamp(value) {
  return Math.max(4, Math.min(97, Math.round(value)))
}

function unitFromHash(text, shift) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> shift) & 255) / 255
}

export function scoreInput(input) {
  const text = input.trim().toLowerCase()
  const sensationalHits = SENSATIONAL.filter((word) => text.includes(word)).length
  const credibleHits = CREDIBLE.filter((word) => text.includes(word)).length
  const letters = input.match(/[A-Za-z]/g)?.length ?? 0
  const caps = input.match(/[A-Z]/g)?.length ?? 0
  const capsRatio = letters ? caps / letters : 0
  const exclaims = input.match(/!/g)?.length ?? 0

  let deception = 12 + unitFromHash(text, 0) * 28
  let spam = 10 + unitFromHash(text, 3) * 24
  let credibility = 48 + unitFromHash(text, 6) * 22
  let emotional = 16 + unitFromHash(text, 9) * 22
  let linguistic = 58 + unitFromHash(text, 12) * 20

  deception += sensationalHits * 16 + exclaims * 5 + (capsRatio > 0.35 ? 12 : 0)
  if (sensationalHits >= 2) deception += 16
  spam += sensationalHits * 14 + exclaims * 6
  emotional += sensationalHits * 12 + exclaims * 7 + (capsRatio > 0.35 ? 10 : 0)
  credibility += credibleHits * 9 - sensationalHits * 10
  linguistic += credibleHits * 5 - (exclaims > 2 ? 14 : 0) - (capsRatio > 0.4 ? 12 : 0)
  deception -= credibleHits * 7

  if (text.length < 40) {
    credibility -= 8
    linguistic -= 8
  }

  return {
    deception: clamp(deception),
    spam: clamp(spam),
    credibility: clamp(credibility),
    emotional: clamp(emotional),
    linguistic: clamp(linguistic),
  }
}

export function verdictFor(deception) {
  if (deception >= 70) return 'Fake'
  if (deception >= 40) return 'Suspicious'
  return 'Safe'
}

export function parseArticleUrl(value) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (!url.hostname.includes('.')) return null
    return url
  } catch {
    return null
  }
}

function createId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `check-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function buildCheck(mode, rawInput) {
  const input = rawInput.trim()
  const scores = scoreInput(input)
  const verdict = verdictFor(scores.deception)
  const flat = input.replace(/\s+/g, ' ')
  let title = flat.slice(0, 84)
  let excerpt = flat.slice(0, 180)

  if (mode === 'url') {
    const url = parseArticleUrl(input)
    const host = url.hostname.replace(/^www\./, '')
    const path = url.pathname === '/' ? '' : url.pathname
    title = `${host}${path}`.slice(0, 84)
    excerpt = url.href
  } else if (flat.length > 84) {
    title = `${title.slice(0, 81)}…`
  }

  if (mode !== 'url' && flat.length > 180) {
    excerpt = `${excerpt.slice(0, 177)}…`
  }

  let hash = 0
  for (let i = 0; i < input.length; i += 1) hash = (hash + input.charCodeAt(i)) % 6

  return {
    id: createId(),
    title: title || 'Untitled check',
    excerpt: excerpt || input,
    input,
    mode,
    sourceLabel: mode === 'url' ? 'Article URL' : 'Pasted text',
    createdAt: Date.now(),
    verdict,
    thumb: hash,
    simulated: true,
    scores,
  }
}

export function filterHistory(items, query) {
  const needle = query.trim().toLowerCase()
  if (!needle) return items
  return items.filter((item) =>
    [item.title, item.excerpt, item.verdict, item.sourceLabel, item.input]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(needle),
  )
}

export function summarize(items) {
  const counts = { Safe: 0, Fake: 0, Suspicious: 0 }
  const totals = {
    deception: 0,
    spam: 0,
    credibility: 0,
    emotional: 0,
    linguistic: 0,
  }

  items.forEach((item) => {
    if (counts[item.verdict] != null) counts[item.verdict] += 1
    Object.keys(totals).forEach((key) => {
      totals[key] += item.scores[key] || 0
    })
  })

  const averages = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [
      key,
      items.length ? Math.round(value / items.length) : 0,
    ]),
  )

  return { counts, averages, total: items.length }
}

export function describeMetric(key, value) {
  const high = value >= 70
  const mid = value >= 40
  const copy = {
    spam: high
      ? 'Demo reading: wording looks strongly promotional or bait-like.'
      : mid
        ? 'Demo reading: some urgency or promotional phrasing.'
        : 'Demo reading: little clickbait-style wording.',
    credibility: high
      ? 'Demo reading: the text resembles a straightforward source.'
      : mid
        ? 'Demo reading: source signals are mixed.'
        : 'Demo reading: few cues that this came from a careful source.',
    emotional: high
      ? 'Demo reading: language is highly charged.'
      : mid
        ? 'Demo reading: some emotional framing.'
        : 'Demo reading: tone stays relatively neutral.',
    linguistic: high
      ? 'Demo reading: wording looks consistent and readable.'
      : mid
        ? 'Demo reading: a few rough or uneven phrases.'
        : 'Demo reading: phrasing looks irregular or overloaded.',
  }
  return copy[key]
}

export function metricTone(value, goodHigh) {
  const quality = goodHigh ? value : 100 - value
  if (quality >= 70) return 'safe'
  if (quality >= 40) return 'suspicious'
  return 'fake'
}

export function formatWhen(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
