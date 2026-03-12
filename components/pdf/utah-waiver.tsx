import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// Utah Code § 38-1a-802
// 4 standard waiver types: Conditional/Unconditional × Progress/Final.
// State Construction Registry (SCR) filing may interact with waiver requirements.
// Advance waivers restricted.
// No notarization required.
// Requires confirmation under current Utah law.

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
  warningBox: {
    marginTop: 10,
    marginBottom: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  warningText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.4,
  },
  noteBox: {
    marginTop: 20,
    padding: 8,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  noteText: {
    fontSize: 8,
    color: '#0369A1',
    lineHeight: 1.4,
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

export function UtahWaiver(data: WaiverPdfData) {
  const waiverType = WAIVER_TYPES[data.waiverType as keyof typeof WAIVER_TYPES]
  const isConditional = data.waiverType.includes('conditional')
  const isFinal = data.waiverType.includes('final')
  const isProgress = data.waiverType.includes('progress')

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{waiverType.name_en}</Text>
        <Text style={styles.statuteRef}>{STATE_RULES.UT.statuteReference}</Text>

        {/* Identifying fields — per Utah Code § 38-1a-802 statutory form structure */}
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
          <Text style={styles.fieldLabel}>Through Date:</Text>
          <Text style={styles.fieldValue}>{data.throughDate}</Text>
        </View>

        {/* Body language — tracks Utah Code § 38-1a-802 statutory forms */}
        {/* Requires confirmation under current Utah law */}

        {isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              Upon receipt of a check from {data.checkMaker || '________________________'} in the sum of {amountFormatted} payable to {data.claimantName} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document shall become effective to release any mechanic&apos;s lien, any preliminary notice, any pre-lien notice, and any payment bond right the claimant has on the job of {data.ownerName} located at {data.jobLocation} to the following extent:
            </Text>
            <Text style={styles.paragraph}>
              This document covers a progress payment for labor, services, equipment, or material furnished to the jobsite through {data.throughDate} only and does not cover any retention, pending modifications, or changes, or items furnished after that date.
            </Text>
          </>
        )}

        {isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              Upon receipt of a check from {data.checkMaker || '________________________'} in the sum of {amountFormatted} payable to {data.claimantName} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document shall become effective to release any mechanic&apos;s lien, any preliminary notice, any pre-lien notice, and any payment bond right the claimant has on the job of {data.ownerName} located at {data.jobLocation} to the following extent:
            </Text>
            <Text style={styles.paragraph}>
              This document covers the final payment to the claimant for all labor, services, equipment, or material furnished to the jobsite. This document covers all amounts due to the claimant under the contract, including all pending modifications and changes.
            </Text>
          </>
        )}

        {!isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              The claimant, {data.claimantName}, has been paid and has received a progress payment in the sum of {amountFormatted} for labor, services, equipment, or material furnished to {data.ownerName}&apos;s job located at {data.jobLocation} and does hereby waive and release any right to a mechanic&apos;s lien, any right to file or maintain a preliminary notice, any pre-lien notice, and any right to make a claim against a payment bond on the job to the extent of the amount paid. This document covers a progress payment for labor, services, equipment, or material furnished to the jobsite through {data.throughDate} only and does not cover any retention, pending modifications, or changes, or items furnished after that date.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN, PRELIMINARY NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
              </Text>
            </View>
          </>
        )}

        {!isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              The claimant, {data.claimantName}, has been paid in full for all labor, services, equipment, or material furnished to {data.ownerName}&apos;s job located at {data.jobLocation} and does hereby waive and release any right to a mechanic&apos;s lien, any right to file or maintain a preliminary notice, any pre-lien notice, and any right to make a claim against a payment bond on the job. This document covers the final payment to the claimant for all labor, services, equipment, or material furnished to the jobsite. This document covers all amounts due to the claimant under the contract, including all pending modifications and changes.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN, PRELIMINARY NOTICE, AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
              </Text>
            </View>
          </>
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
            <Text style={styles.fieldLabel}>Printed Name:</Text>
            <Text style={styles.fieldValue}>{data.signatureImage ? data.claimantName : ' '}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Title:</Text>
            <Text style={styles.fieldValue}> </Text>
          </View>
        </View>

        {/* Utah State Construction Registry note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            NOTE: Utah State Construction Registry (SCR) filing requirements may interact with lien waiver validity. Verify your SCR filing status at designbuild.utah.gov.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
