export interface SupplierNotificationItem {
  titleSnapshot: string;
  skuSnapshot: string;
  quantity: number;
  priceSnapshot: number;
}

export interface SupplierNotificationData {
  subOrderId: string;
  orderId: string;
  supplierName: string;
  buyerName: string;
  buyerCompany?: string;
  items: SupplierNotificationItem[];
  subOrderTotal: number;
  createdAt: Date;
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const supplierNotificationTemplate = (
  data: SupplierNotificationData,
) => {
  const orderDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const subOrderId = data.subOrderId.slice(0, 8).toUpperCase();
  const orderId = data.orderId.slice(0, 8).toUpperCase();
  const buyerInfo = data.buyerCompany
    ? `${data.buyerName} (${data.buyerCompany})`
    : data.buyerName;

  const itemRows = data.items
    .map(
      item => `
        <tr>
          <td style="padding: 10px 12px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
            ${item.titleSnapshot}
            <br/><span style="font-size: 11px; color: #94a3b8;">SKU: ${item.skuSnapshot}</span>
          </td>
          <td style="padding: 10px 12px; font-size: 14px; color: #64748b; text-align: center; border-bottom: 1px solid #f1f5f9;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 12px; font-size: 14px; color: #64748b; text-align: right; border-bottom: 1px solid #f1f5f9;">
            ${formatCurrency(item.priceSnapshot)}
          </td>
          <td style="padding: 10px 12px; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right; border-bottom: 1px solid #f1f5f9;">
            ${formatCurrency(item.quantity * item.priceSnapshot)}
          </td>
        </tr>`,
    )
    .join('');

  return {
    subject: `New Order Received — #${subOrderId} | Gyp6.sale`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Order Received</title>
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
                    <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                      New Order Received
                    </h1>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #64748b; line-height: 1.6;">
                      Hi ${data.supplierName}, you have received a new order.
                    </p>

                    <!-- Order info box -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size: 12px; font-weight: 600; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; padding-bottom: 4px;">Sub-Order</td>
                              <td style="font-size: 12px; font-weight: 600; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; text-align: right; padding-bottom: 4px;">Date</td>
                            </tr>
                            <tr>
                              <td style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">#${subOrderId}</td>
                              <td style="font-size: 14px; color: #64748b; text-align: right;">${orderDate}</td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 12px; font-size: 13px; color: #64748b;">
                                <strong style="color: #0f172a;">From:</strong> ${buyerInfo}
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" style="padding-top: 4px; font-size: 12px; color: #94a3b8;">
                                Parent Order: #${orderId}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Items table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-collapse: collapse;">
                      <tr style="background-color: #f8fafc;">
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase;">Product</td>
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; text-align: center;">Qty</td>
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; text-align: right;">Unit Price</td>
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; text-align: right;">Total</td>
                      </tr>
                      ${itemRows}
                    </table>

                    <!-- Sub-order total -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 2px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 12px 0; font-size: 18px; font-weight: 800; color: #0f172a;">Sub-Order Total</td>
                        <td style="padding: 12px 0; font-size: 18px; font-weight: 800; color: #0f172a; text-align: right;">${formatCurrency(data.subOrderTotal)}</td>
                      </tr>
                    </table>

                    <p style="margin: 32px 0 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                      Please log in to your dashboard to confirm or manage this order.
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
                      &copy; ${new Date().getFullYear()} Gyp6.sale &middot; Furniture Wholesale Platform<br/>
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
  };
};
