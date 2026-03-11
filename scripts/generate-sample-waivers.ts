/**
 * Generate sample waivers for compliance review.
 * Run with: npx tsx scripts/generate-sample-waivers.ts
 */
import { writeFileSync, mkdirSync } from 'fs'
import { renderToBuffer } from '@react-pdf/renderer'
import { CaliforniaWaiver } from '../components/pdf/california-waiver'
import { GeorgiaWaiver } from '../components/pdf/georgia-waiver'
import { GenericWaiver } from '../components/pdf/generic-waiver'
import { TexasWaiver } from '../components/pdf/texas-waiver'
import { FloridaWaiver } from '../components/pdf/florida-waiver'
import { ArizonaWaiver } from '../components/pdf/arizona-waiver'
import { NevadaWaiver } from '../components/pdf/nevada-waiver'
import { MichiganWaiver } from '../components/pdf/michigan-waiver'
import { MississippiWaiver } from '../components/pdf/mississippi-waiver'
import { MissouriWaiver } from '../components/pdf/missouri-waiver'
import { UtahWaiver } from '../components/pdf/utah-waiver'
import { WyomingWaiver } from '../components/pdf/wyoming-waiver'
import { checkStateCompliance } from '../lib/waivers/state-rules'
import type { WaiverPdfData } from '../lib/waivers/generate-pdf'
import type { WaiverTypeId } from '../lib/waivers/types'

const OUTPUT_DIR = 'docs/sample-waivers'

// Base data shared across all samples
const baseData: Omit<WaiverPdfData, 'waiverType' | 'state' | 'amount' | 'complianceDisclaimer' | 'requiresNotarization'> = {
  claimantName: 'Martinez Drywall LLC',
  claimantAddress: '1234 Oak Street, Houston, TX 77001',
  customerName: 'ABC General Contractors Inc.',
  jobLocation: '5678 Elm Ave, Suite 200',
  ownerName: 'John Smith Properties LLC',
  throughDate: '2026-02-28',
  checkMaker: 'ABC General Contractors Inc.',
  checkAmount: 45000,
  exceptions: 'None',
  signatureDate: '2026-03-10',
  showWatermark: false,
  county: 'Harris',
}

type SampleConfig = {
  label: string
  state: string
  waiverType: WaiverTypeId
  amount: number
  template: (data: WaiverPdfData) => React.JSX.Element
  isPublicProject?: boolean
}

const samples: SampleConfig[] = [
  // California — statutory template
  { label: 'CA-conditional-progress', state: 'CA', waiverType: 'conditional_progress', amount: 45000, template: CaliforniaWaiver },
  { label: 'CA-unconditional-final', state: 'CA', waiverType: 'unconditional_final', amount: 120000, template: CaliforniaWaiver },
  // Georgia — statutory template
  { label: 'GA-conditional-progress', state: 'GA', waiverType: 'conditional_progress', amount: 32000, template: GeorgiaWaiver },
  { label: 'GA-unconditional-final', state: 'GA', waiverType: 'unconditional_final', amount: 85000, template: GeorgiaWaiver },
  // Texas — scaffold template (statutory, requires notarization)
  { label: 'TX-conditional-progress', state: 'TX', waiverType: 'conditional_progress', amount: 55000, template: TexasWaiver },
  { label: 'TX-unconditional-final', state: 'TX', waiverType: 'unconditional_final', amount: 150000, template: TexasWaiver },
  // Florida — scaffold template (statutory, requires notarization, SB 658)
  { label: 'FL-conditional-progress', state: 'FL', waiverType: 'conditional_progress', amount: 38000, template: FloridaWaiver },
  // Arizona — scaffold template (statutory)
  { label: 'AZ-unconditional-progress', state: 'AZ', waiverType: 'unconditional_progress', amount: 27000, template: ArizonaWaiver },
  // Nevada — scaffold template (unconditional requires notarization)
  { label: 'NV-conditional-progress', state: 'NV', waiverType: 'conditional_progress', amount: 41000, template: NevadaWaiver },
  { label: 'NV-unconditional-final', state: 'NV', waiverType: 'unconditional_final', amount: 95000, template: NevadaWaiver },
  // Michigan — dedicated template (statutory, sworn statement note)
  { label: 'MI-conditional-progress', state: 'MI', waiverType: 'conditional_progress', amount: 36000, template: MichiganWaiver },
  { label: 'MI-unconditional-final', state: 'MI', waiverType: 'unconditional_final', amount: 88000, template: MichiganWaiver },
  // Mississippi — dedicated template (statutory, Interim/Final terminology)
  { label: 'MS-conditional-progress', state: 'MS', waiverType: 'conditional_progress', amount: 29000, template: MississippiWaiver },
  { label: 'MS-unconditional-final', state: 'MS', waiverType: 'unconditional_final', amount: 67000, template: MississippiWaiver },
  // Missouri — dedicated template (statutory, residential/commercial note)
  { label: 'MO-conditional-progress', state: 'MO', waiverType: 'conditional_progress', amount: 42000, template: MissouriWaiver },
  { label: 'MO-unconditional-final', state: 'MO', waiverType: 'unconditional_final', amount: 110000, template: MissouriWaiver },
  // Utah — dedicated template (statutory, SCR note)
  { label: 'UT-conditional-progress', state: 'UT', waiverType: 'conditional_progress', amount: 33000, template: UtahWaiver },
  { label: 'UT-unconditional-final', state: 'UT', waiverType: 'unconditional_final', amount: 78000, template: UtahWaiver },
  // Wyoming — dedicated template (statutory)
  { label: 'WY-conditional-progress', state: 'WY', waiverType: 'conditional_progress', amount: 25000, template: WyomingWaiver },
  { label: 'WY-unconditional-final', state: 'WY', waiverType: 'unconditional_final', amount: 62000, template: WyomingWaiver },
  // Colorado — generic template (non-statutory, compliant)
  { label: 'CO-unconditional-final', state: 'CO', waiverType: 'unconditional_final', amount: 72000, template: GenericWaiver },
  // New York — generic template
  { label: 'NY-conditional-progress', state: 'NY', waiverType: 'conditional_progress', amount: 60000, template: GenericWaiver },
  // Illinois — generic template (sworn statement note)
  { label: 'IL-unconditional-progress', state: 'IL', waiverType: 'unconditional_progress', amount: 48000, template: GenericWaiver },
  // New Jersey — generic template
  { label: 'NJ-conditional-progress', state: 'NJ', waiverType: 'conditional_progress', amount: 52000, template: GenericWaiver },
  // Louisiana — generic template (privilege terminology)
  { label: 'LA-unconditional-progress', state: 'LA', waiverType: 'unconditional_progress', amount: 37000, template: GenericWaiver },
  // Maryland — generic template (preliminary notice)
  { label: 'MD-conditional-progress', state: 'MD', waiverType: 'conditional_progress', amount: 44000, template: GenericWaiver },
  // Massachusetts — generic template (residential/commercial)
  { label: 'MA-unconditional-final', state: 'MA', waiverType: 'unconditional_final', amount: 91000, template: GenericWaiver },
  // Minnesota — generic template (pre-lien notice)
  { label: 'MN-conditional-progress', state: 'MN', waiverType: 'conditional_progress', amount: 39000, template: GenericWaiver },
  // Ohio — generic template (affidavit separate)
  { label: 'OH-unconditional-progress', state: 'OH', waiverType: 'unconditional_progress', amount: 46000, template: GenericWaiver },
  // Oregon — generic template (strict notice timeline)
  { label: 'OR-conditional-progress', state: 'OR', waiverType: 'conditional_progress', amount: 35000, template: GenericWaiver },
  // Pennsylvania — generic template (lien vs bond)
  { label: 'PA-unconditional-final', state: 'PA', waiverType: 'unconditional_final', amount: 83000, template: GenericWaiver },
  // Washington — generic template (strict retainage)
  { label: 'WA-conditional-progress', state: 'WA', waiverType: 'conditional_progress', amount: 50000, template: GenericWaiver },
  // Public project test
  { label: 'CO-public-project', state: 'CO', waiverType: 'conditional_progress', amount: 95000, template: GenericWaiver, isPublicProject: true },
]

async function generateAll() {
  mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log(`Generating ${samples.length} sample waivers...\n`)

  for (const sample of samples) {
    const compliance = checkStateCompliance(sample.state, sample.waiverType)

    const data: WaiverPdfData = {
      ...baseData,
      state: sample.state,
      waiverType: sample.waiverType,
      amount: sample.amount,
      jobLocation: `${baseData.jobLocation}, ${sample.state}`,
      complianceDisclaimer: compliance.disclaimerText_en || undefined,
      requiresNotarization: compliance.requiresNotarization || undefined,
      isPublicProject: sample.isPublicProject || undefined,
    }

    try {
      const doc = sample.template(data)
      const buffer = await renderToBuffer(doc)
      const filename = `${OUTPUT_DIR}/${sample.label}.pdf`
      writeFileSync(filename, buffer)
      console.log(`  [OK] ${sample.label}.pdf (${(buffer.length / 1024).toFixed(1)} KB)`)
      console.log(`       State: ${sample.state} | Type: ${sample.waiverType} | $${sample.amount.toLocaleString()}`)
      console.log(`       Compliance: ${compliance.status} | Notarization: ${compliance.requiresNotarization ? 'YES' : 'no'}`)
      if (compliance.disclaimerText_en) console.log(`       Disclaimer: INCLUDED`)
      if (sample.isPublicProject) console.log(`       Public Project: YES`)
      console.log()
    } catch (err) {
      console.error(`  [FAIL] ${sample.label}: ${err}`)
      console.log()
    }
  }

  console.log(`Done! ${samples.length} PDFs saved to ${OUTPUT_DIR}/`)
}

generateAll().catch(console.error)
