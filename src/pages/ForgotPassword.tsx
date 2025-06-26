import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { userService } from '../api/services/userService';
import { ApiClientError } from '../api/apiClient';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      // In production, use:
      // const response = await userService.forgotPassword({ email });
      
      setMessage('Password reset link has been sent to your email address. Please check your inbox and follow the instructions.');
      setIsSubmitted(true);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
    setMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Package className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">JustShopAndShip</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            {isSubmitted 
              ? "We've sent you a reset link" 
              : "No worries, we'll send you reset instructions"
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!isSubmitted ? (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the email address associated with your account
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Sending reset link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-600">{message}</p>
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={handleResendEmail}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">What's next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox for the reset link</li>
                  <li>• Click the link to create a new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;