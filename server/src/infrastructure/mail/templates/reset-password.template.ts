export const resetPasswordTemplate = (url: string) => ({
  subject: 'Reset Your Password — Gyp6.sale',
  html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
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
                      Reset your password
                    </h1>
                    <p style="margin: 0 0 32px; font-size: 15px; color: #64748b; line-height: 1.6;">
                      We received a request to reset the password for your account.
                      Click the button below to choose a new password.
                      The link is valid for <strong>1 hour</strong>.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                      <tr>
                        <td align="center" style="background-color: #0f172a; border-radius: 8px;">
                          <a href="${url}"
                             style="display: inline-block; padding: 14px 32px; font-size: 15px;
                                    font-weight: 600; color: #ffffff; text-decoration: none;
                                    letter-spacing: -0.2px;">
                            Reset Password →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Fallback URL -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px;">
                          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; color: #94a3b8; text-transform: uppercase;">
                            Or copy this link
                          </p>
                          <p style="margin: 0; font-size: 12px; color: #475569; word-break: break-all; line-height: 1.6; font-family: 'Courier New', monospace;">
                            ${url}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 32px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                      If you did not request a password reset, you can safely ignore this email.
                      Your password will not be changed.
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
