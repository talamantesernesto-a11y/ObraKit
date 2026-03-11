import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12, // Georgia requires at least 12pt
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  statuteRef: {
    fontSize: 9,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  notice: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
    lineHeight: 1.4,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    width: 180,
  },
  fieldValue: {
    fontSize: 12,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
    minHeight: 16,
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 1.5,
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
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
})

export function GeorgiaWaiver(data: WaiverPdfData) {
  // Georgia has 2 form categories: Interim (progress) and Final
  // Both can be conditional (upon payment) or unconditional (upon final payment)
  const isFinal = data.waiverType.includes('final')
  const noticeText = STATE_RULES.GA.warningText[data.waiverType as keyof typeof STATE_RULES.GA.warningText] || ''

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>
          {isFinal ? 'FINAL WAIVER AND RELEASE' : 'INTERIM WAIVER AND RELEASE'}
        </Text>
        <Text style={styles.subtitle}>
          {isFinal ? 'UPON FINAL PAYMENT' : 'UPON PAYMENT'}
        </Text>
        <Text style={styles.statuteRef}>{STATE_RULES.GA.statuteReference}</Text>

        {/* NOTICE — moved BEFORE body text per Georgia statutory form structure */}
        {noticeText && (
          <View style={styles.notice}>
            <Text>{noticeText}</Text>
          </View>
        )}

        {/* Property / Project Info */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Property Description:</Text>
          <Text style={styles.fieldValue}>{data.jobLocation}</Text>
        </View>

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

        {/* Body */}
        {!isFinal ? (
          <Text style={styles.paragraph}>
            Upon receipt of the sum of {amountFormatted}, the undersigned waives and releases any and all liens and claims of liens upon the foregoing described property and any rights regarding any labor or material bond regarding the said property through the date shown above to the extent of {amountFormatted}.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            The undersigned has been paid in full for all labor, services, equipment, or material furnished to the property described above and hereby waives and releases any and all liens and claims of liens upon the foregoing described property and any rights regarding any labor or material bond regarding the said property.
          </Text>
        )}

        {/* Exceptions */}
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
            <Text style={styles.signatureLabel}>Signature</Text>
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

        {/* No footer on GA statutory forms — adding non-statutory text can void the waiver */}
      </Page>
    </Document>
  )
}
