import { Company } from "../models/company.model";
import bcrypt from 'bcrypt'



const registerCompany = async (req, res) => {
    try {
        const { Name, companyName, Phone, Email,Password, employeeSize } = req.body;

        const isExist  = await Company.findOne({Email})
        if(isExist) res.json({status: 404, error: 'company already exist!'});

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
        
    } catch (error) {
        
    }
}