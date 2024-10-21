import sgmail from '@sendgrid/mail'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), './.env') });

sgmail.setApiKey(process.env.SENDGRID_API_KEY);


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();



const sendEmailOtp = async (email, otp) => {
    const message = {
        to: email,
        from: 'sachinparmar@myfablo.com',
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is ${otp}`,
        html: `<p>Your OTP for email verification is <strong>${otp}</strong><p>`
    }

    try {
        await sgmail.send(message);
        console.log('Email sent successfully!');
        return true;
    } catch (error) {
        console.error('Error while sending email!', error);
        return false;
    }


}

const twilioSID = process.env.TWILIO_SID_ID
const twilioAuth = process.env.TWILIO_AUTH_TOKEN
// console.log('Twilio SID:', process.env.TWILIO_SID_ID); // Should print your Twilio SID
// console.log('Twilio Auth:', process.env.TWILIO_AUTH_TOKEN); // Should print your Twilio Auth Token

const twilioClient = new twilio(twilioSID, twilioAuth)
const sendPhoneOtp = async (phone, otp) => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      console.log('Sending OTP from:', fromNumber);
   // Ensure phone number is in international format
      const message = await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        messagingServiceSid:'MG2efc34739c6cc4fdce960f7721ae4c20',
       // from: process.env.TWILIO_PHONE_NUMBER, // Use environment variable for Twilio phone number
        to: +916262880527 //formattedPhone // Phone number in international format
      });
      console.log(message);
      console.log('OTP sent successfully:', message.sid);
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      throw error;
    }
  };
  

const generateToken = (company) => {
    return jwt.sign(
        { id: company.id, email: company.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}


export { sendEmailOtp, sendPhoneOtp, generateOtp, generateToken }