import type { WaiverTypeId } from './types'

export type ComplianceStatus = 'compliant' | 'disclaimer_required' | 'blocked'

export type StateWaiverRule = {
  state: string
  stateName: string
  hasStatutoryForm: boolean
  statuteReference: string
  waiverTypes: WaiverTypeId[]
  requiresNotarization: boolean
  /** States where only unconditional waivers require notarization */
  notarizationConditional?: 'unconditional_only'
  complianceStatus: ComplianceStatus
  /** States that prohibit advance waivers (through-date in the future) */
  prohibitsAdvanceWaivers: boolean
  notes: string
  requiredFields: string[]
  warningText: Partial<Record<WaiverTypeId, string>>
}

export type ComplianceCheckResult = {
  status: ComplianceStatus
  disclaimerText_en: string | null
  disclaimerText_es: string | null
  requiresNotarization: boolean
  prohibitsAdvanceWaivers: boolean
  swornStatementNote_en: string | null
  swornStatementNote_es: string | null
}

export const STATE_RULES: Record<string, StateWaiverRule> = {
  AZ: {
    state: 'AZ',
    stateName: 'Arizona',
    hasStatutoryForm: true,
    statuteReference: 'A.R.S. § 33-1008',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Arizona requires mandatory statutory forms for all 4 waiver types. Any modification to the statutory form language invalidates the waiver. Advance waivers prohibited. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  CA: {
    state: 'CA',
    stateName: 'California',
    hasStatutoryForm: true,
    statuteReference: 'Cal. Civ. Code §§ 8132-8138',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'California requires statutory forms. Waivers must be in "substantially" the form provided. Each form has mandatory NOTICE text that must appear in type at least as large as the largest type in the form. Advance waivers prohibited (Cal. Civ. Code § 8122).',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount', 'check_maker', 'exceptions'],
    warningText: {
      conditional_progress: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_progress: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
      conditional_final: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_final: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
    },
  },
  CO: {
    state: 'CO',
    stateName: 'Colorado',
    hasStatutoryForm: false,
    statuteReference: 'C.R.S. §§ 38-22-101 to 38-22-133',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Colorado does not have statutory waiver forms. Mechanics lien rights are governed by the Colorado Mechanics Lien Trust Fund statute.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  FL: {
    state: 'FL',
    stateName: 'Florida',
    hasStatutoryForm: true,
    statuteReference: 'Fla. Stat. § 713.20 (as amended by SB 658, eff. July 1, 2025)',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: true,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'CRITICAL: Florida SB 658 (eff. July 1, 2025) requires forms IDENTICAL to statutory forms in § 713.20(4) and (5). Requires notarization. Advance waivers unenforceable. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  GA: {
    state: 'GA',
    stateName: 'Georgia',
    hasStatutoryForm: true,
    statuteReference: 'O.C.G.A. § 44-14-366',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Georgia statutory forms: Interim Waiver (upon payment) and Final Waiver (upon final payment). Interim waiver auto-converts to unconditional after 90 days unless Affidavit of Nonpayment is filed. Must be in at least 12pt font. Advance waivers prohibited.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {
      conditional_progress: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY TO THE EXTENT (AND ONLY TO THE EXTENT) SET FORTH ABOVE, EVEN IF YOU HAVE NOT ACTUALLY RECEIVED SUCH PAYMENT, 90 DAYS AFTER THE DATE STATED ABOVE UNLESS YOU FILE AN AFFIDAVIT OF NONPAYMENT PRIOR TO THE EXPIRATION OF SUCH 90 DAY PERIOD.',
      unconditional_progress: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY TO THE EXTENT (AND ONLY TO THE EXTENT) SET FORTH ABOVE, EVEN IF YOU HAVE NOT ACTUALLY RECEIVED SUCH PAYMENT, 90 DAYS AFTER THE DATE STATED ABOVE UNLESS YOU FILE AN AFFIDAVIT OF NONPAYMENT PRIOR TO THE EXPIRATION OF SUCH 90 DAY PERIOD.',
      conditional_final: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY.',
      unconditional_final: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY.',
    },
  },
  IL: {
    state: 'IL',
    stateName: 'Illinois',
    hasStatutoryForm: false,
    statuteReference: '770 ILCS 60/1 et seq.',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Illinois does not have mandatory statutory waiver forms. The Mechanics Lien Act governs lien rights. NOTE: Illinois may require a Contractor\'s Sworn Statement listing all subcontractors and amounts owed — this is separate from a lien waiver.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  NJ: {
    state: 'NJ',
    stateName: 'New Jersey',
    hasStatutoryForm: false,
    statuteReference: 'N.J.S.A. §§ 2A:44A-1 to 2A:44A-38',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'New Jersey does not have statutory waiver forms. The Construction Lien Law governs lien rights.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  NV: {
    state: 'NV',
    stateName: 'Nevada',
    hasStatutoryForm: true,
    statuteReference: 'NRS § 108.2457',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: true,
    notarizationConditional: 'unconditional_only',
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Nevada requires mandatory statutory forms. Unconditional waivers MUST be notarized (NRS § 108.2457). Advance waivers are void. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  NY: {
    state: 'NY',
    stateName: 'New York',
    hasStatutoryForm: false,
    statuteReference: 'N.Y. Lien Law §§ 3-39-a',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'New York does not have statutory waiver forms. Waivers are generally enforceable if knowing and voluntary. Trust Fund Act (Lien Law Article 3-A) applies separately.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  TX: {
    state: 'TX',
    stateName: 'Texas',
    hasStatutoryForm: true,
    statuteReference: 'Tex. Prop. Code §§ 53.281-53.286',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: true,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Texas HAS statutory waiver forms (Tex. Prop. Code § 53.284). Waivers must substantially comply with statutory forms. Requires notarization (affidavit format). Advance waivers void. Preliminary notice requirements (monthly notices for non-original contractors) interact with waiver validity. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  // --- Tier 2 Statutory States ---
  MI: {
    state: 'MI',
    stateName: 'Michigan',
    hasStatutoryForm: true,
    statuteReference: 'MCL § 570.1115',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Michigan prescribes statutory waiver forms (MCL § 570.1115). Supports Conditional/Unconditional × Full/Partial. Notary recommended but not required. Advance waivers restricted. Contractor sworn statement may be required (MCL § 570.1110). Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  MO: {
    state: 'MO',
    stateName: 'Missouri',
    hasStatutoryForm: true,
    statuteReference: 'Mo. Rev. Stat. § 429.005 et seq.',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Missouri has prescribed waiver forms (Mo. Rev. Stat. § 429.005). Must substantially conform. Residential vs commercial distinction may apply. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  MS: {
    state: 'MS',
    stateName: 'Mississippi',
    hasStatutoryForm: true,
    statuteReference: 'Miss. Code § 85-7-405',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Mississippi prescribes statutory waiver forms (Miss. Code § 85-7-405). Supports Conditional/Unconditional × Interim/Final. Notary recommended but not required. Advance waivers void. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  UT: {
    state: 'UT',
    stateName: 'Utah',
    hasStatutoryForm: true,
    statuteReference: 'Utah Code § 38-1a-802',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: true,
    notes: 'Utah prescribes 4 standard waiver types (Utah Code § 38-1a-802). State Construction Registry (SCR) filing may interact with waiver requirements. Advance waivers restricted. Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  WY: {
    state: 'WY',
    stateName: 'Wyoming',
    hasStatutoryForm: true,
    statuteReference: 'Wyo. Stat. § 29-2-110',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Wyoming waivers must conform to statutory requirements (Wyo. Stat. § 29-2-110). Dedicated template active — statutory body language pending counsel review.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  // --- Non-Statutory States (use GenericWaiver) ---
  LA: {
    state: 'LA',
    stateName: 'Louisiana',
    hasStatutoryForm: false,
    statuteReference: 'La. R.S. §§ 9:4801-9:4855',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Louisiana uses "privilege" rather than "lien" terminology under the Private Works Act. No statutory waiver form required. Civil law system — common law waiver assumptions may not apply. Uses "parish" instead of "county."',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  MA: {
    state: 'MA',
    stateName: 'Massachusetts',
    hasStatutoryForm: false,
    statuteReference: 'M.G.L. c. 254, §§ 1-32',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Massachusetts does not have mandatory statutory waiver forms. Different rules may apply for residential vs commercial projects. "Filed sub" provisions affect notice requirements.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  MD: {
    state: 'MD',
    stateName: 'Maryland',
    hasStatutoryForm: false,
    statuteReference: 'Md. Code, Real Prop. §§ 9-101 to 9-113',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Maryland does not have mandatory statutory waiver forms. Preliminary notice is critical for preserving lien rights. Public works have separate Little Miller Act requirements.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  MN: {
    state: 'MN',
    stateName: 'Minnesota',
    hasStatutoryForm: false,
    statuteReference: 'Minn. Stat. §§ 514.01-514.17',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Minnesota does not have mandatory statutory waiver forms. Pre-lien notice timeline is critical. Residential projects have enhanced protections. Minn. Stat. § 337.10 addresses waiver void clauses.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  OH: {
    state: 'OH',
    stateName: 'Ohio',
    hasStatutoryForm: false,
    statuteReference: 'O.R.C. §§ 1311.01-1311.32',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Ohio does not have mandatory statutory waiver forms but has a statutory framework. Partial and final waivers recognized. Affidavit of mechanic\'s lien is a separate requirement. Advance waivers restricted for residential projects.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  OR: {
    state: 'OR',
    stateName: 'Oregon',
    hasStatutoryForm: false,
    statuteReference: 'ORS §§ 87.001-87.093',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Oregon does not have mandatory statutory waiver forms. Strict preliminary notice timeline. Public works require separate compliance under ORS 279C.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  PA: {
    state: 'PA',
    stateName: 'Pennsylvania',
    hasStatutoryForm: false,
    statuteReference: '49 P.S. §§ 1101-1510',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Pennsylvania does not have mandatory statutory waiver forms. Waivers are contractual — courts evaluate clarity and intent. Distinguishes between mechanics\' lien claims and bond claims — waiver of one does not necessarily waive the other.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  WA: {
    state: 'WA',
    stateName: 'Washington',
    hasStatutoryForm: false,
    statuteReference: 'RCW §§ 60.04.011-60.04.904',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    complianceStatus: 'compliant',
    prohibitsAdvanceWaivers: false,
    notes: 'Washington does not have mandatory statutory waiver forms. Strict retainage rules interact with final waivers. Release of retainage bond may be separate from waiver.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
}

export function getStateRule(state: string): StateWaiverRule | null {
  return STATE_RULES[state.toUpperCase()] || null
}

export function getAvailableWaiverTypes(state: string): WaiverTypeId[] {
  const rule = getStateRule(state)
  if (!rule) return ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final']
  return rule.waiverTypes
}

export function getRequiredFields(state: string): string[] {
  const rule = getStateRule(state)
  return rule?.requiredFields || ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount']
}

/**
 * Check whether notarization is required for a specific state + waiver type combo.
 * Some states (like NV) only require notarization on unconditional waivers.
 */
export function requiresNotarizationForType(state: string, waiverType: WaiverTypeId): boolean {
  const rule = getStateRule(state)
  if (!rule || !rule.requiresNotarization) return false
  if (rule.notarizationConditional === 'unconditional_only') {
    return waiverType.startsWith('unconditional')
  }
  return true
}

/**
 * Check state compliance and return disclaimer text if needed.
 * Used by the API to inject disclaimers into PDFs and by the wizard to show warnings.
 */
export function checkStateCompliance(state: string, waiverType: WaiverTypeId): ComplianceCheckResult {
  const rule = getStateRule(state)

  if (!rule) {
    return {
      status: 'compliant',
      disclaimerText_en: null,
      disclaimerText_es: null,
      requiresNotarization: false,
      prohibitsAdvanceWaivers: false,
      swornStatementNote_en: null,
      swornStatementNote_es: null,
    }
  }

  const needsNotary = requiresNotarizationForType(state, waiverType)

  let disclaimerText_en: string | null = null
  let disclaimerText_es: string | null = null

  if (rule.complianceStatus === 'disclaimer_required') {
    disclaimerText_en = `IMPORTANT: This document is generated using a general form. ${rule.stateName} law prescribes specific statutory waiver forms (${rule.statuteReference}). This document may not comply with ${rule.stateName} statutory requirements and may be unenforceable. Have this document reviewed by a licensed ${rule.stateName} attorney before execution.`
    disclaimerText_es = `IMPORTANTE: Este documento fue generado usando un formulario general. La ley de ${rule.stateName} requiere formularios de waiver estatutarios especificos (${rule.statuteReference}). Este documento puede no cumplir con los requisitos estatutarios de ${rule.stateName} y puede ser inaplicable. Haga que un abogado licenciado en ${rule.stateName} revise este documento antes de firmarlo.`
  }

  // Sworn statement notes
  let swornStatementNote_en: string | null = null
  let swornStatementNote_es: string | null = null
  if (rule.state === 'IL') {
    swornStatementNote_en = 'Illinois may require a Contractor\'s Sworn Statement (770 ILCS 60/5) listing all subcontractors and amounts owed. This is a separate document from a lien waiver.'
    swornStatementNote_es = 'Illinois puede requerir una Declaracion Jurada del Contratista (770 ILCS 60/5) listando todos los subcontratistas y montos adeudados. Este es un documento separado del waiver de lien.'
  } else if (rule.state === 'MI') {
    swornStatementNote_en = 'Michigan may require a Contractor\'s Sworn Statement (MCL § 570.1110) listing all subcontractors and amounts owed. This is a separate document from a lien waiver.'
    swornStatementNote_es = 'Michigan puede requerir una Declaracion Jurada del Contratista (MCL § 570.1110) listando todos los subcontratistas y montos adeudados. Este es un documento separado del waiver de lien.'
  }

  return {
    status: rule.complianceStatus,
    disclaimerText_en,
    disclaimerText_es,
    requiresNotarization: needsNotary,
    prohibitsAdvanceWaivers: rule.prohibitsAdvanceWaivers,
    swornStatementNote_en,
    swornStatementNote_es,
  }
}
