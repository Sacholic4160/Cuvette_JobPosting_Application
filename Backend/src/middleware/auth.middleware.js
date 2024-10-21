import jwt from 'jsonwebtoken'
import { Company } from '../models/company.model.js';

export const verifyJwt = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token not provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      const company = await Company.findById(decoded.id);
  
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      req.company = company; // Attach company to request
      next(); // Continue to the next middleware
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized, token invalid or expired' });
    }
  };

  