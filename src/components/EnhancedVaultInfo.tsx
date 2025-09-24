import React, { useState } from 'react';
import { Copy, MapPin, Package, CheckCircle } from 'lucide-react';
import { UserSummary } from '../api/services/userService';

interface Props {
  userSummary: UserSummary | null;
}

const EnhancedVaultInfo: React.FC<Props> = ({ userSummary }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const vaultAddress = {
    name: userSummary?.userFullName,
    street: userSummary?.street,
    address: userSummary?.address,
    city: userSummary?.city,
    country: userSummary?.country,
    phone: userSummary?.mobileNumber || '',
    vaultId: userSummary?.vaultCode
  };

  const copyFullAddress = () => {
    const fullAddress = `${vaultAddress.name}
Vault ID: ${vaultAddress.vaultId}
${vaultAddress.street}
${vaultAddress.address}
${vaultAddress.city}
${vaultAddress.country}
Phone: ${vaultAddress.phone}`;

    navigator.clipboard.writeText(fullAddress);
    setCopied('full');
    setTimeout(() => setCopied(null), 3000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Vault Address</h2>
        </div>
        <button
          onClick={copyFullAddress}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {copied === 'full' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="font-medium">{copied === 'full' ? 'Copied!' : 'Copy Full Address'}</span>
        </button>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Use this address for all your Indian purchases:</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{vaultAddress.name}</p>
              <p className="text-sm text-gray-600">Vault ID: {vaultAddress.vaultId}</p>
            </div>
            <button
              onClick={() => copyToClipboard(`${vaultAddress.name}\nVault ID: ${vaultAddress.vaultId}`, 'name')}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              {copied === 'name' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-sm">{copied === 'name' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{vaultAddress.street}</p>
              <p className="text-gray-700">{vaultAddress.address}</p>
              <p className="text-gray-700">{vaultAddress.city}</p>
              <p className="text-gray-700">{vaultAddress.country}</p>
            </div>
            <button
              onClick={() => copyToClipboard(`${vaultAddress.street}\n${vaultAddress.address}\n${vaultAddress.city}\n${vaultAddress.country}`, 'address')}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              {copied === 'address' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-sm">{copied === 'address' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Phone: {vaultAddress.phone}</p>
            <button
              onClick={() => copyToClipboard(vaultAddress.phone, 'phone')}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              {copied === 'phone' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-sm">{copied === 'phone' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-2">Important Instructions:</h3>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Always include your Vault ID when making purchases</li>
          <li>• Use this exact address for all deliveries</li>
          <li>• Notify us when you place an order for better tracking</li>
          <li>• Keep your order confirmation emails for reference</li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedVaultInfo;