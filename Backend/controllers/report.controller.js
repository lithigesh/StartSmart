// controllers/report.controller.js
const Report = require('../models/Report.model');
const Idea = require('../models/Idea.model');
const pdfService = require('../services/pdf.service');

// Note: This is a conceptual implementation. A real-world scenario would
// involve uploading the generated PDF to a cloud storage service (like AWS S3)
// and storing the public URL in the 'fileUrl' field of the Report model.

// @desc    Generate a PDF report and save its metadata
// @route   POST /api/reports/ideas/:id/report
exports.generateAndSaveReport = async (req, res, next) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        if (idea.status !== 'analyzed') {
            return res.status(400).json({ message: 'Cannot generate report for an unanalyzed idea.' });
        }

        // In a real app:
        // 1. Generate PDF buffer using pdfService.
        // 2. Upload to S3, get the URL.
        const fileUrl = `https://s3.your-region.amazonaws.com/your-bucket/report_${idea._id}_${Date.now()}.pdf`;

        const report = await Report.create({
            idea: req.params.id,
            reportType: req.body.reportType || 'swot', // e.g., 'swot', 'sustainability'
            fileUrl: fileUrl,
        });

        res.status(201).json({ message: 'Report created successfully.', report });
    } catch (error) {
        next(error);
    }
};

// @desc    Download a previously generated PDF report
// @route   GET /api/reports/ideas/:id/report/:reportId
exports.downloadReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        // In a real app, you would redirect the user to the report.fileUrl:
        // return res.redirect(report.fileUrl);

        // For this example, we will generate the PDF on the fly again for download
        const idea = await Idea.findById(report.idea);
        if (!idea) {
            return res.status(404).json({ message: 'Associated idea not found for this report.' });
        }
        
        const filename = `Report-${idea.title.replace(/\s+/g, '-')}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        pdfService.buildPDF(
            (chunk) => res.write(chunk),
            () => res.end(),
            idea
        );

    } catch (error) {
        next(error);
    }
};

// @desc    Delete a report record
// @route   DELETE /api/reports/ideas/:id/report/:reportId
exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // In a real app, you'd also delete the file from your cloud storage here.
        await report.deleteOne();
        res.json({ message: 'Report record deleted successfully' });
    } catch (error) {
        next(error);
    }
};