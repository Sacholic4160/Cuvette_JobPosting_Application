import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js';
import postJob from '../controllers/job.controller.js';


const router = express.Router();



router.post('/post-job', verifyJwt, postJob)



export default router