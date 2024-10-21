import express from 'express'
import { registerCompany, verifyEmail, verifyPhone } from '../controllers/company.controller.js';

const router = express.Router();



router.post('/register', registerCompany)
router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone)


export default router