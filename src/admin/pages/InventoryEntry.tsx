import React, { useState } from 'react';
import {
  Archive,
  Save,
  AlertCircle,
  CheckCircle,
  Package,
  Tag,
  X,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';
import { INVENTORY_CATEGORIES, INVENTORY_SUB_CATEGORIES } from '../constants/adminConstants';

interface InventoryItemData {
  name: string;
  description: string;
  size: string;
  color: string;
  brand: string;
  category: string;
  subCategory: string;
  material: string;
  quantity: number;
  price: number;
  weight_gm: number;
  images: File[];
}

const InventoryEntry: React.FC = () => {
  const [itemData, setItemData] = useState<InventoryItemData>({
    name: '',
    description: '',
    size: '',
    color: '',
    brand: '',
    category: '',
    subCategory: '',
    material: '',
    quantity: 1,
    price: 0,
    weight_gm: 0,
    images: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: keyof InventoryItemData, value: string | number) => {
    setItemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string) => {
    setItemData(prev => ({
      ...prev,
      category,
      subCategory: '' // Reset sub-category when category changes
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return false;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image files must be smaller than 10MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setItemData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      setError(''); // Clear any previous errors
    }
  };

  const removeImage = (index: number) => {
    setItemData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getSubCategories = () => {
    if (!itemData.category) return [];
    return INVENTORY_SUB_CATEGORIES[itemData.category as keyof typeof INVENTORY_SUB_CATEGORIES] || [];
  };

  const validateForm = () => {
    const requiredFields = ['name', 'category', 'brand', 'quantity', 'price'];
    const missingFields = requiredFields.filter(field => !itemData[field as keyof InventoryItemData]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (itemData.quantity <= 0) {
      setError('Stock quantity must be greater than 0');
      return false;
    }

    if (itemData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setError('');

      // In production, you would upload images to a cloud storage service
      // and get URLs back to store in the database
      const imageUrls = itemData.images.map((file, index) =>
        `https://example.com/inventory-images/${Date.now()}-${index}-${file.name}`
      );

      const submissionData = {
        ...itemData,
        imageUrls // Replace File objects with URLs for API submission
      };

      const response = await adminApiService.createInventoryItem(submissionData);

      if (response.success) {
        setSuccess('Inventory item created successfully!');

        // Reset form
        setItemData({
          name: '',
          description: '',
          size: '',
          color: '',
          brand: '',
          category: '',
          subCategory: '',
          material: '',
          quantity: 1,
          price: 0,
          weight_gm: 0,
          images: []
        });

        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to create inventory item');
      }
    } catch (err) {
      setError('Error creating inventory item');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Archive className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          </div>
          <p className="text-gray-600">
            Add new items to the inventory for customers to purchase.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Inventory Entry Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Inventory Item</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={itemData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={itemData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={itemData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={itemData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Cotton, Silk, Plastic"
                />
              </div>
            </div>

            {/* Categories and Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-green-600" />
                Categories & Specifications
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={itemData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {INVENTORY_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {itemData.category && getSubCategories().length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-Category
                  </label>
                  <select
                    value={itemData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select sub-category</option>
                    {getSubCategories().map(subCategory => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={itemData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={itemData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Red, Blue, Multi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={itemData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={itemData.weight_gm}
                    onChange={(e) => handleInputChange('weight_gm', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-purple-600" />
                Product Images
              </h3>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    Add Images
                  </span>
                  <span className="text-xs text-gray-500">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </span>
                </label>
              </div>

              {/* Image Preview Grid */}
              {itemData.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({itemData.images.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {itemData.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Tip: The first image will be used as the main product image
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" text="" />
                  <span>Creating Item...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Inventory Item</span>
                </>
              )}
            </button>
          </div>

          {/* Form Guidelines */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Guidelines:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fields marked with * are required</li>
              <li>• Use clear, descriptive product names</li>
              <li>• Select the most appropriate category and sub-category</li>
              <li>• Upload high-quality product images for better customer experience</li>
              <li>• Ensure stock quantity and price are accurate</li>
              <li>• Weight helps calculate shipping costs accurately</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InventoryEntry;