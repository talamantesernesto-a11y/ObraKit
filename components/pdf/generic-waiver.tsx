import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
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
            Upon receipt of a check from {data.checkMaker || 'the customer'} in the sum of {amountFormatted}, payable to {data.claimantName}, and when the check has been properly endorsed and has been paid by the bank on which it is drawn, {data.claimantName} waives and releases any mechanic&apos;s lien, stop payment notice, or bond right claims through {data.throughDate} {isFinal ? 'for the full and final payment' : 'for work performed through the date stated above'} on the project located at {data.jobLocation}.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            The undersigned, {data.claimantName}, has been paid and has received {isFinal ? 'final payment in full' : `a progress payment in the sum of ${amountFormatted}`} for labor, services, equipment, or materials furnished to the project located at {data.jobLocation}. The undersigned hereby unconditionally waives and releases any and all mechanic&apos;s lien, stop payment notice, or bond right claims {isFinal ? 'for all work performed on the project' : `through ${data.throughDate}`}.
          </Text>
        )}

        {/* Unconditional warning */}
        {!isConditional && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              WARNING: This document waives rights unconditionally and is enforceable upon signing, even if payment has not been received. Only sign this document if you have confirmed receipt of payment.
            </Text>
          </View>
        )}

        {/* Exceptions */}
        <Text style={styles.sectionTitle}>EXCEPTIONS</Text>
        <Text style={styles.paragraph}>
          {data.exceptions || 'None.'}
        </Text>

        {/* Signature */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Printed Name:</Text>
            <Text style={{ ...styles.fieldValue, borderBottomWidth: 1, borderBottomColor: '#000' }}> </Text>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Title:</Text>
            <Text style={{ ...styles.fieldValue, borderBottomWidth: 1, borderBottomColor: '#000' }}> </Text>
          </View>
        </View>

        <Text style={styles.footer}>Generated by ObraKit.ai</Text>
      </Page>
    </Document>
  )
}
