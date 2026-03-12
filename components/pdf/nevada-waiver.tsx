import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// Nevada NRS § 108.2457
// Mandatory statutory forms for all 4 waiver types.
// Unconditional waivers MUST be notarized (NRS § 108.2457).
// Conditional waivers do NOT require notarization.
// Advance waivers are void.
// No modifications to statutory form language.
// Requires confirmation under current Nevada law.

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
  const isProgress = data.waiverType.includes('progress')
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

        {/* Identifying fields — per NRS § 108.2457 statutory form structure */}
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

        {/* Body language — tracks NRS § 108.2457 statutory forms */}
        {/* Requires confirmation under current Nevada law */}

        {isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              Upon receipt of a check from {data.checkMaker || '________________________'} in the sum of {amountFormatted} payable to {data.claimantName} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document shall become effective to release any lien, any lien right, any right to make a claim against a surety bond, and any right to make a claim against a lien bond the claimant has on the job of {data.ownerName} located at {data.jobLocation} to the following extent:
            </Text>
            <Text style={styles.paragraph}>
              This document covers a progress payment for labor, materials, equipment, or services furnished to the jobsite through {data.throughDate} only and does not cover any retention, pending modifications, or changes, or items furnished after that date.
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

        {isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              Upon receipt of a check from {data.checkMaker || '________________________'} in the sum of {amountFormatted} payable to {data.claimantName} and when the check has been properly endorsed and has been paid by the bank on which it is drawn, this document shall become effective to release any lien, any lien right, any right to make a claim against a surety bond, and any right to make a claim against a lien bond the claimant has on the job of {data.ownerName} located at {data.jobLocation} to the following extent:
            </Text>
            <Text style={styles.paragraph}>
              This document covers the final payment to the claimant for all labor, materials, equipment, or services furnished to the jobsite. This document covers all amounts due to the claimant under the contract, including all pending modifications and changes.
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

        {!isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              The claimant, {data.claimantName}, has been paid and has received a progress payment in the sum of {amountFormatted} for labor, materials, equipment, or services furnished to {data.ownerName}&apos;s job located at {data.jobLocation} and does hereby waive and release any right to a lien, any lien right, any right to make a claim against a surety bond, and any right to make a claim against a lien bond on the job to the extent of the amount paid. This document covers a progress payment for labor, materials, equipment, or services furnished to the jobsite through {data.throughDate} only and does not cover any retention, pending modifications, or changes, or items furnished after that date.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP NOTICE, SURETY BOND, AND LIEN BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
              </Text>
            </View>
          </>
        )}

        {!isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              The claimant, {data.claimantName}, has been paid in full for all labor, materials, equipment, or services furnished to {data.ownerName}&apos;s job located at {data.jobLocation} and does hereby waive and release any right to a lien, any lien right, any right to make a claim against a surety bond, and any right to make a claim against a lien bond on the job. This document covers the final payment to the claimant for all labor, materials, equipment, or services furnished to the jobsite. This document covers all amounts due to the claimant under the contract, including all pending modifications and changes.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN, STOP NOTICE, SURETY BOND, AND LIEN BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
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
        </View>

        {/* Notary Block — required for NV unconditional waivers only */}
        {needsNotary && (
          <View style={styles.notarySection}>
            <Text style={styles.notaryTitle}>NOTARY ACKNOWLEDGMENT</Text>
            <Text style={styles.notaryText}>
              State of Nevada, County of {data.county || '_______________'}
            </Text>
            <Text style={styles.notaryText}>
              On this _____ day of _____________, 20___, before me, the undersigned notary public, personally appeared {data.claimantName || '________________________'}, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity, and that by their signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.
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
