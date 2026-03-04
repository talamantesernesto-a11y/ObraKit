import { renderToBuffer } from '@react-pdf/renderer'
import { CaliforniaWaiver } from '@/components/pdf/california-waiver'
import { GeorgiaWaiver } from '@/components/pdf/georgia-waiver'
import { GenericWaiver } from '@/components/pdf/generic-waiver'

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
}

export async function generateWaiverPdf(data: WaiverPdfData): Promise<Buffer> {
  const state = data.state.toUpperCase()

  let document
  if (state === 'CA') {
    document = CaliforniaWaiver(data)
  } else if (state === 'GA') {
    document = GeorgiaWaiver(data)
  } else {
    document = GenericWaiver(data)
  }

  return await renderToBuffer(document)
}
