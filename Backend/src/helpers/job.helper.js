import sgMail from '@sendgrid/mail';

// Set the API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMailToCandidates = async (candidates, job, companyName) => {

   const batchList = 10;
   console.log(candidates, job, companyName)

   const messageBody = `Greetings!

We are excited to inform you that ${companyName} is hiring for a ${job.title} position with a competitive salary of 8 LPA.

   To apply, please complete the assignment provided in the document below. The submission form link is included within the assignment:

   https://docs.google.com/document/d/1oessphAkXaaHCbsDam1Z1TEtLDszfz9eE_OLYEcMX5M/edit?usp=sharing

   Key Details:

   Role: ${job.title}
   Salary: 8 LPA
   Location: Remote
   Submission Deadline: 8 PM, ${new Date(job.endDate).toLocaleDateString()}

   Please review the instructions carefully and ensure timely submission of your assignment. If you have any questions, feel free to contact us at atul@cuvette.tech.

   We look forward to receiving your application and wish you the best of luck!

   Best regards,
   Cuvette Team

   Don't want to receive these e-mails? Unsubscribe;`
      ;


   console.log(job)
   const sendBatchEmails = async (batch) => {
      const messages = batch.map(email => ({
         to: email,
         from: {
            email: process.env.SENDGRID_EMAIL_FROM,
            name: 'Sachin Parmar'
         },
         subject: `New Job Opportunity at ${companyName} - ${job.title}`,
         text: messageBody

      }))

      await sgMail.send(messages);
   }

   try {
      for (let i = 0; i < candidates.length; i += batchList) {
         const batch = candidates.slice(i, i + batchList);
         await sendBatchEmails(batch);
      }
      console.log('Email sent successfully to all the candidates!');
   } catch (error) {
      console.error('Error sending email to candidates:', error.response ? error.response.body : error);
      throw error;
   }
};

export default sendMailToCandidates;
