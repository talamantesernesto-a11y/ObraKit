import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// TODO: Insert statutory language from counsel per Tex. Prop. Code § 53.284
// Texas requires:
// - Substantially comply with statutory forms (§ 53.284)
// - Notarization (affidavit format)
// - No advance waivers (void if signed before work/payment)
// - Monthly notice requirements for non-original contractors interact with waiver validity

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Helvetica-Bold',
  },
  statuteRef: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  affidavitHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    width: 160,
  },
  fieldValue: {
    fontSize: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    minHeight: 14,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 12,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  signatureArea: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
    height: 30,
  },
  signatureLabel: {
    fontSize: 9,
    textAlign: 'center',
    color: '#666',
  },
  notarySection: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  notaryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  notaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 8,
  },
})

export function TexasWaiver(data: WaiverPdfData) {
  const waiverType = WAIVER_TYPES[data.waiverType as keyof typeof WAIVER_TYPES]
  const isConditional = data.waiverType.includes('conditional')
  const isFinal = data.waiverType.includes('final')

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{waiverType.name_en}</Text>
        <Text style={styles.subtitle}>AFFIDAVIT</Text>
        <Text style={styles.statuteRef}>{STATE_RULES.TX.statuteReference}</Text>

        {/* Affidavit preamble */}
        <Text style={styles.affidavitHeader}>
          STATE OF TEXAS, COUNTY OF {(data.county || '_______________').toUpperCase()}
        </Text>

        <Text style={styles.paragraph}>
          BEFORE ME, the undersigned authority, on this day personally appeared {data.claimantName} (Affiant), who, being duly sworn, stated under oath:
        </Text>

        {/* Project identification */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Job Location:</Text>
          <Text style={styles.fieldValue}>{data.jobLocation}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Owner:</Text>
          <Text style={styles.fieldValue}>{data.ownerName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Original Contractor:</Text>
          <Text style={styles.fieldValue}>{data.customerName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Through Date:</Text>
          <Text style={styles.fieldValue}>{data.throughDate}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Amount:</Text>
          <Text style={styles.fieldValue}>{amountFormatted}</Text>
        </View>

        {/* TODO: Replace with statutory language from counsel */}
        <Text style={styles.paragraph}>
          {isConditional
            ? `Affiant states that upon receipt of ${amountFormatted} from ${data.checkMaker || data.customerName}, and when the payment has been properly made, Affiant waives and releases any lien right or claim of lien on the above-described property ${isFinal ? 'for the full and final payment' : `through ${data.throughDate}`}.`
            : `Affiant states that Affiant has received payment in the amount of ${amountFormatted} ${isFinal ? 'as full and final payment for all labor, services, equipment, or materials furnished to the above-described property' : `for labor, services, equipment, or materials furnished to the above-described property through ${data.throughDate}`} and hereby waives and releases any lien right or claim of lien on the above-described property.`}
        </Text>

        {data.exceptions && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Exceptions:</Text>
            <Text style={styles.fieldValue}>{data.exceptions}</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {data.signatureImage && (
                <Image src={data.signatureImage} style={{ width: 150, height: 25, objectFit: 'contain' }} />
              )}
            </View>
            <Text style={styles.signatureLabel}>Affiant Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              {data.signatureImage && (
                <Text style={{ fontSize: 10, paddingTop: 10 }}>{data.signatureDate}</Text>
              )}
            </View>
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Printed Name:</Text>
            <Text style={styles.fieldValue}>{data.signatureImage ? data.claimantName : ' '}</Text>
          </View>
        </View>

        {/* Notary Block — required for TX */}
        <View style={styles.notarySection}>
          <Text style={styles.notaryTitle}>NOTARY ACKNOWLEDGMENT</Text>
          <Text style={styles.notaryText}>
            SUBSCRIBED AND SWORN TO BEFORE ME on this _____ day of _____________, 20___, by {data.claimantName || '________________________'}, proved to me through government-issued photo identification.
          </Text>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '45%' }}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', height: 30, marginBottom: 5 }} />
              <Text style={styles.signatureLabel}>Notary Public, State of Texas</Text>
            </View>
            <View style={{ width: '45%' }}>
              <View style={{ borderWidth: 1, borderColor: '#000', height: 60, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 8, color: '#999' }}>[NOTARY SEAL]</Text>
              </View>
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={{ fontSize: 9, width: 120 }}>Commission Expires:</Text>
            <Text style={{ fontSize: 9, flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', minHeight: 12 }}> </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
