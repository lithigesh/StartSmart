// services/email.service.js
const sgMail = require('@sendgrid/mail');

// Set the API key for the SendGrid mail client
// This line configures the library to use your credentials for all subsequent requests.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email using the SendGrid service.
 * @param {object} options - The email options.
 * @param {string} options.to - Recipient's email address.
 *  @param {string} options.subject - Email subject.
 * @param {string} options.text - Plain text body of the email.
 * @param {string} options.html - HTML body of the email.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    // Construct the message object in the format SendGrid expects.
    const msg = {
        to: to,
        // CRITICAL: The 'from' email MUST be the one you verified in your SendGrid account.
        from: process.env.VERIFIED_SENDER_EMAIL, 
        subject: subject,
        text: text,
        html: html,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email successfully sent to ${to}`);
    } catch (error) {
        // Log the detailed error from SendGrid for easier debugging
        console.error("Error sending email via SendGrid:", error);

        // SendGrid provides detailed error info in the response body
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = { sendEmail };