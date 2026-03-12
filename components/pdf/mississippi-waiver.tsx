import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// Mississippi Miss. Code § 85-7-405
// Statutory waiver forms: Conditional/Unconditional × Interim/Final.
// Must substantially comply with statutory form.
// Notary recommended but not required.
// Advance waivers void.
// Requires confirmation under current Mississippi law.

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
  const isProgress = data.waiverType.includes('progress')
  const isConditional = data.waiverType.includes('conditional')

  const amountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.amount)

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Mississippi uses Interim/Final terminology */}
        <Text style={styles.title}>
          {isFinal ? 'FINAL WAIVER AND RELEASE' : 'INTERIM WAIVER AND RELEASE'}
        </Text>
        <Text style={styles.subtitle}>
          {isConditional ? 'CONDITIONAL — UPON PAYMENT' : 'UNCONDITIONAL'}
        </Text>
        <Text style={styles.statuteRef}>{STATE_RULES.MS.statuteReference}</Text>

        {/* Identifying fields — per Miss. Code § 85-7-405 statutory form structure */}
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

        {/* Body language — tracks Miss. Code § 85-7-405 statutory forms */}
        {/* Requires confirmation under current Mississippi law */}

        {isConditional && isProgress && (
          <Text style={styles.paragraph}>
            Upon receipt of the sum of {amountFormatted}, the undersigned waives and releases any and all liens or claims of liens upon the foregoing described property and any rights against any labor or material bond on the said property, to the extent of {amountFormatted}, for labor, services, equipment, or materials furnished through {data.throughDate} to the property or to {data.customerName}. This waiver and release is conditioned on receipt of payment. This waiver and release does not cover any retention, pending modifications, or changes, or items furnished after the date specified above.
          </Text>
        )}

        {isConditional && isFinal && (
          <Text style={styles.paragraph}>
            Upon receipt of the sum of {amountFormatted} as final payment, the undersigned waives and releases any and all liens or claims of liens upon the foregoing described property and any rights against any labor or material bond on the said property, for all labor, services, equipment, or materials furnished to the property or to {data.customerName}. This waiver and release is conditioned on receipt of final payment. This waiver and release covers all amounts due under the contract, including all pending modifications and changes.
          </Text>
        )}

        {!isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              The undersigned has been paid and has received a progress payment in the sum of {amountFormatted} for labor, services, equipment, or materials furnished to the foregoing described property or to {data.customerName} and does hereby waive and release any and all liens or claims of liens upon the foregoing described property and any rights against any labor or material bond on the said property, to the extent of {amountFormatted}, for labor, services, equipment, or materials furnished through {data.throughDate}. This waiver and release does not cover any retention, pending modifications, or changes, or items furnished after the date specified above.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
              </Text>
            </View>
          </>
        )}

        {!isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              The undersigned has been paid in full for all labor, services, equipment, or materials furnished to the foregoing described property or to {data.customerName} and does hereby waive and release any and all liens or claims of liens upon the foregoing described property and any rights against any labor or material bond on the said property. This waiver and release covers all amounts due under the contract, including all pending modifications and changes.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                WARNING: THIS DOCUMENT WAIVES AND RELEASES LIEN AND PAYMENT BOND RIGHTS UNCONDITIONALLY AND STATES THAT YOU HAVE BEEN PAID FOR GIVING UP THOSE RIGHTS. THIS DOCUMENT IS ENFORCEABLE AGAINST YOU IF YOU SIGN IT, EVEN IF YOU HAVE NOT BEEN PAID. IF YOU HAVE NOT BEEN PAID, USE A CONDITIONAL WAIVER AND RELEASE FORM.
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
      </Page>
    </Document>
  )
}
