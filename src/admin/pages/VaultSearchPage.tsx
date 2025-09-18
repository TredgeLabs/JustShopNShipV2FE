import React, { useState } from 'react';
import {
  Search,
  Package,
  User,
  Eye,
  Scale,
  Calendar,
  AlertCircle,
  CheckCircle,
  Archive
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';
import { formatDate } from '../utils/adminHelpers';

interface VaultUser {
  vaultId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  totalItems: number;
  totalWeight: number;
}

interface VaultItem {
  id: string;
  name: string;
  description: string;
  weight: number;
  status: string;
  receivedDate: string;
  imageUrls: string[];
  isReturnable: boolean;
  storageDaysFree: number;
  validityDays: number;
}

const VaultSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'vault_id' | 'user_name' | 'email'>('vault_id');
  const [vaultUser, setVaultUser] = useState<VaultUser | null>(null);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setIsSearching(true);
      setError('');
      setVaultUser(null);
      setVaultItems([]);

      // For now, use the existing validateVaultId endpoint
      // In production, you would have separate endpoints for different search types
      const response = await adminApiService.validateVaultId(searchTerm.trim());

      if (response.success) {
        // Mock vault user data based on response
        const mockVaultUser: VaultUser = {
          vaultId: response.data.vaultId || searchTerm,
          userName: response.data.userName || 'John Doe',
          userEmail: response.data.userEmail || 'john@example.com',
          userPhone: response.data.userPhone || '+91 9876543210',
          totalItems: response.data.transitItems?.length || 0,
          totalWeight: response.data.transitItems?.reduce((sum: number, item: any) => sum + (item.weight || 0.5), 0) || 0
        };

        // Mock vault items data
        const mockVaultItems: VaultItem[] = response.data.transitItems?.map((item: any, index: number) => ({
          id: `VI-${item.id}`,
          name: item.name,
          description: item.name,
          weight: item.weight || 0.5,
          status: 'received',
          receivedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          imageUrls: [`https://images.pexels.com/photos/${4465831 + index}/pexels-photo-${4465831 + index}.jpeg?auto=compress&cs=tinysrgb&w=300`],
          isReturnable: Math.random() > 0.5,
          storageDaysFree: 90,
          validityDays: Math.floor(Math.random() * 90) + 1
        })) || [];

        setVaultUser(mockVaultUser);
        setVaultItems(mockVaultItems);
      } else {
        setError('Vault not found or no items available');
      }
    } catch (err) {
      setError(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewItem = (item: VaultItem) => {
    setSelectedItem(item);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Archive className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Vault Search</h1>
          </div>
          <p className="text-gray-600">
            Search for vaults by vault ID, user name, or email to view vault contents.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Vaults</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Term</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vault ID, user name, or email"
                />
              </div>
            </div>

            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'vault_id' | 'user_name' | 'email')}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="vault_id">Vault ID</option>
                <option value="user_name">User Name</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
              >
                {isSearching ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        {/* Vault User Information */}
        {vaultUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Vault Owner Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Vault ID</label>
                <p className="text-gray-900 font-mono">{vaultUser.vaultId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900 font-medium">{vaultUser.userName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{vaultUser.userEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{vaultUser.userPhone}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Items: {vaultUser.totalItems}</span>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Total Weight: {vaultUser.totalWeight.toFixed(2)} kg</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vault Items Table */}
        {vaultItems.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Vault Items ({vaultItems.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vaultItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.imageUrls[0]}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            <div className="text-xs text-gray-400">ID: {item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Scale className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{item.weight} kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{formatDate(item.receivedDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${item.validityDays < 0 ? 'text-red-600' :
                          item.validityDays < 30 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                          {item.validityDays < 0 ? `${Math.abs(item.validityDays)} days overdue` : `${item.validityDays} days left`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isSearching && searchTerm && !vaultUser && (
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vault found</h3>
            <p className="text-gray-600">Try searching with a different term or search type.</p>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Vault Item Details</h2>
                <button
                  onClick={closeItemModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Item Image */}
                  <div className="text-center">
                    <img
                      src={selectedItem.imageUrls[0]}
                      alt={selectedItem.name}
                      className="w-48 h-48 object-cover rounded-lg mx-auto"
                    />
                  </div>

                  {/* Item Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Item Name</label>
                      <p className="text-gray-900 font-medium">{selectedItem.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Item ID</label>
                      <p className="text-gray-900 font-mono">{selectedItem.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Weight</label>
                      <p className="text-gray-900">{selectedItem.weight} kg</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Received Date</label>
                      <p className="text-gray-900">{formatDate(selectedItem.receivedDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Validity</label>
                      <p className={`font-medium ${selectedItem.validityDays < 0 ? 'text-red-600' :
                        selectedItem.validityDays < 30 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {selectedItem.validityDays < 0 ? `${Math.abs(selectedItem.validityDays)} days overdue` : `${selectedItem.validityDays} days left`}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 mt-1">{selectedItem.description}</p>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`h-4 w-4 ${selectedItem.isReturnable ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-gray-700">
                          {selectedItem.isReturnable ? 'Returnable' : 'Non-returnable'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-700">
                          {selectedItem.storageDaysFree} days free storage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VaultSearchPage;