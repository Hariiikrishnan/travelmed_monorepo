import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Type extension for autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

export const generateInvoice = (order: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(11, 79, 140); // '#0B4F8C' Primary Brand Color
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', 105, 25, { align: 'center' });
  
  // Company Info
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('TRAVEL MED INC.', 15, 55);
  doc.text('10x Medical Hub, Sector 9', 15, 60);
  doc.text('Global FULFILLMENT', 15, 65);
  doc.text('contact@travelmed.org', 15, 70);
  
  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text('BILLED TO:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(order.customer || 'N/A', 120, 60);
  
  const formattedAddress = (order.shippingAddress || '').match(/.{1,40}/g) || [];
  formattedAddress.forEach((line: string, index: number) => {
    doc.text(line.trim(), 120, 65 + (index * 5));
  });
  doc.text(order.phone || 'N/A', 120, 65 + (formattedAddress.length * 5));

  // Invoice Details
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 95, 195, 95);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Ref:', 15, 105);
  doc.text('Order Date:', 15, 112);
  doc.text('Tracking ID:', 80, 105);
  doc.text('Payment Mode:', 80, 112);

  doc.setFont('helvetica', 'normal');
  doc.text(String(order.id), 40, 105);
  doc.text(new Date().toLocaleDateString(), 40, 112);
  doc.text(order.tracking || 'Pending', 105, 105);
  doc.text(order.payment || 'N/A', 110, 112);

  // Table
  const tableData = (order.medicines || []).map((m: any, index: number) => [
    index + 1,
    m.name,
    m.qty,
    `INR ${Number(m.price).toLocaleString()}`,
    `INR ${(m.price * m.qty).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: 125,
    head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [11, 79, 140], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 },
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Total Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL:', 130, finalY);
  doc.setTextColor(11, 79, 140);
  doc.text(`INR ${Number(order.amount).toLocaleString()}`, 160, finalY);

  // Footer Disclaimer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated invoice and requires no physical signature.', 105, 280, { align: 'center' });

  // Output
  doc.save(`invoice_${order.id}.pdf`);
  // Open in new tab for print
  const pdfBlob = doc.output('blob');
  const finalObjUrl = URL.createObjectURL(pdfBlob);
  window.open(finalObjUrl);
};


export const generateLabel = (order: any) => {
  // Label format is typically 4x6 inches (101.6 x 152.4 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [101.6, 152.4]
  });

  // Border wrapping the label
  doc.setLineWidth(1);
  doc.rect(4, 4, 93.6, 144.4);

  // Priority Banner at the top
  doc.setFillColor(0, 0, 0);
  doc.rect(4, 4, 93.6, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PRIORITY SHIPPING', 50.8, 14, { align: 'center' });

  // From Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 8, 25);
  doc.setFont('helvetica', 'normal');
  doc.text('Travel Med Inc.', 8, 30);
  doc.text('10x Medical Hub, DB Sector', 8, 34);
  doc.text('Fulfilment Center, Earth 10001', 8, 38);

  doc.setLineWidth(0.5);
  doc.line(4, 43, 97.6, 43); // Separator

  // Ship To Section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SHIP TO:', 8, 52);
  
  doc.setFontSize(14);
  doc.text(order.customer.toUpperCase(), 8, 60);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const formattedAddress = (order.shippingAddress || '').match(/.{1,45}/g) || [];
  formattedAddress.forEach((line: string, index: number) => {
    doc.text(line.trim().toUpperCase(), 8, 66 + (index * 5));
  });

  const currentY = 66 + (formattedAddress.length * 5);
  doc.text(`PHONE: ${order.phone}`, 8, currentY + 4);
  
  // Destination Country Big
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`DEST: ${order.country.toUpperCase()}`, 8, currentY + 12);

  doc.line(4, currentY + 18, 97.6, currentY + 18); // Separator

  // Order Details inside Label
  doc.setFontSize(9);
  doc.text(`Order Ref: ${order.id}`, 8, currentY + 26);
  doc.text(`Method: ${order.shipping}`, 8, currentY + 31);
  doc.text(`Weight: Standard Pouch`, 8, currentY + 36);

  // Fake Barcode (using courier font)
  doc.setFont('courier', 'bold');
  doc.setFontSize(36);
  doc.text('|||| ||| ||||| |||', 50.8, 130, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(order.tracking || 'TRK-PENDING', 50.8, 136, { align: 'center' });

  // Output
  doc.save(`shipping_label_${order.id}.pdf`);
  const pdfBlob = doc.output('blob');
  const finalObjUrl = URL.createObjectURL(pdfBlob);
  window.open(finalObjUrl);
};
