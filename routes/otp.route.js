import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';



const router = express.Router();

// Route to send OTP
router.post('/send', sendOtp);
// Route to verify OTP
router.post('/verify', verifyOtp);

export default router;
