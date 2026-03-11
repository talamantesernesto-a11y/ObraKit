import { renderToBuffer } from '@react-pdf/renderer'
import { ArizonaWaiver } from '@/components/pdf/arizona-waiver'
import { CaliforniaWaiver } from '@/components/pdf/california-waiver'
import { FloridaWaiver } from '@/components/pdf/florida-waiver'
import { GenericWaiver } from '@/components/pdf/generic-waiver'
import { GeorgiaWaiver } from '@/components/pdf/georgia-waiver'
import { MichiganWaiver } from '@/components/pdf/michigan-waiver'
import { MississippiWaiver } from '@/components/pdf/mississippi-waiver'
import { MissouriWaiver } from '@/components/pdf/missouri-waiver'
import { NevadaWaiver } from '@/components/pdf/nevada-waiver'
import { TexasWaiver } from '@/components/pdf/texas-waiver'
import { UtahWaiver } from '@/components/pdf/utah-waiver'
import { WyomingWaiver } from '@/components/pdf/wyoming-waiver'

export type WaiverPdfData = {
  waiverType: string
  state: string
  claimantName: string
  claimantAddress: string
  customerName: string
  jobLocation: string
  ownerName: string
  throughDate: string
  amount: number
  checkMaker?: string
  checkAmount?: number
  exceptions?: string
  signatureDate: string
  signatureImage?: string
  showWatermark?: boolean
  // Compliance fields
  complianceDisclaimer?: string
  requiresNotarization?: boolean
  isPublicProject?: boolean
  county?: string
}

/**
 * Template registry — maps state codes to their specific PDF template.
 * States without a dedicated template fall through to GenericWaiver.
 */
const TEMPLATE_REGISTRY: Record<string, (data: WaiverPdfData) => React.JSX.Element> = {
  AZ: ArizonaWaiver,
  CA: CaliforniaWaiver,
  FL: FloridaWaiver,
  GA: GeorgiaWaiver,
  MI: MichiganWaiver,
  MO: MissouriWaiver,
  MS: MississippiWaiver,
  NV: NevadaWaiver,
  TX: TexasWaiver,
  UT: UtahWaiver,
  WY: WyomingWaiver,
}

export async function generateWaiverPdf(data: WaiverPdfData): Promise<Buffer> {
  const state = data.state.toUpperCase()
  const template = TEMPLATE_REGISTRY[state] || GenericWaiver
  const document = template(data)
  return await renderToBuffer(document)
}
