import { Job } from "../models/job.model.js";
import sendMailToCandidates from "../helpers/job.helper.js" // Assuming you have a helper file for email sending

const postJob = async (req, res) => {
    try {
        const { jobTitle, jobDescription, exprienceLevel, candidates, endDate } = req.body;

        const company = req.company;
        const companyId = company.id;

        // Check if phone and email are verified
        if (company.isPhoneVerified && company.isEmailVerified) {

          const jobData = {
            jobTitle, 
            jobDescription, 
            exprienceLevel, 
            candidates, 
            endDate, 
            companyId
        } 
            const job = new Job(jobData);

             console.log(company);
            // Try sending emails to candidates before saving the job
            try {
                await sendMailToCandidates(candidates, jobData, company.companyName);
            } catch (emailError) {
                return res.status(500).json({ message: 'Failed to send emails to candidates', error: emailError.message });
            }

            // If emails are sent successfully, save the job
            await job.save();

            // Update the company's job array
            company.Jobs.push(job.id);
            await company.save();

            return res.status(201).json({ message: 'Job posted and emails sent successfully!', job });
        } else {
            return res.status(400).json({ message: 'Please verify your email and phone before posting a job.' });
        }

    } catch (error) {
        console.error('Error posting job:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export { postJob}
