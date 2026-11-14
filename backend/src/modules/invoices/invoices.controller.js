const supabase = require('../../config/supabase');
const PDFDocument = require('pdfkit');

module.exports = {
  async getInvoice(req, res, next) {
    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select('*, orders(*, order_items(*), profiles!customer_id(full_name, email))')
        .eq('order_id', req.params.orderId)
        .single();

      if (error || !invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
      res.json({ success: true, invoice });
    } catch (err) {
      next(err);
    }
  },

  async downloadPdf(req, res, next) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*), invoices(*), profiles!customer_id(full_name, email)')
        .eq('id', req.params.orderId)
        .single();

      if (error || !order) return res.status(404).json({ success: false, message: 'Order not found' });

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order.order_number}.pdf`);
      doc.pipe(res);

      // Brand Title
      doc.fontSize(22).fillColor('#064B3B').text('CUP2EAT', 40, 40);
      doc.fontSize(10).fillColor('#D4AF37').text('EAT YOUR DRINK!', 40, 68);
      doc.fontSize(9).fillColor('#666666').text('Premium Food & Beverage Artisan Cups', 40, 82);
      doc.text('GSTIN: 07AAAAA0000A1Z5 | Connaught Place, New Delhi', 40, 95);

      // Invoice metadata
      doc.fontSize(16).fillColor('#064B3B').text('TAX INVOICE', 380, 40, { align: 'right' });
      doc.fontSize(9).fillColor('#333333');
      doc.text(`Invoice No: ${order.invoices?.[0]?.invoice_number || 'INV-' + order.order_number}`, 380, 65, { align: 'right' });
      doc.text(`Order No: ${order.order_number}`, 380, 80, { align: 'right' });
      doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 380, 95, { align: 'right' });

      doc.moveTo(40, 120).lineTo(555, 120).strokeColor('#D4AF37').stroke();

      // Bill to
      doc.fontSize(10).fillColor('#064B3B').text('BILLED TO:', 40, 135);
      doc.fontSize(9).fillColor('#333333').text(order.profiles?.full_name || 'Valued Customer', 40, 150);
      const addr = order.shipping_address || {};
      doc.text(`${addr.house_no || ''}, ${addr.street || ''}`, 40, 165);
      doc.text(`${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`, 40, 180);

      // Items table
      let y = 220;
      doc.rect(40, y, 515, 20).fill('#064B3B');
      doc.fillColor('#D4AF37').fontSize(9).text('Item Description', 50, y + 5);
      doc.text('Qty', 320, y + 5);
      doc.text('Unit Price', 380, y + 5);
      doc.text('Total (INR)', 480, y + 5);

      y += 25;
      doc.fillColor('#202923');
      for (const item of order.order_items || []) {
        doc.text(`${item.product_name} ${item.variant_name ? `(${item.variant_name})` : ''}`, 50, y, { width: 260 });
        doc.text(String(item.quantity), 320, y);
        doc.text(`INR ${item.unit_price}`, 380, y);
        doc.text(`INR ${item.total_price}`, 480, y);
        y += 20;
      }

      doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor('#e5e5e5').stroke();
      y += 15;

      doc.text(`Subtotal: INR ${order.subtotal}`, 400, y, { align: 'right' });
      y += 15;
      doc.text(`Shipping: INR ${order.shipping_fee}`, 400, y, { align: 'right' });
      y += 15;
      if (order.discount > 0) {
        doc.text(`Discount: -INR ${order.discount}`, 400, y, { align: 'right' });
        y += 15;
      }
      doc.fontSize(12).fillColor('#064B3B').text(`GRAND TOTAL: INR ${order.total}`, 400, y, { align: 'right' });

      doc.fontSize(8).fillColor('#888888').text('This is a computer-generated tax invoice valid across India.', 40, 750, { align: 'center' });

      doc.end();
    } catch (err) {
      next(err);
    }
  },
};
