import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  letterhead: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1B2A4A',
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1B2A4A',
  },
  companyAddress: {
    fontSize: 9,
    color: '#666',
    marginTop: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#1B2A4A',
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1B2A4A',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E6E3',
    paddingBottom: 3,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    width: 160,
    color: '#333',
  },
  fieldValue: {
    fontSize: 10,
    flex: 1,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 12,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  warningBox: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#E8702A',
  },
  warningText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#C55A1A',
  },
  disclaimerBox: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  disclaimerText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#991B1B',
    lineHeight: 1.4,
  },
  publicProjectBox: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  publicProjectText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1E40AF',
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
  notarySection: {
    marginTop: 40,
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
  notaryFieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  notaryFieldLabel: {
    fontSize: 9,
    width: 120,
  },
  notaryFieldValue: {
    fontSize: 9,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 12,
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
})

export function GenericWaiver(data: WaiverPdfData) {
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
        {/* Compliance Disclaimer — shown for statutory states using generic template */}
        {data.complianceDisclaimer && (
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>{data.complianceDisclaimer}</Text>
          </View>
        )}

        {/* Letterhead */}
        <View style={styles.letterhead}>
          <Text style={styles.companyName}>{data.claimantName}</Text>
          <Text style={styles.companyAddress}>{data.claimantAddress}</Text>
        </View>

        <Text style={styles.title}>{waiverType.name_en}</Text>

        {/* Project Identification */}
        <Text style={styles.sectionTitle}>PROJECT IDENTIFICATION</Text>
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
          <Text style={styles.fieldLabel}>Property Owner:</Text>
          <Text style={styles.fieldValue}>{data.ownerName}</Text>
        </View>

        {/* Parties */}
        <Text style={styles.sectionTitle}>PARTIES</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Claimant (Subcontractor):</Text>
          <Text style={styles.fieldValue}>{data.claimantName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Customer (General Contractor):</Text>
          <Text style={styles.fieldValue}>{data.customerName}</Text>
        </View>

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>PAYMENT DETAILS</Text>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Amount:</Text>
          <Text style={styles.fieldValue}>{amountFormatted}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Through Date:</Text>
          <Text style={styles.fieldValue}>{data.throughDate}</Text>
        </View>
        {data.checkMaker && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Check Maker:</Text>
            <Text style={styles.fieldValue}>{data.checkMaker}</Text>
          </View>
        )}

        {/* Waiver Language */}
        <Text style={styles.sectionTitle}>WAIVER AND RELEASE</Text>
        {isConditional ? (
          <Text style={styles.paragraph}>
            Upon receipt of a check from {data.checkMaker || 'the customer'} in the sum of {amountFormatted}, payable to {data.claimantName}, and when the check has been properly endorsed and has been paid by the bank on which it is drawn, {data.claimantName} waives and releases any mechanic&apos;s lien, stop payment notice, or similar statutory lien right {isFinal ? 'for the full and final payment' : 'for work performed through the date stated above'} on the project located at {data.jobLocation}. This waiver and release is conditioned upon actual receipt of payment in good funds and does not waive any rights arising from work performed after the through date stated above.
          </Text>
        ) : (
          <>
            <Text style={styles.paragraph}>
              In consideration of the receipt of payment in the sum of {isFinal ? 'the full contract amount' : amountFormatted}, the undersigned, {data.claimantName}, acknowledges receipt of {isFinal ? 'final payment in full' : `a progress payment in the sum of ${amountFormatted}`} for labor, services, equipment, or materials furnished to the project located at {data.jobLocation}. The undersigned hereby waives and releases any mechanic&apos;s lien, stop payment notice, or similar statutory lien right {isFinal ? 'for all work performed on the project' : `through ${data.throughDate}`}.
            </Text>
          </>
        )}

        {/* Public Project Warning */}
        {data.isPublicProject && (
          <View style={styles.publicProjectBox}>
            <Text style={styles.publicProjectText}>
              PUBLIC PROJECT NOTICE: This project has been identified as a public project. On public projects, mechanics liens generally cannot be filed against government-owned property. Payment protection on public projects is typically provided through payment bonds (Miller Act / state Little Miller Acts). This lien waiver does not waive any payment bond rights. Consult with a licensed attorney regarding your bond rights.
            </Text>
          </View>
        )}

        {/* Unconditional warning */}
        {!isConditional && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              WARNING: This document waives the above-described lien rights unconditionally and is enforceable upon signing, whether or not payment has actually been received. Only sign this document if you have confirmed receipt of payment in good funds.
            </Text>
          </View>
        )}

        {/* Exceptions */}
        <Text style={styles.sectionTitle}>EXCEPTIONS</Text>
        <Text style={styles.paragraph}>
          {data.exceptions || 'None.'}
        </Text>
        <Text style={{ fontSize: 8, color: '#666', marginBottom: 10, lineHeight: 1.4 }}>
          This waiver does not cover disputed amounts, pending change orders not included in the payment amount stated above, or retention not yet due and payable. This waiver releases only mechanic&apos;s lien and stop payment notice rights and does not release any contract claims, warranty obligations, or other rights not expressly stated.
        </Text>

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {data.signatureImage && (
                <Image src={data.signatureImage} style={{ width: 150, height: 25, objectFit: 'contain' }} />
              )}
            </View>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
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

        <View style={{ marginTop: 20 }}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Printed Name:</Text>
            <Text style={{ ...styles.fieldValue, borderBottomWidth: 1, borderBottomColor: '#000' }}>{data.signatureImage ? data.claimantName : ' '}</Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Title:</Text>
            <Text style={{ ...styles.fieldValue, borderBottomWidth: 1, borderBottomColor: '#000' }}> </Text>
          </View>
        </View>

        {/* Notary Block — shown when state requires notarization */}
        {data.requiresNotarization && (
          <View style={styles.notarySection}>
            <Text style={styles.notaryTitle}>NOTARY ACKNOWLEDGMENT</Text>
            <Text style={styles.notaryText}>
              State of _________________ County of _________________
            </Text>
            <Text style={styles.notaryText}>
              On this _____ day of _____________, 20___, before me, the undersigned notary public, personally appeared _________________________, known to me (or proved to me on the basis of satisfactory evidence) to be the person whose name is subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacity, and that by their signature on the instrument the person, or the entity upon behalf of which the person acted, executed the instrument.
            </Text>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '45%' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', height: 30, marginBottom: 5 }} />
                <Text style={styles.signatureLabel}>Notary Public Signature</Text>
              </View>
              <View style={{ width: '45%' }}>
                <View style={{ borderWidth: 1, borderColor: '#000', height: 60, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 8, color: '#999' }}>[NOTARY SEAL]</Text>
                </View>
              </View>
            </View>
            <View style={styles.notaryFieldRow}>
              <Text style={styles.notaryFieldLabel}>Commission Expires:</Text>
              <Text style={styles.notaryFieldValue}> </Text>
            </View>
          </View>
        )}

        {data.showWatermark !== false && (
          <Text style={styles.footer}>Generated by ObraKit.ai</Text>
        )}
      </Page>
    </Document>
  )
}
