// Trade, US state, and company size normalization for WhatsApp bot
// Maps Spanish/English variants to standardized values

const TRADE_MAP: Record<string, string> = {
  // Plomería
  plomero: 'plomeria', plomeria: 'plomeria', plumber: 'plomeria', plumbing: 'plomeria',
  fontanero: 'plomeria', fontaneria: 'plomeria',
  // Eléctrico
  electricista: 'electrico', electrico: 'electrico', electrical: 'electrico',
  electrician: 'electrico', electric: 'electrico',
  // Concreto
  concreto: 'concreto', concrete: 'concreto', albañil: 'concreto', albanil: 'concreto',
  mason: 'concreto', masonry: 'concreto', cemento: 'concreto',
  // Pintura
  pintura: 'pintura', pintor: 'pintura', painter: 'pintura', painting: 'pintura',
  // Drywall
  drywall: 'drywall', tablaroca: 'drywall', yeso: 'drywall', sheetrock: 'drywall',
  // Roofing
  roofing: 'roofing', techador: 'roofing', techos: 'roofing', roofer: 'roofing',
  techo: 'roofing', tejado: 'roofing',
  // HVAC
  hvac: 'hvac', 'aire acondicionado': 'hvac', 'air conditioning': 'hvac',
  calefaccion: 'hvac', calefacción: 'hvac', refrigeracion: 'hvac',
}

const US_STATES: Record<string, string> = {
  // Abbreviations
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', fl: 'Florida', ga: 'Georgia',
  hi: 'Hawaii', id: 'Idaho', il: 'Illinois', in: 'Indiana', ia: 'Iowa',
  ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana', me: 'Maine', md: 'Maryland',
  ma: 'Massachusetts', mi: 'Michigan', mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri',
  mt: 'Montana', ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
  nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota', oh: 'Ohio',
  ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania', ri: 'Rhode Island', sc: 'South Carolina',
  sd: 'South Dakota', tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont',
  va: 'Virginia', wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
  dc: 'Washington DC',
  // Spanish common variants
  'nueva york': 'New York', 'nuevo mexico': 'New Mexico', 'carolina del norte': 'North Carolina',
  'carolina del sur': 'South Carolina', 'dakota del norte': 'North Dakota',
  'dakota del sur': 'South Dakota', 'virginia del oeste': 'West Virginia',
}

// Add full state names (lowercase) as keys pointing to themselves
const STATE_FULL_NAMES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
] as const

for (const name of STATE_FULL_NAMES) {
  US_STATES[name.toLowerCase()] = name
}

const SIZE_RANGES = [
  { max: 5, label: '1-5' },
  { max: 15, label: '6-15' },
  { max: 50, label: '16-50' },
  { max: Infinity, label: '50+' },
] as const

/**
 * Normalize a trade term (Spanish or English) to a standard value.
 * Returns the normalized trade or null if unrecognized.
 */
export function normalizeTrade(input: string): string | null {
  const cleaned = input.trim().toLowerCase()
  return TRADE_MAP[cleaned] ?? null
}

/**
 * Normalize a US state name or abbreviation to its full canonical name.
 * Returns the state name or null if unrecognized.
 */
export function normalizeState(input: string): string | null {
  const cleaned = input.trim().toLowerCase()
  return US_STATES[cleaned] ?? null
}

/**
 * Parse a company size description into one of the standard ranges.
 * Accepts numbers, ranges, or descriptive text.
 * Returns the size range label or null if unparseable.
 */
export function normalizeCompanySize(input: string): string | null {
  const cleaned = input.trim().toLowerCase()

  // Direct range match
  if (['1-5', '6-15', '16-50', '50+'].includes(cleaned)) return cleaned

  // Extract first number from the string
  const match = cleaned.match(/(\d+)/)
  if (!match) return null

  const num = parseInt(match[1], 10)
  if (isNaN(num) || num < 1) return null

  const range = SIZE_RANGES.find((r) => num <= r.max)
  return range?.label ?? '50+'
}

/**
 * Check if a value is a valid US state.
 */
export function isValidState(input: string): boolean {
  return normalizeState(input) !== null
}

/**
 * Get the list of valid trade keys.
 */
export function getValidTrades(): readonly string[] {
  return ['plomeria', 'electrico', 'concreto', 'pintura', 'drywall', 'roofing', 'hvac', 'otro']
}
