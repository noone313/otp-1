import redisClient from '../redis.client.js';
import {sendEmail} from '../controllers/sendEmail.controller.js'


// Function to send an OTP
// This function generates a random OTP and stores it in Redis with a 5-minute expiration
export const sendOtp = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await redisClient.set(`otp:${email}`, otp, {
            EX: 300 
        });

        try {
        await sendEmail(email, otp);
        } catch (emailError) {
            console.error('Error sending email:', emailError);}


          return res.status(200).json({ message: 'OTP has been sent to your email' });

    }catch (error) {
        
        console.error('Error sending OTP:', error);

        res.status(500).json({ message: 'Internal server error' });
    }
};


// Function to verify the OTP
// This function checks if the OTP provided by the user matches the one stored in Redis
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        // Retrieve the OTP from Redis
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP has expired or does not exist' });
        }
        // Check if the provided OTP matches the stored OTP
        if (storedOtp !== otp) {
            return res.status(400).json({
  "status": "pending",
  "valid": false,
  "to": email,
  "date_created": new Date().toISOString(),
  "message": "Invalid OTP. Please try again."
}
);
        }
        // If valid, delete the OTP from Redis
        await redisClient.del(`otp:${email}`);
        return res.status(200).json({
  "status": "approved",
  "valid": true,
  "to": email,
  "date_created": new Date().toISOString(),
  "message": "OTP verified successfully. You can proceed."
}
);
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};