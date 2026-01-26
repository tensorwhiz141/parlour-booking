import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestOTP, verifyOTP, resendOTP } from '../../services/authService';
import Swal from 'sweetalert2';
import './auth.css';

interface OTPLoginPageProps {
  initialEmail?: string;
  initialPassword?: string;
  onBackToLogin?: () => void;
}

const OTPLoginPage: React.FC<OTPLoginPageProps> = ({ 
  initialEmail = '', 
  initialPassword = '',
  onBackToLogin 
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { login } = useAuth();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [step, timer]);

  // Auto-focus first OTP input when moving to OTP step
  useEffect(() => {
    if (step === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await requestOTP(email, password);

      if (response.success && response.data) {
        setStep('otp');
        setTimer(180); // Reset timer to 3 minutes
        setExpiresAt(response.data.expiresAt);
        
        await Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: `OTP has been sent to ${email}. Please check your email.`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Request Failed',
          text: response.error || 'Failed to send OTP',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      
      await Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: errorMessage,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      await Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a 6-digit OTP',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOTP(email, otpString);

      if (response.success && response.data && response.token) {
        login(response.data, response.token);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: response.error || 'Invalid OTP',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        
        // Clear OTP fields on error
        setOtp(['', '', '', '', '', '']);
        if (otpRefs.current[0]) {
          otpRefs.current[0]?.focus();
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      
      await Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: errorMessage,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;

    setLoading(true);

    try {
      const response = await resendOTP(email);

      if (response.success) {
        setTimer(180); // Reset timer
        setExpiresAt(response.data?.expiresAt || null);
        setOtp(['', '', '', '', '', '']); // Clear OTP fields
        
        await Swal.fire({
          icon: 'success',
          title: 'OTP Resent!',
          text: 'A new OTP has been sent to your email.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: response.error || 'Failed to resend OTP',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      
      await Swal.fire({
        icon: 'error',
        title: 'Resend Failed',
        text: errorMessage,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setOtp(['', '', '', '', '', '']);
    setTimer(180);
    setExpiresAt(null);
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
      setTimeout(() => {
        document.getElementById('verify-otp-form')?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }, 100);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
        {step === 'credentials' ? 'Welcome Back' : 'Verify Your Identity'}
      </h1>

      {step === 'credentials' ? (
        <form onSubmit={handleRequestOTP}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a href="#" className="text-xs text-primary-600 hover:text-primary-800">
                Forgot password?
              </a>
            </div>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="********"
                required
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form id="verify-otp-form" onSubmit={handleVerifyOTP}>
          <div className="mb-6 text-center">
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit verification code to:
            </p>
            <p className="font-medium text-lg text-gray-800">{email}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ))}
            </div>
            
            {timer > 0 ? (
              <p className="text-center text-sm text-gray-500 mt-3">
                Expires in: <span className="font-medium text-red-500">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-center text-sm text-red-500 mt-3 font-medium">
                OTP has expired
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              type="button"
              onClick={handleBackToCredentials}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            >
              Back
            </button>
            
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || timer > 0}
              className={`flex-1 py-2 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                timer > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500'
              }`}
            >
              {timer > 0 ? `Resend (${formatTime(timer)})` : 'Resend OTP'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || timer === 0}
            className={`w-full py-2 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors ${
              loading || timer === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default OTPLoginPage;