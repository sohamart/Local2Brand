import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Downloads a high-resolution PDF invoice of the rendered element with Local2Brand branding.
 */
export const downloadInvoicePDF = async (elementId, orderId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Invoice element not found:', elementId);
    return false;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // Ultra-high resolution crisp rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 195; // mm with 7.5mm margin
    const margin = 7.5;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', margin, 10, imgWidth, imgHeight);
    pdf.save(`Local2Brand_Invoice_${orderId || 'ORD'}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generates and prints the invoice in an isolated clean window.
 */
export const printInvoiceContent = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank', 'width=900,height=950');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice — Local2Brand Agency</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; background: #fff; line-height: 1.4; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { padding: 10px 8px; border-bottom: 1px solid #cbd5e1; text-align: left; font-size: 12px; }
          th { font-size: 11px; text-transform: uppercase; color: #fff; background: #0f172a; font-weight: 700; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .font-bold { font-weight: 700; }
          .font-mono { font-family: monospace; }
          .text-amber-700 { color: #b45309; }
          .text-emerald-700 { color: #047857; }
          .uppercase { text-transform: uppercase; }
          .grid { display: flex; gap: 16px; margin: 12px 0; }
          .col { flex: 1; padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 12px; }
          .footer-note { text-align: center; font-size: 10px; color: #64748b; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
