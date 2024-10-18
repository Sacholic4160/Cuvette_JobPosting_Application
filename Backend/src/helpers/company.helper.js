import sgmail from '@sendgrid/mail'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
sgmail.setApiKey(process.env.SENDGRID_API_KEY);


const generateOtp = () =>
    Math.floor(100000 + Math.round() * 900000).toString();


const sendEmailOtp = async (email, otp) => {
    const message = {
        to: email,
        from: 'sachinparmar4160@gmail.com',
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is ${otp}`,
        html: `<p>Your OTP for email verification is <strong>${otp}</strong><p>`
    }

    try {
        await sgmail.send(message);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error while sending email!', error);
    }


}

const twilioSID = process.env.TWILLIO_SID_ID
const twilioAuth = process.env.TWILLIO_AUTH_TOKEN

const client = new twilio(twilioSID, twilioAuth)

const sendPhoneOtp = async (phone, otp) => {

    try {
        await client.messages.create({
            body: `Your otp for Phone verification is ${otp}`,
            from: '6262880527',
            to: phone
        })
        console.log('otp sent to phone');
    } catch (error) {
        console.error('Error sending phone otp', error);
    }
}

const generateToken = (company) => {
    return jwt.sign(
       { id: company.id, email: company.email},
       process.env.ACCESS_TOKEN_SECRET,
{expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}


module.exports = { sendEmailOtp, sendPhoneOtp, generateOtp, generateToken }