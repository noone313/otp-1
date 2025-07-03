import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',                
    pass: process.env.SENDGRID_API_KEY, 
  },
});

export const sendEmail = async (to, otpCode) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>رمز التحقق OTP</h2>
        <p>رمز الدخول الخاص بك هو:</p>
        <h3 style="color: #2e6c80;">${otpCode}</h3>
        <p>الرمز صالح لمدة 5 دقائق فقط.</p>
      </div>
    `;

    const mailOptions = {
      from: '"OTP Service" <otp@baqer313.online>', // يجب أن يكون بريدك مفعل في SendGrid
      to,
      subject: 'رمز التحقق الخاص بك',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
