# OTP Authentication with Resend Deployment Guide

## Overview
This guide explains how to deploy the OTP-based authentication system using Resend for email delivery, which works reliably on platforms like Render that block SMTP traffic.

## Why Resend?
- Works on Render, Vercel, Railway, and other cloud platforms
- No blocked ports or connection timeouts
- Reliable email delivery with HTTPS API
- Free tier available
- Easy integration

## Getting Started with Resend

### 1. Get Your Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Navigate to Dashboard → API Keys
4. Create a new API key
5. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables
Update your `.env` file:
```
RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=onboarding@resend.dev  # For testing
# Or use your verified domain: noreply@yourdomain.com
```

### 3. Verify Your Domain (Production)
For production use:
1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records as provided
5. Wait for verification (may take a few minutes)

## Environment Variables for Different Environments

### Local Development (.env)
```
RESEND_API_KEY=re_your_local_dev_key
EMAIL_FROM=onboarding@resend.dev
```

### Render Deployment
Add these as Environment Variables in your Render dashboard:
- `RESEND_API_KEY`: Your Resend API key
- `EMAIL_FROM`: Either `onboarding@resend.dev` or your verified domain

## Email Templates

The OTP email includes:
- Professional salon branding
- 6-digit OTP code
- 3-minute expiration notice
- Security notice
- Responsive design

## Testing the System

### Local Testing
1. Use `onboarding@resend.dev` as sender (free to use)
2. Send test emails to your personal email
3. Verify OTP functionality

### Production Testing
1. Use your verified domain
2. Test with real user accounts
3. Monitor email delivery rates

## Troubleshooting

### Common Issues:

1. **API Key Error**: 
   - Ensure `RESEND_API_KEY` is correctly set
   - Check for typos in the key

2. **Domain Not Verified**:
   - If using custom domain, ensure it's verified in Resend
   - For testing, use `onboarding@resend.dev`

3. **Emails Going to Spam**:
   - Use verified domains in production
   - Ensure proper DNS configuration

### Error Messages:
- `ETIMEDOUT` - This should no longer occur with Resend
- `API Key Invalid` - Check your API key in environment variables
- `Domain Not Verified` - Verify your sending domain in Resend dashboard

## Security Features Maintained

All original security features are preserved:
- 3-minute OTP expiration
- 3 failed attempt limit
- Automatic cleanup of expired OTPs
- Rate limiting
- Secure token generation

## Deployment Checklist

- [ ] Install `resend` package: `npm install resend`
- [ ] Update email service to use Resend
- [ ] Add `RESEND_API_KEY` to environment variables
- [ ] Set `EMAIL_FROM` appropriately
- [ ] Test OTP functionality end-to-end
- [ ] Verify emails are delivered successfully
- [ ] Confirm 3-minute timeout works correctly

## Sample API Call Structure

```javascript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'user@example.com',
  subject: 'Your OTP Code',
  html: '<h1>Your OTP: 123456</h1>'
});
```

This system is now ready for reliable deployment on Render and other cloud platforms!