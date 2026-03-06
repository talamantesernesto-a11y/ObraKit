import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

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
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  notice: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginTop: 15,
    marginBottom: 5,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    width: 150,
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
    marginBottom: 10,
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
    fontSize: 9,
    textAlign: 'center',
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
  },
  statuteRef: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
})

export function CaliforniaWaiver(data: WaiverPdfData) {
  const waiverType = WAIVER_TYPES[data.waiverType as keyof typeof WAIVER_TYPES]
  const noticeText = STATE_RULES.CA.warningText[data.waiverType as keyof typeof STATE_RULES.CA.warningText] || ''

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  const isConditional = data.waiverType.includes('conditional')
  const isProgress = data.waiverType.includes('progress')

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{waiverType.name_en}</Text>
        <Text style={styles.statuteRef}>{STATE_RULES.CA.statuteReference}</Text>

        {/* NOTICE - must be at least as large as largest type */}
        <View style={styles.notice}>
          <Text>{noticeText}</Text>
        </View>

        {/* Identifying Information */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Claimant:</Text>
          <Text style={styles.fieldValue}>{data.claimantName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Customer:</Text>
          <Text style={styles.fieldValue}>{data.customerName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Job Location:</Text>
          <Text style={styles.fieldValue}>{data.jobLocation}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Owner:</Text>
          <Text style={styles.fieldValue}>{data.ownerName}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Through Date:</Text>
          <Text style={styles.fieldValue}>{data.throughDate}</Text>
        </View>

        {/* Conditional specific fields */}
        {isConditional && data.checkMaker && (
          <>
            <Text style={styles.sectionTitle}>
              {isProgress
                ? 'This document waives and releases lien, stop payment notice, and payment bond rights through the Through Date of this document but only to the extent of payment received, conditioned on receipt of the following check:'
                : 'This document waives and releases lien, stop payment notice, and payment bond rights conditioned on receipt of the following final payment:'}
            </Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Maker of Check:</Text>
              <Text style={styles.fieldValue}>{data.checkMaker}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Amount of Check:</Text>
              <Text style={styles.fieldValue}>{amountFormatted}</Text>
            </View>
          </>
        )}

        {/* Unconditional specific */}
        {!isConditional && (
          <Text style={styles.paragraph}>
            {isProgress
              ? `The claimant has been paid and has received a progress payment in the sum of ${amountFormatted} for labor, services, equipment, or material furnished to the jobsite identified above, and gives up any right to a mechanic's lien, stop payment notice, and any right to make a claim against a labor and material bond on the job to the extent of the amount paid.`
              : `The claimant has been paid in full for all labor, services, equipment, or material furnished to the jobsite identified above and gives up any right to a mechanic's lien, stop payment notice, and any right to make a claim against a labor and material bond on the job.`}
          </Text>
        )}

        {/* Exceptions */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Exceptions:</Text>
          <Text style={styles.fieldValue}>{data.exceptions || 'None'}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {data.signatureImage && (
                <Image src={data.signatureImage} style={{ width: 150, height: 25, objectFit: 'contain' }} />
              )}
            </View>
            <Text style={styles.signatureLabel}>Claimant&apos;s Signature</Text>
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
            <Text style={styles.fieldLabel}>Claimant&apos;s Title:</Text>
            <Text style={styles.fieldValue}>{data.signatureImage ? data.claimantName : ' '}</Text>
          </View>
        </View>

        {data.showWatermark !== false && (
          <Text style={styles.footer}>Generated by ObraKit.ai</Text>
        )}
      </Page>
    </Document>
  )
}
