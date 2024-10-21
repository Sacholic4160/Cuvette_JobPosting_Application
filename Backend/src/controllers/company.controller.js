import { Company } from "../models/company.model.js";
import bcrypt from 'bcrypt'
import { generateOtp, sendEmailOtp, sendPhoneOtp } from '../helpers/company.helper.js'


const registerCompany = async (req, res) => {
  try {
    const { Name, companyName, Phone, Email, Password, employeeSize } = req.body;
    //console.log(Name, companyName, Phone, Email, Password, employeeSize);

    const isExist = await Company.findOne({ Email });
    if (isExist) return res.status(404).json({ error: 'Company already exists!' });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = bcrypt.hashSync(Password, 10);
    console.log(otp, otpExpiry)

    const company = new Company({
      Name,
      companyName,
      Phone,
      Email,
      Password: hashedPassword,
      employeeSize,
      emailOtp: otp,
      otpExpiry: otpExpiry,
    });

    await company.save();

    // Try sending the email
  
      const status = await sendEmailOtp(Email, otp);

      return status ? res.status(200).json({ message: 'OTP sent to email for verification' }) :   res.status(500).json({ error: 'Failed to send OTP email. Please try again later.' });
      

  } catch (error) {
   return res.status(500).json({ error: `Error registering company: ${error.message}` });
  }
};

const verifyEmail = async (req, res) => {
  try {

    const { email, otp } = req.body;
   // console.log(typeof otp)

    const company = await Company.findOne({ Email: email });
    if (!company) return  res.status(404).json({ error: 'Company not found!' });
    console.log(company.emailOtp == otp)
    console.log(company.otpExpiry > new Date())

    if (company.emailOtp == otp && company.otpExpiry > new Date()) {
      company.isEmailVerified = true;
      company.emailOtp = null;
      company.otpExpiry = null;
      await company.save();

      console.log(company)

      const phoneOtp = generateOtp();
      company.phoneOtp = phoneOtp;
      company.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await sendPhoneOtp(company.Phone, phoneOtp);
      await company.save();

       return res.status(200).json({ message: 'Email Verified, OTP sent to Phone!' });

    }
    else {
    return  res.status(400).json({ Error: 'Invalid or Expired OTP' });
    }
  } catch (error) {
   return  res.status(500).json({ error: 'Error verifying the email!' });
  }
}


 const verifyPhone = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const company = await Company.findOne({ Phone: phone });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if OTP is correct and not expired
    if (company.phoneOtp === otp && company.otpExpiry > new Date()) {
      company.isPhoneVerified = true;
      company.phoneOtp = null; // Clear OTP after verification
      company.otpExpiry = null;
      await company.save();

      // Generate JWT token
      const token = generateToken(company);

      res.status(200).json({
        message: 'Phone verified successfully',
        token, // Send token to the client
      });
    } else {
     return  res.status(400).json({ error: 'Invalid or expired OTP' });
    }
  } catch (error) {
   return res.status(500).json({ error: 'Error verifying phone' });
  }
};


export { registerCompany, verifyEmail, verifyPhone }