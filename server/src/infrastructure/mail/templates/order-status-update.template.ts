export interface OrderStatusUpdateData {
  orderId: string;
  subOrderId: string;
  buyerName: string;
  supplierName: string;
  items: Array<{
    titleSnapshot: string;
    skuSnapshot: string;
    quantity: number;
    priceSnapshot: number;
  }>;
  subOrderTotal: number;
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderItemsList(items: OrderStatusUpdateData['items']): string {
  return items
    .map(
      item => `
        <tr>
          <td style="padding: 8px 12px; font-size: 14px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">
            ${item.titleSnapshot}
            <br/><span style="font-size: 11px; color: #94a3b8;">SKU: ${item.skuSnapshot}</span>
          </td>
          <td style="padding: 8px 12px; font-size: 14px; color: #64748b; text-align: center; border-bottom: 1px solid #f1f5f9;">
            ${item.quantity}
          </td>
          <td style="padding: 8px 12px; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right; border-bottom: 1px solid #f1f5f9;">
            ${formatCurrency(item.quantity * item.priceSnapshot)}
          </td>
        </tr>`,
    )
    .join('');
}

function buildEmail(
  title: string,
  headline: string,
  message: string,
  data: OrderStatusUpdateData,
): string {
  const orderId = data.orderId.slice(0, 8).toUpperCase();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

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

                <tr>
                  <td style="padding: 48px 48px 32px;">
                    <h1 style="margin: 0 0 8px; font-size: 26px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                      ${headline}
                    </h1>
                    <p style="margin: 0 0 24px; font-size: 15px; color: #64748b; line-height: 1.6;">
                      ${message}
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="font-size: 12px; font-weight: 600; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; padding-bottom: 4px;">Order</td>
                              <td style="font-size: 12px; font-weight: 600; letter-spacing: 1px; color: #94a3b8; text-transform: uppercase; text-align: right; padding-bottom: 4px;">Supplier</td>
                            </tr>
                            <tr>
                              <td style="font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">#${orderId}</td>
                              <td style="font-size: 14px; color: #64748b; text-align: right;">${data.supplierName}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                      <tr style="background-color: #f8fafc;">
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase;">Product</td>
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; text-align: center;">Qty</td>
                        <td style="padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; text-align: right;">Total</td>
                      </tr>
                      ${renderItemsList(data.items)}
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 2px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 12px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Sub-order Total</td>
                        <td style="padding: 12px 0; font-size: 16px; font-weight: 800; color: #0f172a; text-align: right;">${formatCurrency(data.subOrderTotal)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 0 48px;">
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 0;" />
                  </td>
                </tr>

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
  `;
}

export const orderConfirmedTemplate = (data: OrderStatusUpdateData) => ({
  subject: `Order Confirmed by Supplier — #${data.orderId.slice(0, 8).toUpperCase()} | Gyp6.sale`,
  html: buildEmail(
    'Order Confirmed',
    'Your Order is Being Prepared',
    `Hi ${data.buyerName}, great news! <strong>${data.supplierName}</strong> has confirmed your order and is now assembling it for shipment.`,
    data,
  ),
});

export const orderShippedTemplate = (data: OrderStatusUpdateData) => ({
  subject: `Order Shipped — #${data.orderId.slice(0, 8).toUpperCase()} | Gyp6.sale`,
  html: buildEmail(
    'Order Shipped',
    'Your Order Has Been Shipped',
    `Hi ${data.buyerName}, <strong>${data.supplierName}</strong> has shipped your order. You will receive it soon. Once you receive the items, please mark the order as delivered.`,
    data,
  ),
});
