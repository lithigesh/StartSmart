// Add final submission functionality to ideathon.controller.js

const submitFinalProject = async (req, res) => {
    try {
        const registration = await IdeathonRegistration.findById(req.params.registrationId);
        
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Check if the user is authorized (either admin or the registered entrepreneur)
        if (registration.entrepreneur.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to submit for this registration'
            });
        }

        // Update final submission fields
        registration.finalSubmission = {
            ...req.body,
            submittedAt: new Date(),
            status: 'submitted'
        };

        // Update progress status to indicate completion
        registration.progressStatus = 'Ready for Submission';
        registration.currentProgress = 100;
        registration.lastUpdated = new Date();

        await registration.save();

        res.json({
            success: true,
            message: 'Final project submitted successfully',
            data: registration
        });
    } catch (error) {
        console.error('Error in submitFinalProject:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting final project',
            error: error.message
        });
    }
};

module.exports = { submitFinalProject };