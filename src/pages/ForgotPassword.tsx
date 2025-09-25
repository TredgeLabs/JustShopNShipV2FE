import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../api/services/userService';
import {
  Phone,
  Shield,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'mobile' | 'otp' | 'password'>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mobile step state
  const [selectedCountry, setSelectedCountry] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');

  // OTP step state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // Password step state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const countryCodes: CountryCode[] = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  ];

  // Timer effect for OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  const validateMobileNumber = (number: string): boolean => {
    // Basic mobile number validation (adjust regex based on country)
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const validatePassword = (password: string): boolean => {
    // Password should be at least 8 characters with at least one uppercase, lowercase, number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateMobileNumber(mobileNumber)) {
      setError('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.forgotPassword({ phone_country_code: selectedCountry, phone_number: mobileNumber });

      if (response.success) {
        setSuccess('OTP sent successfully to your mobile number');
        setCurrentStep('otp');
        setOtpTimer(30);
        setCanResendOtp(false);
      } else {
        setError('Failed to send OTP. Please check your mobile number and try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.verifyForgotPasswordOtp({
        phone_country_code: selectedCountry,
        phone_number: mobileNumber,
        otp_code: otpValue
      });
      setSuccess(response.message || 'OTP verified successfully');
      setResetToken(response.resetToken);
      setCurrentStep('password');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await userService.forgotPassword({ phone_country_code: selectedCountry, phone_number: mobileNumber });
      if (response.success) {
        setSuccess('OTP resent successfully');
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!resetToken) {
      setError('Missing reset token. Please verify OTP again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await userService.updateForgotPassword({
        token: resetToken,
        new_password: newPassword
      });
      if (response && response.message) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMobileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Phone className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
        <p className="text-gray-600">
          Enter your mobile number to receive an OTP for password reset
        </p>
      </div>

      <form onSubmit={handleMobileSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="flex space-x-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter mobile number"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !mobileNumber}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Phone className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
        </button>
      </form>
    </div>
  );

  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
        <p className="text-gray-600">
          Enter the 6-digit OTP sent to {selectedCountry} {mobileNumber}
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            Enter OTP
          </label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={1}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          {otpTimer > 0 ? (
            <p className="text-sm text-gray-600">
              Resend OTP in {otpTimer} seconds
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Shield className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
        </button>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Lock className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
        <p className="text-gray-600">
          Create a strong password for your account
        </p>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            At least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Updating Password...' : 'Update Password'}</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-2 ${currentStep === 'mobile' ? 'text-blue-600' : currentStep === 'otp' || currentStep === 'password' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'mobile' ? 'bg-blue-100' : currentStep === 'otp' || currentStep === 'password' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {currentStep === 'otp' || currentStep === 'password' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">1</span>
                  )}
                </div>
                <span className="text-sm font-medium">Mobile</span>
              </div>

              <div className={`flex items-center space-x-2 ${currentStep === 'otp' ? 'text-blue-600' : currentStep === 'password' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'otp' ? 'bg-blue-100' : currentStep === 'password' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {currentStep === 'password' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">2</span>
                  )}
                </div>
                <span className="text-sm font-medium">OTP</span>
              </div>

              <div className={`flex items-center space-x-2 ${currentStep === 'password' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'password' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <span className="text-sm font-medium">3</span>
                </div>
                <span className="text-sm font-medium">Password</span>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Step Content */}
          {currentStep === 'mobile' && renderMobileStep()}
          {currentStep === 'otp' && renderOtpStep()}
          {currentStep === 'password' && renderPasswordStep()}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;