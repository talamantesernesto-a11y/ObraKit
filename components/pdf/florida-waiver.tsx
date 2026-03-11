import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { STATE_RULES } from '@/lib/waivers/state-rules'
import { WAIVER_TYPES } from '@/lib/waivers/types'
import type { WaiverPdfData } from '@/lib/waivers/generate-pdf'

// Florida SB 658 (effective July 1, 2025) requires forms IDENTICAL to
// Fla. Stat. § 713.20(4) (progress) and § 713.20(5) (final).
// Body language below tracks the statutory forms.
// Requires confirmation under current Florida law.

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
    marginBottom: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  warningText: {
    fontSize: 10,
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

export function FloridaWaiver(data: WaiverPdfData) {
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
        <Text style={styles.statuteRef}>{STATE_RULES.FL.statuteReference}</Text>

        {/* Identifying fields — per § 713.20 statutory form structure */}
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Lienor&apos;s Name:</Text>
          <Text style={styles.fieldValue}>{data.claimantName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Lienor&apos;s Address:</Text>
          <Text style={styles.fieldValue}>{data.claimantAddress}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Owner:</Text>
          <Text style={styles.fieldValue}>{data.ownerName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Name of Contractor:</Text>
          <Text style={styles.fieldValue}>{data.customerName}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Description of Property:</Text>
          <Text style={styles.fieldValue}>{data.jobLocation}</Text>
        </View>
        {data.county && (
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>County:</Text>
            <Text style={styles.fieldValue}>{data.county}</Text>
          </View>
        )}

        {/* Body language — tracks Fla. Stat. § 713.20(4) and (5) */}
        {/* Requires confirmation under current Florida law (SB 658 identical-form standard) */}

        {isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              The undersigned lienor, in consideration of the sum of {amountFormatted}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished through {data.throughDate} to:
            </Text>
            <Text style={styles.paragraph}>
              The above-described property, owned by {data.ownerName}, to the extent of the amount of {amountFormatted}.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This waiver and release is conditioned on payment. This waiver and release is not effective unless and until the lienor receives payment of the amount stated above. This waiver and release does not cover any retention or amounts arising out of change orders, extras, or other items furnished after the date specified above.
              </Text>
            </View>
          </>
        )}

        {isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              The undersigned lienor, in consideration of the final payment in the sum of {amountFormatted}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished to:
            </Text>
            <Text style={styles.paragraph}>
              The above-described property, owned by {data.ownerName}.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This waiver and release is conditioned on payment of the amount stated above. This waiver and release is not effective unless and until the lienor receives final payment. Upon receipt of the final payment, this waiver and release shall become effective to cover all labor, services, or materials furnished to the above-described property and shall cover all amounts due to the undersigned under the contract.
              </Text>
            </View>
          </>
        )}

        {!isConditional && isProgress && (
          <>
            <Text style={styles.paragraph}>
              The undersigned lienor, upon receipt of the sum of {amountFormatted}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished through {data.throughDate} to:
            </Text>
            <Text style={styles.paragraph}>
              The above-described property, owned by {data.ownerName}, to the extent of the amount of {amountFormatted}.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This waiver and release is unconditional and effective upon execution, even if the lienor has not received actual payment. The lienor represents that it has received the above-stated payment. This waiver and release does not cover any retention or amounts arising out of change orders, extras, or other items furnished after the date specified above.
              </Text>
            </View>
          </>
        )}

        {!isConditional && isFinal && (
          <>
            <Text style={styles.paragraph}>
              The undersigned lienor, upon receipt of the final payment in the sum of {amountFormatted}, hereby waives and releases its lien and right to claim a lien for labor, services, or materials furnished to:
            </Text>
            <Text style={styles.paragraph}>
              The above-described property, owned by {data.ownerName}.
            </Text>
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                This waiver and release is unconditional and effective upon execution, even if the lienor has not received actual payment. The lienor represents that it has received final payment in full for all labor, services, or materials furnished to the above-described property. This waiver and release covers all amounts due to the undersigned under the contract, including all pending modifications and changes.
              </Text>
            </View>
          </>
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
            <Text style={styles.signatureLabel}>Lienor Signature</Text>
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

        {/* Notary Block — required for FL per § 713.20 */}
        <View style={styles.notarySection}>
          <Text style={styles.notaryTitle}>NOTARY ACKNOWLEDGMENT</Text>
          <Text style={styles.notaryText}>
            State of Florida, County of {data.county || '_______________'}
          </Text>
          <Text style={styles.notaryText}>
            The foregoing instrument was acknowledged before me by means of ( ) physical presence or ( ) online notarization this _____ day of _____________, 20___, by {data.claimantName || '________________________'}, who is personally known to me or who has produced ________________________ as identification.
          </Text>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '45%' }}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', height: 30, marginBottom: 5 }} />
              <Text style={styles.signatureLabel}>Notary Public, State of Florida</Text>
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
