/** Maps URL-friendly slugs to state abbreviations used in STATE_RULES */
export const STATE_SLUGS: Record<string, string> = {
  arizona: 'AZ',
  california: 'CA',
  colorado: 'CO',
  florida: 'FL',
  georgia: 'GA',
  illinois: 'IL',
  louisiana: 'LA',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  nevada: 'NV',
  'new-jersey': 'NJ',
  'new-york': 'NY',
  ohio: 'OH',
  oregon: 'OR',
  pennsylvania: 'PA',
  texas: 'TX',
  utah: 'UT',
  washington: 'WA',
  wyoming: 'WY',
}

/** Reverse map: state abbreviation to URL slug */
export const STATE_TO_SLUG: Record<string, string> = {
  AZ: 'arizona',
  CA: 'california',
  CO: 'colorado',
  FL: 'florida',
  GA: 'georgia',
  IL: 'illinois',
  LA: 'louisiana',
  MA: 'massachusetts',
  MD: 'maryland',
  MI: 'michigan',
  MN: 'minnesota',
  MO: 'missouri',
  MS: 'mississippi',
  NJ: 'new-jersey',
  NV: 'nevada',
  NY: 'new-york',
  OH: 'ohio',
  OR: 'oregon',
  PA: 'pennsylvania',
  TX: 'texas',
  UT: 'utah',
  WA: 'washington',
  WY: 'wyoming',
}

export function getStateFromSlug(slug: string): string | null {
  return STATE_SLUGS[slug] || null
}

export function getSlugFromState(stateCode: string): string | null {
  return STATE_TO_SLUG[stateCode] || null
}

export function getAllStateSlugs(): string[] {
  return Object.keys(STATE_SLUGS)
}
