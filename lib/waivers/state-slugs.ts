/** Maps URL-friendly slugs to state abbreviations used in STATE_RULES */
export const STATE_SLUGS: Record<string, string> = {
  california: 'CA',
  georgia: 'GA',
  texas: 'TX',
  florida: 'FL',
  'new-york': 'NY',
}

/** Reverse map: state abbreviation to URL slug */
export const STATE_TO_SLUG: Record<string, string> = {
  CA: 'california',
  GA: 'georgia',
  TX: 'texas',
  FL: 'florida',
  NY: 'new-york',
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
