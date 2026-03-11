import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// TODO: Insert statutory language from counsel per Miss. Code § 85-7-405
// Mississippi requires:
// - Statutory waiver forms (Conditional/Unconditional × Interim/Final)
// - Notary recommended but not required
// - Advance waivers void
// - Must substantially comply with statutory form

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
    marginTop: 50,
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
})

export function MississippiWaiver(data: WaiverPdfData) {
  const isFinal = data.waiverType.includes('final')
  const isConditional = data.waiverType.includes('conditional')

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Mississippi uses Interim/Final terminology like Georgia */}
        <Text style={styles.title}>
          {isFinal ? 'FINAL WAIVER AND RELEASE' : 'INTERIM WAIVER AND RELEASE'}
        </Text>
        <Text style={styles.subtitle}>
          {isConditional ? 'UPON PAYMENT' : 'UNCONDITIONAL'}
        </Text>
        <Text style={styles.statuteRef}>{STATE_RULES.MS.statuteReference}</Text>

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
          <Text style={styles.fieldLabel}>Contractor/Claimant:</Text>
          <Text style={styles.fieldValue}>{data.claimantName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Customer:</Text>
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

        {/* TODO: Replace with statutory language from Miss. Code § 85-7-405 */}
        {isConditional ? (
          <Text style={styles.paragraph}>
            Upon receipt of payment in the sum of {amountFormatted}, the undersigned hereby waives and releases any and all liens and claims of liens upon the above-described property for labor, materials, or services furnished {isFinal ? 'for the full and final payment' : `through ${data.throughDate}`}. This waiver is conditioned on actual receipt of payment in good funds.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            The undersigned has been paid {isFinal ? 'in full for all' : `the sum of ${amountFormatted} for`} labor, materials, or services furnished to the above-described property {isFinal ? '' : `through ${data.throughDate}`} and hereby unconditionally waives and releases any and all liens and claims of liens upon the above-described property.
          </Text>
        )}

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
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Title:</Text>
            <Text style={styles.fieldValue}> </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
