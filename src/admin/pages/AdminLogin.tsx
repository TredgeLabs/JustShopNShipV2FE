import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  AlertCircle, 
  Loader2,
  Settings
} from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded passkey for temporary validation
  const ADMIN_PASSKEY = '12345678';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passkey.trim()) {
      setError('Please enter the admin passkey');
      return;
    }

    if (passkey.length !== 8) {
      setError('Passkey must be 8 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (passkey === ADMIN_PASSKEY) {
        // Create admin session
        localStorage.setItem('adminSession', JSON.stringify({
          authenticated: true,
          timestamp: new Date().toISOString(),
          passkey: passkey // In production, don't store the actual passkey
        }));
        
        // Redirect to admin dashboard
        navigate('/admin/orders');
      } else {
        setError('Invalid passkey. Please try again.');
        setPasskey('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 8) {
      setPasskey(value);
      if (error) setError(''); // Clear error when user starts typing
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Settings className="h-12 w-12 text-blue-400" />
            <span className="text-3xl font-bold text-white">Admin Panel</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Secure Access</h2>
          <p className="text-blue-200">Enter your 8-digit passkey to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="passkey"
                  name="passkey"
                  type="password"
                  required
                  value={passkey}
                  onChange={handlePasskeyChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg font-mono tracking-widest"
                  placeholder="••••••••"
                  maxLength={8}
                  autoComplete="off"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 8-digit numeric passkey
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || passkey.length !== 8}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
                <p className="text-xs text-blue-800 mt-1">
                  This is a secure admin area. All activities are logged and monitored.
                  Unauthorized access attempts will be reported.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-blue-200">
            JustShopAndShip Admin Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;