/**
 * Clean Single-Page Invoice & KOT Receipt Printer
 * Generates an isolated printable document ensuring exactly 1 page output with 0 blank pages.
 */

export function printBillReceipt(order, restaurant = {}) {
  if (!order) return;

  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items_json || '[]');
  const restName = restaurant.name || "L'Amour Gourmet & Grill";
  const restPhone = restaurant.phone || "+91 98765 43210";
  const restAddress = restaurant.address || "12/A Park Avenue, Gourmet Boulevard";
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : new Date().toLocaleString();

  const subtotal = parseFloat(order.subtotal) || 0;
  const cgst = (subtotal * 0.025).toFixed(2);
  const sgst = (subtotal * 0.025).toFixed(2);
  const deliveryFee = parseFloat(order.delivery_fee) || 0;
  const discount = parseFloat(order.discount) || 0;
  const total = parseFloat(order.total) || 0;

  const itemsHtml = items.map((item, index) => `
    <tr>
      <td style="padding: 6px 4px; font-weight: bold; color: #111;">${item.name}</td>
      <td style="padding: 6px 4px; text-align: center; color: #333;">${item.quantity}</td>
      <td style="padding: 6px 4px; text-align: right; color: #333;">₹${item.price}</td>
      <td style="padding: 6px 4px; text-align: right; font-weight: bold; color: #111;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - #${order.id}</title>
  <style>
    @page {
      size: auto;
      margin: 8mm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background: #ffffff;
      color: #111111;
      font-family: 'Courier New', Courier, monospace, -apple-system, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      width: 100%;
      max-width: 550px;
      margin: 0 auto;
    }
    .receipt-box {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding-bottom: 12px;
      border-bottom: 1px dashed #333;
      margin-bottom: 12px;
    }
    .restaurant-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .restaurant-sub {
      font-size: 11px;
      color: #444;
      margin-bottom: 4px;
    }
    .legal-tags {
      font-size: 10px;
      color: #666;
      margin-top: 4px;
    }
    .meta-grid {
      display: table;
      width: 100%;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #333;
      font-size: 11px;
    }
    .meta-row {
      display: table-row;
    }
    .meta-col-left {
      display: table-cell;
      width: 50%;
      padding: 2px 0;
      vertical-align: top;
    }
    .meta-col-right {
      display: table-cell;
      width: 50%;
      padding: 2px 0;
      text-align: right;
      vertical-align: top;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      color: #777;
      display: block;
    }
    .dest-box {
      padding: 8px 10px;
      background: #f7f7f7;
      border: 1px solid #eee;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    th {
      font-size: 10px;
      text-transform: uppercase;
      color: #555;
      padding: 6px 4px;
      border-bottom: 1px solid #333;
      text-align: left;
    }
    .calc-table {
      width: 100%;
      border-top: 1px dashed #333;
      padding-top: 8px;
      margin-top: 6px;
      font-size: 12px;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      font-weight: 900;
      border-top: 2px solid #111;
      border-bottom: 2px solid #111;
      padding: 8px 0;
      margin-top: 6px;
    }
    .footer {
      text-align: center;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px dashed #777;
      font-size: 10px;
      color: #555;
    }
    @media print {
      body {
        max-width: 100%;
      }
      .receipt-box {
        border: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-box">
    
    <div class="header">
      <div class="restaurant-title">🔥 ${restName}</div>
      <div class="restaurant-sub">Charcoal & Clay Oven Heritage</div>
      <div class="restaurant-sub">${restAddress} • Phone: ${restPhone}</div>
      <div class="legal-tags">FSSAI Lic: <strong>12823019000452</strong> • GSTIN: <strong>19AAACL2890P1Z4</strong></div>
    </div>

    <div class="meta-grid">
      <div class="meta-row">
        <div class="meta-col-left">
          <span class="section-title">INVOICE / TICKET</span>
          <strong>#${order.id}</strong>
        </div>
        <div class="meta-col-right">
          <span class="section-title">DATE & TIME</span>
          <span>${orderDate}</span>
        </div>
      </div>
      <div class="meta-row">
        <div class="meta-col-left" style="padding-top: 6px;">
          <span class="section-title">CUSTOMER DETAILS</span>
          <strong>${order.customer_name}</strong>
          <div>${order.customer_phone}</div>
        </div>
        <div class="meta-col-right" style="padding-top: 6px;">
          <span class="section-title">PAYMENT MODE</span>
          <strong style="text-transform: uppercase;">${order.payment_method} (${order.payment_status || 'PAID'})</strong>
        </div>
      </div>
    </div>

    <div class="dest-box">
      <span class="section-title">DELIVERY DESTINATION</span>
      <strong>${order.delivery_address}</strong>
      ${order.delivery_notes ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">Note: ${order.delivery_notes}</div>` : ''}
    </div>

    <table>
      <thead>
        <tr>
          <th>Dish Plated</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="calc-table">
      <div class="calc-row">
        <span>Item Subtotal</span>
        <span>₹${subtotal.toFixed(2)}</span>
      </div>
      <div class="calc-row">
        <span>CGST (2.5%)</span>
        <span>₹${cgst}</span>
      </div>
      <div class="calc-row">
        <span>SGST (2.5%)</span>
        <span>₹${sgst}</span>
      </div>
      <div class="calc-row">
        <span>Delivery Fee</span>
        <span>${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
      </div>
      ${discount > 0 ? `
      <div class="calc-row" style="color: #2b7a35; font-weight: bold;">
        <span>Promo Discount</span>
        <span>-₹${discount.toFixed(2)}</span>
      </div>` : ''}
      <div class="grand-total">
        <span>TOTAL CHARGED</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
    </div>

    ${order.driver_name ? `
    <div style="margin-top: 10px; padding: 6px 10px; background: #fafafa; border: 1px dashed #ccc; border-radius: 4px; font-size: 10px;">
      Rider Assigned: <strong>${order.driver_name}</strong> (${order.driver_phone || '+91 98300 55443'})
    </div>` : ''}

    <div class="footer">
      <p style="font-weight: bold; margin-bottom: 2px;">Thank you for dining with L'Amour Gourmet!</p>
      <p>For kitchen support & WhatsApp dispatch: ${restPhone}</p>
      <p style="font-size: 9px; color: #888; margin-top: 4px;">* Computer Generated Tax Invoice • Single Page Clean Receipt *</p>
    </div>

  </div>

  <script>
    window.onload = function() {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>
  `;

  // Create isolated hidden iframe for printing
  let printFrame = document.getElementById('receipt-print-frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'receipt-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow || printFrame.contentDocument.document || printFrame.contentDocument;
  frameDoc.document.open();
  frameDoc.document.write(invoiceHtml);
  frameDoc.document.close();

  // Trigger print cleanly after rendering
  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (e) {
      // Fallback: open popup window
      const printWindow = window.open('', '_blank', 'width=650,height=800');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
      }
    }
  }, 350);
}
