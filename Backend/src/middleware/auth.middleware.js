import jwt from 'jsonwebtoken'
import { Company } from '../models/company.model.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), './.env') });

export const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").split(" ")[1];

     if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token not provided' });
    }
    //console.log(token, process.env.ACCESS_TOKEN_SECRET)

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token
    //console.log(decoded);
    const company = await Company.findById(decoded.id);
    //console.log(company);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    req.company = company; // Attach company to request
    next(); // Continue to the next middleware
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token invalid or expired' });
  }
};

