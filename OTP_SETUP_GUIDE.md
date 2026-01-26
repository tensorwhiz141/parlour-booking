# OTP Authentication Setup Guide

## Email Configuration Setup

To enable OTP-based authentication, you need to configure email sending capabilities.

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Visit https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Generate a 16-character app password
   - Copy this password (you won't see it again)

3. **Update Environment Variables**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

### Alternative Email Services

You can also use other email services like:
- **SendGrid**
- **Mailgun** 
- **Amazon SES**
- **Outlook/Hotmail**

### Testing Email Functionality

1. Start your backend server
2. Try logging in through the frontend
3. Check if OTP email is received
4. Verify the OTP works correctly

## OTP Authentication Flow

### How it works:

1. **Step 1**: User enters email and password
2. **Step 2**: System validates credentials and sends 6-digit OTP to email
3. **Step 3**: User receives OTP via email (valid for 3 minutes)
4. **Step 4**: User enters OTP to complete login
5. **Step 5**: System verifies OTP and grants access

### Security Features:

- **3-minute expiration**: OTPs expire after 3 minutes for security
- **3 attempt limit**: Users get 3 attempts to enter correct OTP
- **Automatic cleanup**: Expired OTPs are automatically deleted
- **Rate limiting**: Prevents spamming OTP requests

### API Endpoints:

- `POST /api/auth/request-otp` - Request OTP with email/password
- `POST /api/auth/verify-otp` - Verify OTP and complete login  
- `POST /api/auth/resend-otp` - Resend OTP if expired/lost

## Troubleshooting

### Common Issues:

1. **Email not received**:
   - Check spam/junk folder
   - Verify email configuration in .env
   - Ensure app password is correct

2. **OTP expired**:
   - Request new OTP using "Resend OTP" button
   - Timer shows remaining time

3. **Too many attempts**:
   - Wait for OTP to expire (3 minutes)
   - Request fresh OTP

4. **Backend errors**:
   - Check server logs
   - Verify MongoDB connection
   - Ensure all dependencies are installed

### Testing in Development:

You can test the email functionality locally by:
1. Setting up the email configuration in your local .env
2. Running the backend server locally
3. Using the frontend to trigger OTP requests

The system will log email sending status in the console for debugging.