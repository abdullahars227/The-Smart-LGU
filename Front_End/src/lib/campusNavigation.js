/**
 * Campus map links for LGU — resolved locally (no Maps JS API, no RAG).
 * URLs are official Google Maps place links; tracking query params are stripped when possible.
 */

function cleanGoogleMapsUrl(href) {
  try {
    const u = new URL(href)
    u.searchParams.delete('entry')
    u.searchParams.delete('g_ep')
    const s = u.toString()
    return s.endsWith('?') ? s.slice(0, -1) : s
  } catch {
    return href
  }
}

const RAW = {
  gate: 'https://www.google.com/maps/place/Lahore+Garrison+University./@31.4636475,74.4438644,18.75z/data=!4m6!3m5!1s0x391908dd6138ade3:0xa6cc469044e1fbc1!8m2!3d31.4640061!4d74.4426299!16s%2Fm%2F010pd5lf?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D',
  mosque:
    'https://www.google.com/maps/place/LGU+Mosque/@31.4639946,74.441887,18.75z/data=!4m14!1m7!3m6!1s0x391908dd6138ade3:0xa6cc469044e1fbc1!2sLahore+Garrison+University.!8m2!3d31.4640061!4d74.4426299!16s%2Fm%2F010pd5lf!3m5!1s0x391909e651cb9b0b:0xea8a5d4f6f0f6f46!8m2!3d31.464227!4d74.4421965!16s%2Fg%2F11n5bkgj9_?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D',
  fountain:
    'https://www.google.com/maps/place/Fountain+Ground/@31.463808,74.4427512,18.75z/data=!4m14!1m7!3m6!1s0x391908dd6138ade3:0xa6cc469044e1fbc1!2sLahore+Garrison+University.!8m2!3d31.4640061!4d74.4426299!16s%2Fm%2F010pd5lf!3m5!1s0x391909931a853b81:0xcd85e4c6c52dcd95!8m2!3d31.4642173!4d74.4426298!16s%2Fg%2F11fr0kc843?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D',
  cafe: 'https://www.google.com/maps/place/LGU+Cafe/@31.4637027,74.4429736,19.5z/data=!4m6!3m5!1s0x39190960bba5542b:0xd5ee4a9cdcba8dd2!8m2!3d31.4635725!4d74.443295!16s%2Fg%2F11fqns1vrm?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D',
  sports:
    'https://www.google.com/maps/place/LGU+Sports+Complex+and+Library/@31.4637027,74.4429736,19.5z/data=!4m6!3m5!1s0x391909e871034f4d:0xb9431447e3916536!8m2!3d31.4633454!4d74.4441567!16s%2Fg%2F11fn6j_k1m?entry=ttu&g_ep=EgoyMDI2MDQxMy4wIKXMDSoASAFQAw%3D%3D',
}

export const CAMPUS_MAP_URLS = {
  gate: cleanGoogleMapsUrl(RAW.gate),
  mosque: cleanGoogleMapsUrl(RAW.mosque),
  fountain: cleanGoogleMapsUrl(RAW.fountain),
  cafe: cleanGoogleMapsUrl(RAW.cafe),
  sports: cleanGoogleMapsUrl(RAW.sports),
}

/** Short labels for quick-pick chips (order matches specificity in matcher). */
export const CAMPUS_QUICK_PICKS = [
  { id: 'gate', chipLabel: 'Main gate', label: 'Lahore Garrison University (main / gate)', url: CAMPUS_MAP_URLS.gate },
  { id: 'mosque', chipLabel: 'Mosque', label: 'LGU Mosque', url: CAMPUS_MAP_URLS.mosque },
  { id: 'fountain', chipLabel: 'Fountain Ground', label: 'Fountain Ground', url: CAMPUS_MAP_URLS.fountain },
  { id: 'cafe', chipLabel: 'Cafe', label: 'LGU Cafe', url: CAMPUS_MAP_URLS.cafe },
  { id: 'sports', chipLabel: 'Sports & Library', label: 'LGU Sports Complex and Library', url: CAMPUS_MAP_URLS.sports },
]

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function navigationIntent(q) {
  return /(where\b|how\s+to\s+(get|reach)|directions?|navigate|location|map|pin|google\s+maps|route|address|take\s+me)/i.test(
    q,
  )
}

/**
 * If the user message is about an on-campus place, return a canned reply + Maps URL.
 * More specific places are checked before the default gate / main campus pin.
 */
export function matchCampusNavigationQuery(raw) {
  const q = normalize(raw)
  if (q.length < 2) return null

  const intent = navigationIntent(q)
  const campus = /lgu|lahore\s+garrison|garrison\s+university|\bcampus\b|\buniversity\b/i.test(q)

  const rules = [
    {
      label: 'LGU Sports Complex and Library',
      url: CAMPUS_MAP_URLS.sports,
      test: () =>
        /sports\s+complex(\s+and\s+library)?|lgu\s+sports\s+complex|sports\s+complex\s+and\s+library|sports\s+ground|\blgu\s+sports\b|\blgu\s+library\b|(\blibrary\b.*\bsports\b)|(\bsports\b.*\blibrary\b)/i.test(
          q,
        ),
    },
    {
      label: 'LGU Cafe',
      url: CAMPUS_MAP_URLS.cafe,
      test: () => /lgu\s+cafe|\bcafeteria\b|\bcanteen\b/i.test(q) || (/\bcafe\b/.test(q) && (campus || intent)),
    },
    {
      label: 'Fountain Ground',
      url: CAMPUS_MAP_URLS.fountain,
      test: () => /fountain\s*ground|\bfountain\b/.test(q) && (campus || intent || /fountain\s*ground/.test(q)),
    },
    {
      label: 'LGU Mosque',
      url: CAMPUS_MAP_URLS.mosque,
      test: () => /lgu\s+mosque|\bmosque\b|\bmasjid\b|prayer\s+area|namaz/i.test(q),
    },
    {
      label: 'Lahore Garrison University (main / gate)',
      url: CAMPUS_MAP_URLS.gate,
      test: () => {
        if (/mosque|cafe|fountain|sports|library\s+and|complex/i.test(q)) return false
        if (
          /\bmain\s+gate\b|\buniversity\s+gate\b|\bentrance\b|\bcampus\s+entr(y|ance)\b|\bdefault\b.*\b(lgu|campus|location)\b/i.test(
            q,
          )
        )
          return true
        if (/\bgate\b/.test(q) && (campus || /lgu/.test(q))) return true
        if (intent && campus && !/\bmosque\b|\bcafe\b|\bfountain\b|\bsports\b/i.test(q)) return true
        if (/^(where\s+(is|'s)\s+)(lgu|lahore\s+garrison\s+university)\s*\??$/i.test(raw.trim())) return true
        if (/where\s+(is|'s)\s+(the\s+)?(lahore\s+garrison\s+university|lahore\s+garrison|lgu)(\s|$|\?)/i.test(q))
          return true
        if (/^(show\s+)?(me\s+)?(the\s+)?(lgu\s+)?(campus\s+)?map\b/i.test(q)) return true
        return false
      },
    },
  ]

  for (const r of rules) {
    if (r.test()) {
      return {
        label: r.label,
        mapsUrl: r.url,
        reply: `Here is ${r.label} on Google Maps. Open the link on your phone for live directions—the pin marks the exact spot on campus.`,
      }
    }
  }

  return null
}
