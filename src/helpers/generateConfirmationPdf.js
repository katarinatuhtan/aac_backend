const PDFDocument = require('pdfkit');
const path = require('path');

const FONT_REGULAR = path.join(__dirname, '../../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf');
const FONT_BOLD = path.join(__dirname, '../../node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf');

function generateConfirmationPdf(user, event) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 60 });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // ZAGLAVLJE
    doc
      .fontSize(20)
      .font(FONT_BOLD)
      .text('POTVRDA O SUDJELOVANJU', { align: 'center' })
      .moveDown(2);

    // LINIJA
    doc
      .moveTo(60, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#cccccc')
      .stroke()
      .moveDown(1.5);

    // SADRŽAJ
    doc
      .fontSize(13)
      .font(FONT_REGULAR)
      .text('Potvrđuje se da je', { align: 'center' })
      .moveDown(0.8)
      .fontSize(18)
      .font(FONT_BOLD)
      .text(`${user.title ? user.title + ' ' : ''}${user.name} ${user.last_name}`, { align: 'center' })
      .moveDown(0.8)
      .fontSize(13)
      .font(FONT_REGULAR)
      .text('sudjelovao/la na događaju:', { align: 'center' })
      .moveDown(0.8)
      .fontSize(16)
      .font(FONT_BOLD)
      .text(event.name, { align: 'center' })
      .moveDown(1);

    // DETALJI DOGAĐAJA
    doc
      .fontSize(12)
      .font(FONT_REGULAR)
      .text(`Koji je održan ${new Date(event.date).toLocaleDateString('hr-HR', {
        day: 'numeric', month: 'long', year: 'numeric'
      })}`, { align: 'center' })
      .text(`u ${new Date(event.date).toLocaleTimeString('hr-HR', {
        hour: '2-digit', minute: '2-digit'
      })} sati. `, { align: 'center' })
      .moveDown(0.4)
      .text(`Na lokaciji: ${event.location}`, { align: 'center' })
      .moveDown(0.4)
      .text(`u trajanju od: ${event.duration} min.`, { align: 'center' })
      .moveDown(2);

    // LINIJA
    doc
      .moveTo(60, doc.y)
      .lineTo(550, doc.y)
      .strokeColor('#cccccc')
      .stroke()
      .moveDown(1.5);

    // FOOTER
    doc
      .fontSize(10)
      .fillColor('#888888')
      .font(FONT_REGULAR)
      .text(`Potvrda generirana: ${new Date().toLocaleDateString('hr-HR')}`, { align: 'center' });

    doc.end();
  });
}

module.exports = generateConfirmationPdf;