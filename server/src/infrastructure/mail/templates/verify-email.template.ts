export const verifyEmailTemplate = (code: string) => ({
  subject: 'Verify Your Email — Gyp6.sale',
  html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #0f172a; padding: 32px 48px;">
                    <p style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">
                      Gyp6.sale
                    </p>
                    <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">
                      Furniture Wholesale Platform
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 48px 48px 32px;">
                    <h1 style="margin: 0 0 12px; font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                      Verify your email
                    </h1>
                    <p style="margin: 0 0 32px; font-size: 15px; color: #64748b; line-height: 1.6;">
                      Use the code below to confirm your email address.
                    </p>

                    <!-- Code block -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 28px;">
                          <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">
                            Verification Code
                          </p>
                          <p style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-family: 'Courier New', monospace;">
                            ${code}
                          </p>
                          <p style="font-size:12px;color:#94a3b8;margin:10px 0 0 0;">
                            Expires in <strong style="color:#64748b;">5 minutes</strong>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 32px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                      If you did not create an account on Gyp6.sale, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding: 0 48px;">
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 48px 32px;">
                    <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
                      © ${new Date().getFullYear()} Gyp6.sale · Furniture Wholesale Platform<br/>
                      This is an automated message, please do not reply.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
});
