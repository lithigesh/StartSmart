// services/pdf.service.js
const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, idea) {
    const doc = new PDFDocument({ margin: 50 });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('StartSmart Idea Analysis Report', { align: 'center' });
    doc.moveDown();

    // Idea Title
    doc.fontSize(20).font('Helvetica-Bold').text(idea.title, { underline: true });
    doc.fontSize(12).font('Helvetica').text(`Category: ${idea.category}`);
    doc.moveDown(2);

    // Viability Score
    doc.fontSize(16).font('Helvetica-Bold').text('Viability Score');
    doc.fontSize(28).fillColor('blue').text(`${idea.analysis.score}/100`);
    doc.fillColor('black').moveDown();

    // SWOT Analysis
    doc.fontSize(16).font('Helvetica-Bold').text('SWOT Analysis');
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Strengths:');
    doc.font('Helvetica').text(idea.analysis.swot.strengths || 'N/A', { indent: 20 });
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Weaknesses:');
    doc.font('Helvetica').text(idea.analysis.swot.weaknesses || 'N/A', { indent: 20 });
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Opportunities:');
    doc.font('Helvetica').text(idea.analysis.swot.opportunities || 'N/A', { indent: 20 });
    doc.moveDown(0.5);

    doc.font('Helvetica-Bold').text('Threats:');
    doc.font('Helvetica').text(idea.analysis.swot.threats || 'N/A', { indent: 20 });
    doc.moveDown(2);

    // Roadmap
    doc.fontSize(16).font('Helvetica-Bold').text('Proposed Roadmap');
    idea.analysis.roadmap.forEach((step, index) => {
        doc.font('Helvetica').text(`${index + 1}. ${step}`);
    });

    doc.end();
}

module.exports = { buildPDF };