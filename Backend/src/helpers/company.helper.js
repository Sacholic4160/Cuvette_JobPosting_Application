import sgmail from '@sendgrid/mail'
//import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import path from 'path';
import { GET } from '../../services/axios.service.js';

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

// const twilioSID = process.env.TWILIO_SID_ID

// const twilioAuth = process.env.TWILIO_AUTH_TOKEN
// // console.log('Twilio SID:', process.env.TWILIO_SID_ID); // Should print your Twilio SID
// // console.log('Twilio Auth:', process.env.TWILIO_AUTH_TOKEN); // Should print your Twilio Auth Token

// const twilioClient = new twilio(twilioSID, twilioAuth)
// const sendPhoneOtp = async (phone, otp) => {
//     try {
//       const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
//       const number = process.env.TWILIO_PHONE_NUMBER;
//       const fromNumber = number.startsWith('+') ? number : `+91${number}`;
//      // const fromNumber = process.env.TWILIO_PHONE_NUMBER;
//       console.log('Sending OTP from:', fromNumber);
//    // Ensure phone number is in international format
//       const message = await twilioClient.messages.create({
//         body: `Your OTP is: ${otp}`,
//        // messagingServiceSid:'MG2efc34739c6cc4fdce960f7721ae4c20',
//         from: fromNumber, // Use environment variable for Twilio phone number
//         to: formattedPhone //formattedPhone // Phone number in international format
//       });
   
//       console.log('OTP sent successfully:', message.sid);
//     } catch (error) {
//       console.error('Error sending phone OTP:', error);
//       throw error;
//     }
//   };
  
const textLocaltoken = process.env.TEXT_LOCAL_API

const sendPhoneOtp = async (Phone, otp) => {
  try {
    
    let response = await GET(`https://api.textlocal.in/send/?apikey=${textLocaltoken}=&numbers=${Phone}&sender=FABLOP&message=` +
            encodeURIComponent(
                `Greetings from Fablo, ${otp} is your verification code to login into Fablo Platforms.`
            ))
            console.log(response.data);
            console.log(response)
        return response;
    } catch (error) {
        console.log(error)
        throw new ApiError(400, error.message)
  }
}
const generateToken = (company) => {
    return jwt.sign(
        { id: company.id, email: company.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}


export { sendEmailOtp, sendPhoneOtp, generateOtp, generateToken }