import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code to send
 * @returns {Promise<Object>} - Result of email sending
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    console.log('Attempting to send OTP to:', email);
    console.log('Using from address:', process.env.EMAIL_FROM || 'onboarding@resend.dev');
    
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev', // Use your verified domain or onboarding@resend.dev
      to: email,
      subject: 'Your Login OTP - Ananda Beauty Parlour',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Ananda Beauty Parlour</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0;">Beauty & Wellness Services</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Your Login Verification Code</h2>
            
            <div style="background: #f8f9fa; padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0;">
              <p style="margin: 0 0 15px 0; color: #666; font-size: 16px;">Use this OTP to complete your login:</p>
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 5px; background: white; padding: 15px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                ${otp}
              </div>
              <p style="margin: 15px 0 0 0; color: #ff6b6b; font-weight: bold;">This code expires in 3 minutes</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this OTP, please ignore this email or contact our support team.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Need help? Contact us at <a href="mailto:info@anandabeauty.in" style="color: #667eea;">info@anandabeauty.in</a>
              </p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                © 2024 Ananda Beauty Parlour. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    });
    
    console.log('OTP email sent successfully to:', email, 'Response:', result);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Error sending OTP email:', error?.response?.data || error?.message || error);
    return { success: false, error: error?.message || 'Unknown error occurred' };
  }
};

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};