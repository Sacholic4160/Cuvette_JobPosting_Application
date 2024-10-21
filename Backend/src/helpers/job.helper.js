import sgMail from '@sendgrid/mail';

// Set the API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailToCandidates = async (candidates, job, companyName) => {
    try {
        // Email message body template
        const messageBody = `
            Greetings!

            We are excited to inform you that ${job.companyName} is hiring for a ${job.jobTitle} position with a competitive salary of 8 LPA.

            To apply, please complete the assignment provided in the document below. The submission form link is included within the assignment:

            https://docs.google.com/document/d/1oessphAkXaaHCbsDam1Z1TEtLDszfz9eE_OLYEcMX5M/edit?usp=sharing

            Key Details:

            Role: ${job.jobTitle}
            Salary: 8 LPA
            Location: Remote
            Submission Deadline: 8 PM, ${new Date(job.endDate).toLocaleDateString()}

            Please review the instructions carefully and ensure timely submission of your assignment. If you have any questions, feel free to contact us at atul@cuvette.tech.

            We look forward to receiving your application and wish you the best of luck!

            Best regards,
            Cuvette Team

            Don't want to receive these e-mails? Unsubscribe
        `;

        // Iterate through each candidate email and send the job notification
        for (const email of candidates) {
            const message = {
                to: email, // Candidate's email
                from: process.env.SENDGRID_EMAIL_FROM, // Verified sender email (must be verified in SendGrid)
                subject: `New Job Opportunity: ${job.jobTitle}`,
                text: messageBody,
            };

            // Send email using SendGrid
            await sgMail.send(message);
        }

        console.log('Emails sent successfully to all candidates!');

    } catch (error) {
        console.error('Error sending email to candidates:', error.response ? error.response.body : error);
        throw error; // Propagate the error
    }
};

export default sendMailToCandidates;
