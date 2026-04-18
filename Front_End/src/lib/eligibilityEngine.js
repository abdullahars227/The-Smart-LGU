/**
 * Admission Eligibility & Program Recommendation — Intermediate (e.g. F.Sc / equivalent) aggregate % only.
 * Eligibility: aggregate ≥ 50% to apply; below that, not eligible.
 * Admission chance bands use your Intermediate % only (typical private-university style planning).
 *
 * Bands are illustrative — confirm cut-offs with LGU admissions each year.
 */

/** @typedef {'safe' | 'possible' | 'low'} BandCode */

export const MIN_INTERMEDIATE_ELIGIBLE = 50

/** @deprecated Use MIN_INTERMEDIATE_ELIGIBLE */
export const MIN_FSC_ELIGIBLE = MIN_INTERMEDIATE_ELIGIBLE

/** Preferred field → used only as a light tie-breaker for “best program for you”. */
export const PREFERRED_FIELD_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'software', label: 'Software' },
  { value: 'ai', label: 'AI' },
  { value: 'it', label: 'General IT' },
]

const PREFERRED_PROGRAM_ID = {
  software: 'bsse',
  ai: 'bsai',
  it: 'bsit',
}

/** Intermediate % bands: [safe from, possible from) — below possibleMin → Low Chance */
export const PROGRAMS = [
  {
    id: 'bscs',
    code: 'BSCS',
    name: 'BS Computer Science',
    safeFrom: 75,
    possibleFrom: 65,
    accent: 'bscs',
    competitiveNote: 'Usually the most competitive computing track.',
  },
  {
    id: 'bsse',
    code: 'BSSE',
    name: 'BS Software Engineering',
    safeFrom: 70,
    possibleFrom: 60,
    accent: 'bsse',
    competitiveNote: 'Strong demand; sits between CS and IT in typical cut-off patterns.',
  },
  {
    id: 'bsai',
    code: 'BSAI',
    name: 'BS Artificial Intelligence',
    safeFrom: 74,
    possibleFrom: 64,
    accent: 'bsai',
    competitiveNote: 'Growing intake; still selective like CS.',
  },
  {
    id: 'bsit',
    code: 'BSIT',
    name: 'BS Information Technology',
    safeFrom: 60,
    possibleFrom: 50,
    accent: 'bsit',
    competitiveNote: 'Often relatively more accessible than CS/AI for similar marks.',
  },
]

const BAND_SCORE = { safe: 3, possible: 2, low: 1 }

const PREFERENCE_BOOST = 0.45

function clampPct(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return null
  return Math.min(100, Math.max(0, x))
}

/**
 * @param {number} marks
 * @param {number} safeFrom
 * @param {number} possibleFrom
 */
export function bandForFsc(marks, safeFrom, possibleFrom) {
  if (marks >= safeFrom) {
    return {
      code: /** @type {BandCode} */ ('safe'),
      badge: 'Safe',
      emoji: '🟢',
    }
  }
  if (marks >= possibleFrom) {
    return {
      code: /** @type {BandCode} */ ('possible'),
      badge: 'Possible',
      emoji: '🟡',
    }
  }
  return {
    code: /** @type {BandCode} */ ('low'),
    badge: 'Low Chance',
    emoji: '🔴',
  }
}

function cardLine(program, bandCode) {
  if (bandCode === 'safe') {
    return 'Your marks sit in a comfortable range for this track based on typical patterns.'
  }
  if (bandCode === 'possible') {
    return `${program.code} is competitive—your score is in the “possible” range, not a guarantee.`
  }
  return 'This program is harder to get into with your current marks—consider other options or improving your profile.'
}

function scholarshipFromIntermediate(pct) {
  if (pct >= 90) {
    return {
      tier: 'full',
      headline: '100% semester fee scholarship (merit band)',
      detail:
        'Typically for very high Intermediate aggregates. Renewal and rules are set in the official scholarship policy.',
      conditions: [
        'Confirm SGPA / continuation rules with admissions and finance.',
      ],
    }
  }
  if (pct >= 80) {
    return {
      tier: 'partial',
      headline: '75% off semester fee (merit band)',
      detail: 'Often available around 80%+ Intermediate, subject to approval.',
      conditions: ['Usually requires maintaining SGPA 3.50 or above each semester to keep the benefit.'],
    }
  }
  return {
    tier: 'none',
    headline: 'Other options',
    detail: 'Ask admissions about need-based aid, siblings’ concessions, or HEC-linked programs.',
    conditions: [],
  }
}

/**
 * @param {object} raw
 * @param {number|string} [raw.intermediatePct]
 * @param {number|string} [raw.fscPct] legacy alias for intermediatePct
 * @param {string} [raw.preferredField] '' | 'software' | 'ai' | 'it'
 */
export function computeEligibility(raw) {
  const intermediatePct = clampPct(raw.intermediatePct ?? raw.fscPct)
  const preferredField = typeof raw.preferredField === 'string' ? raw.preferredField : ''

  const errors = []
  if (intermediatePct == null) errors.push('Enter a valid Intermediate percentage (0–100).')

  if (errors.length > 0) {
    return { ok: false, errors }
  }

  if (intermediatePct < MIN_INTERMEDIATE_ELIGIBLE) {
    return {
      ok: true,
      eligibleToApply: false,
      blocked: true,
      fscPct: intermediatePct,
      headline: 'Not eligible to apply',
      headlineDetail:
        'With Intermediate below 50%, you do not meet the minimum requirement we use here. Check with LGU admissions about repeat exams, equivalence, or bridge routes.',
      bestProgram: null,
      recommendationExplanation: null,
      preferenceNote: null,
      scholarship: scholarshipFromIntermediate(intermediatePct),
      programResults: [],
    }
  }

  const programResults = PROGRAMS.map((p) => {
    const band = bandForFsc(intermediatePct, p.safeFrom, p.possibleFrom)
    const score = BAND_SCORE[band.code]
    return {
      ...p,
      band: band.code,
      badge: band.badge,
      emoji: band.emoji,
      score,
      yourScoreLabel: intermediatePct % 1 === 0 ? intermediatePct : Math.round(intermediatePct * 10) / 10,
      line: cardLine(p, band.code),
      extra: p.competitiveNote,
    }
  })

  const favId = PREFERRED_PROGRAM_ID[preferredField]
  const boosted = programResults.map((p) => ({
    ...p,
    pickScore: p.score + (favId === p.id ? PREFERENCE_BOOST : 0),
  }))

  boosted.sort((a, b) => {
    if (b.pickScore !== a.pickScore) return b.pickScore - a.pickScore
    if (favId && a.id === favId && b.id !== favId) return -1
    if (favId && b.id === favId && a.id !== favId) return 1
    if (b.score !== a.score) return b.score - a.score
    return PROGRAMS.findIndex((x) => x.id === a.id) - PROGRAMS.findIndex((x) => x.id === b.id)
  })

  const best = boosted[0]

  let recommendationExplanation =
    'Based on your academic performance, this program offers the highest admission chance among the options we compared.'

  if (best.band === 'low' && programResults.some((p) => p.band !== 'low')) {
    recommendationExplanation =
      'We still picked the strongest relative option; several tracks may look difficult until marks or entry-test performance improve.'
  }

  if (favId === best.id && preferredField) {
    recommendationExplanation +=
      ' It also matches your preferred field, which is a good practical fit.'
  } else if (favId && favId !== best.id && preferredField) {
    recommendationExplanation += ` Your preferred field (${PREFERRED_FIELD_OPTIONS.find((o) => o.value === preferredField)?.label}) points elsewhere—compare both columns below.`
  }

  let preferenceNote = null
  if (preferredField && favId) {
    const favProg = programResults.find((p) => p.id === favId)
    if (favProg && favProg.id !== best.id) {
      preferenceNote = `You preferred ${PREFERRED_FIELD_OPTIONS.find((o) => o.value === preferredField)?.label}. ${favProg.code} is ${favProg.badge === 'Safe' ? 'still a solid' : favProg.badge === 'Possible' ? 'a possible' : 'a tougher'} choice for your marks—see the card below.`
    }
  }

  return {
    ok: true,
    eligibleToApply: true,
    blocked: false,
    fscPct: intermediatePct,
    preferredField: preferredField || null,
    headline: 'You are eligible to apply',
    headlineDetail: 'Your Intermediate aggregate meets the 50% minimum used in this planner.',
    bestProgram: {
      id: best.id,
      code: best.code,
      name: best.name,
      band: best.badge,
      emoji: best.emoji,
    },
    recommendationExplanation,
    preferenceNote,
    scholarship: scholarshipFromIntermediate(intermediatePct),
    programResults,
  }
}
