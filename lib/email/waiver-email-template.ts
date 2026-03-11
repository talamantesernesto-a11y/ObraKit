interface WaiverEmailTemplateParams {
  claimantName: string
  gcName: string
  projectName: string
  waiverTypeName: string
  amount: string
  throughDate: string
}

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function generateWaiverEmailHtml(params: WaiverEmailTemplateParams): string {
  const claimantName = escapeHtml(params.claimantName)
  const gcName = escapeHtml(params.gcName)
  const projectName = escapeHtml(params.projectName)
  const waiverTypeName = escapeHtml(params.waiverTypeName)
  const amount = escapeHtml(params.amount)
  const throughDate = escapeHtml(params.throughDate)

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#F5F4F2;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;">
    <!-- Header -->
    <tr>
      <td style="background-color:#1B2A4A;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;">ObraKit</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:32px;">
        <!-- Spanish -->
        <p style="margin:0 0 16px;font-size:15px;color:#1B2A4A;">
          Estimado/a <strong>${gcName}</strong>,
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#333;">
          <strong>${claimantName}</strong> le envía un waiver adjunto para su revisión.
        </p>

        <!-- Details card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F4F2;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Proyecto / Project</td>
                <td style="padding:4px 0;font-size:13px;color:#1B2A4A;text-align:right;font-weight:bold;">${projectName}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Tipo / Type</td>
                <td style="padding:4px 0;font-size:13px;color:#1B2A4A;text-align:right;font-weight:bold;">${waiverTypeName}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Monto / Amount</td>
                <td style="padding:4px 0;font-size:13px;color:#1B2A4A;text-align:right;font-weight:bold;">${amount}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Fecha Hasta / Through Date</td>
                <td style="padding:4px 0;font-size:13px;color:#1B2A4A;text-align:right;font-weight:bold;">${throughDate}</td>
              </tr>
            </table>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:14px;color:#333;">
          El waiver está adjunto como PDF. / The waiver is attached as a PDF.
        </p>

        <hr style="border:none;border-top:1px solid #E8E6E3;margin:24px 0;" />

        <!-- English -->
        <p style="margin:0 0 16px;font-size:15px;color:#1B2A4A;">
          Dear <strong>${gcName}</strong>,
        </p>
        <p style="margin:0 0 16px;font-size:15px;color:#333;">
          <strong>${claimantName}</strong> has sent you a lien waiver for your review. Please find the PDF attached to this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#F5F4F2;padding:16px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#999;">
          Sent via ObraKit.ai
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`
}
