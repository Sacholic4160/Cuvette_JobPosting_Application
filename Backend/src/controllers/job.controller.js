import { Job } from "../models/job.model.js";
import sendMailToCandidates from "../routers/job.route.js" // Assuming you have a helper file for email sending

const postJob = async (req, res) => {
    try {
        const { jobTitle, jobDescription, exprienceLevel, candidates, endDate } = req.body;
        console.log(jobTitle, jobDescription, exprienceLevel, candidates, endDate);

        const company = req.company;
        const companyId = company.id;

        // Check if phone and email are verified
        if (company.isPhoneVerified && company.isEmailVerified) {
            // Create and save the new job
            const job = new Job({
                jobTitle, 
                jobDescription, 
                exprienceLevel, 
                candidates, 
                endDate, 
                companyId
            });
            await job.save();

            // Update the company's job array
            const jobsCount = company.Jobs.length;
            company.Jobs[jobsCount] = job.id;  // Jobs[jobsCount] since array is 0-indexed
            await company.save();

            // Send emails to all candidates
            await sendMailToCandidates(candidates, job, company.companyName);

            return res.status(201).json({ message: 'Job posted successfully!', job });

        } else {
            return res.status(400).json({ message: 'Please verify your email and phone before posting a job.' });
        }

    } catch (error) {
        console.error('Error posting job:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default postJob;
