import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// TODO: Insert statutory language from counsel per NRS § 108.2457
// Nevada requires:
// - Mandatory statutory forms
// - Unconditional waivers MUST be notarized (NRS § 108.2457)
// - Conditional waivers do NOT require notarization
// - Advance waivers are void
// - No modifications to statutory form language

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
  statuteRef: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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

export function NevadaWaiver(data: WaiverPdfData) {
  const waiverType = WAIVER_TYPES[data.waiverType as keyof typeof WAIVER_TYPES]
  const isConditional = data.waiverType.includes('conditional')
  const isFinal = data.waiverType.includes('final')
  const needsNotary = !isConditional // NV: only unconditional waivers require notarization

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{waiverType.name_en}</Text>
        <Text style={styles.statuteRef}>{STATE_RULES.NV.statuteReference}</Text>

        {/* Project identification */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Job Location:</Text>
          <Text style={styles.fieldValue}>{data.jobLocation}</Text>
        </View>
        {data.county && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>County:</Text>
            <Text style={styles.fieldValue}>{data.county}</Text>
          </View>
        )}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Owner:</Text>
          <Text style={styles.fieldValue}>{data.ownerName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Claimant:</Text>
          <Text style={styles.fieldValue}>{data.claimantName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Contractor:</Text>
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

        {/* TODO: Replace with statutory language from NRS § 108.2457 */}
        <Text style={styles.paragraph}>
          {isConditional
            ? `Upon receipt of payment in the sum of ${amountFormatted}, the undersigned hereby waives and releases its lien and right to claim a lien for labor, materials, equipment, or services furnished to the above-described property through ${data.throughDate}. This waiver is conditioned on actual receipt of payment in good funds.`
            : `The undersigned hereby certifies that it has received ${isFinal ? 'final payment in full' : `payment in the sum of ${amountFormatted}`} for all labor, materials, equipment, or services furnished to the above-described property ${isFinal ? '' : `through ${data.throughDate}`} and hereby unconditionally waives and releases its lien and right to claim a lien for labor, materials, equipment, or services furnished to the above-described property.`}
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
            <Text style={styles.signatureLabel}>Claimant Signature</Text>
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

        <View style={{ marginTop: 15 }}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Printed Name:</Text>
            <Text style={styles.fieldValue}>{data.signatureImage ? data.claimantName : ' '}</Text>
          </View>
        </View>

        {/* Notary Block — required for NV unconditional waivers only */}
        {needsNotary && (
          <View style={styles.notarySection}>
            <Text style={styles.notaryTitle}>NOTARY ACKNOWLEDGMENT</Text>
            <Text style={styles.notaryText}>
              State of Nevada, County of {data.county || '_______________'}
            </Text>
            <Text style={styles.notaryText}>
              On this _____ day of _____________, 20___, before me, the undersigned notary public, personally appeared {data.claimantName || '________________________'}, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity.
            </Text>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '45%' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', height: 30, marginBottom: 5 }} />
                <Text style={styles.signatureLabel}>Notary Public, State of Nevada</Text>
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
        )}
      </Page>
    </Document>
  )
}
