import { Company } from "../models/company.model";
import bcrypt from 'bcrypt'
import { generateOtp, sendEmailOtp, sendPhoneOtp} from '../helpers/company.helper.js'



const registerCompany = async (req, res) => {
    try {
        const { Name, companyName, Phone, Email, Password, employeeSize } = req.body;

        const isExist = await Company.findOne({ Email })
        if (isExist) res.status(404).json({ error: 'company already exist!' });

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const hashedPassword = bcrypt.hashSync(Password, 10);

        const company = new Company({
            Name,
            companyName,
            Phone,
            Email,
            Password: hashedPassword,
            employeeSize,
            emailOtp: otp,
            otpExpiry: otpExpiry

        })

        await company.save();
        // Send OTP to email
        await sendEmailOtp(Email, otp);

        res.status(200).json({ message: 'OTP sent to email for verification' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering company' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        
        const {email, otp} = req.body;

        const company = await Company.findOne({email});
        if(!company) res.status(404).json({error: 'Company not found!'});

        if(company.emailOtp === otp && company.otpExpiry > new Date()){
            company.isEmailVerified = true;
            company.emailOtp = null;
            company.otpExpiry = null;
            await company.save();


            const phoneOtp = generateOtp();
            company.phoneOtp = phoneOtp;
            company.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            await sendPhoneOtp(company.phone, phoneOtp);
            await company.save();

            res.status(200).json({message: 'Email Verified, OTP sent to Phone!'});

        }
        else {
            res.status(400).json({Error: 'Invalid or Expired OTP'});
        }
    } catch (error) {
        res.status(500).json({error : 'Error verifying the email!'});
    }
}


export const verifyPhone = async (req, res) => {
    const { phone, otp } = req.body;
  
    try {
      const company = await Company.findOne({ phone });
  
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
  
      // Check if OTP is correct and not expired
      if (company.phoneOtp === otp && company.otpExpiry > new Date()) {
        company.phoneVerified = true;
        company.phoneOtp = null; // Clear OTP after verification
        company.otpExpiry = null;
        await company.save();
  
        res.status(200).json({ message: 'Phone verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error verifying phone' });
    }
  };
  

module.exports = { registerCompany, verifyEmail, verifyPhone }