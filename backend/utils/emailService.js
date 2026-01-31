import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

/* 🔐 Validate API key early */
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing');
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email using Resend
 */
export const sendOTPEmail = async (email, otp) => {
  try {
    const FROM_EMAIL =
      process.env.EMAIL_FROM || 'onboarding@resend.dev';

    console.log('📧 Sending OTP to:', email);
    console.log('📨 From:', FROM_EMAIL);

    const response = await resend.emails.send({
      from: FROM_EMAIL,          // MUST be verified in Resend
      to: [email],               // ✅ MUST be array
      subject: 'Your Login OTP - Ananda Beauty Parlour',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Ananda Beauty Parlour</h2>
          <p>Your OTP for login is:</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p style="color: red;">This OTP expires in 3 minutes.</p>
          <p>If you did not request this, please ignore.</p>
        </div>
      `,
    });

    if (!response?.data?.id) {
      console.error('❌ Resend failed:', response);
      return { success: false, error: 'Email not sent' };
    }

    console.log('✅ OTP email sent. Message ID:', response.data.id);
    return { success: true, messageId: response.data.id };

  } catch (error) {
    console.error(
      '❌ Resend error:',
      error?.response?.data || error?.message || error
    );
    return { success: false, error: error?.message || 'Resend error' };
  }
};
