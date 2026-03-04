import type { WaiverTypeId } from './types'

export type StateWaiverRule = {
  state: string
  stateName: string
  hasStatutoryForm: boolean
  statuteReference: string
  waiverTypes: WaiverTypeId[]
  requiresNotarization: boolean
  notes: string
  requiredFields: string[]
  warningText: Partial<Record<WaiverTypeId, string>>
}

export const STATE_RULES: Record<string, StateWaiverRule> = {
  CA: {
    state: 'CA',
    stateName: 'California',
    hasStatutoryForm: true,
    statuteReference: 'Cal. Civ. Code §§ 8132-8138',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'California requires statutory forms. Waivers must be in "substantially" the form provided. Each form has mandatory NOTICE text that must appear in type at least as large as the largest type in the form.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount', 'check_maker', 'exceptions'],
    warningText: {
      conditional_progress: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_progress: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
      conditional_final: 'NOTICE: THIS DOCUMENT WAIVES THE CLAIMANT\'S LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS EFFECTIVE ON RECEIPT OF PAYMENT. A PERSON SHOULD NOT RELY ON THIS DOCUMENT UNLESS SATISFIED THAT THE CLAIMANT HAS RECEIVED PAYMENT.',
      unconditional_final: 'NOTICE: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP PAYMENT NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.',
    },
  },
  GA: {
    state: 'GA',
    stateName: 'Georgia',
    hasStatutoryForm: true,
    statuteReference: 'O.C.G.A. § 44-14-366',
    waiverTypes: ['conditional_progress', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Georgia uses "Interim Waiver" (progress) and "Final Waiver" forms. The interim waiver is automatically conditional for 90 days, then converts to unconditional unless an Affidavit of Nonpayment is filed. Must be in at least 12pt font.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {
      conditional_progress: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY TO THE EXTENT (AND ONLY TO THE EXTENT) SET FORTH ABOVE, EVEN IF YOU HAVE NOT ACTUALLY RECEIVED SUCH PAYMENT, 90 DAYS AFTER THE DATE STATED ABOVE UNLESS YOU FILE AN AFFIDAVIT OF NONPAYMENT PRIOR TO THE EXPIRATION OF SUCH 90 DAY PERIOD.',
      unconditional_final: 'NOTICE: WHEN YOU EXECUTE AND SUBMIT THIS DOCUMENT, YOU SHALL BE CONCLUSIVELY DEEMED TO HAVE WAIVED AND RELEASED ANY AND ALL LIENS AND CLAIMS OF LIENS UPON THE FOREGOING DESCRIBED PROPERTY AND ANY RIGHTS REGARDING ANY LABOR OR MATERIAL BOND REGARDING THE SAID PROPERTY.',
    },
  },
  TX: {
    state: 'TX',
    stateName: 'Texas',
    hasStatutoryForm: false,
    statuteReference: 'Tex. Prop. Code §§ 53.281-53.286',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Texas does not have statutory waiver forms. Waivers must clearly identify the project, amount, and scope of rights being waived.',
    requiredFields: ['claimant_name', 'customer_name', 'job_location', 'owner_name', 'through_date', 'amount'],
    warningText: {},
  },
  FL: {
    state: 'FL',
    stateName: 'Florida',
    hasStatutoryForm: false,
    statuteReference: 'Fla. Stat. §§ 713.01-713.37',
    waiverTypes: ['conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final'],
    requiresNotarization: false,
    notes: 'Florida does not have statutory waiver forms but has detailed lien law. Waivers are enforceable if properly executed.',
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
    notes: 'New York does not have statutory waiver forms. Waivers are generally enforceable.',
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
