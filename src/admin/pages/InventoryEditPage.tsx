import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Archive,
    Save,
    AlertCircle,
    CheckCircle,
    Package,
    Tag,
    X,
    Image as ImageIcon,
    Plus,
    ArrowLeft,
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';
import { INVENTORY_CATEGORIES, INVENTORY_SUB_CATEGORIES } from '../constants/adminConstants';

interface InventoryItemForm {
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

    // ✅ edit-only helpers
    existingImageUrls: string[];
    newImages: File[];
}

const InventoryEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const inventoryId = id;


    const [itemData, setItemData] = useState<InventoryItemForm>({
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
        existingImageUrls: [],
        newImages: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const getSubCategories = () => {
        if (!itemData.category) return [];
        return INVENTORY_SUB_CATEGORIES[itemData.category as keyof typeof INVENTORY_SUB_CATEGORIES] || [];
    };

    const totalPreviewImages = useMemo(() => {
        return itemData.existingImageUrls.length + itemData.newImages.length;
    }, [itemData.existingImageUrls.length, itemData.newImages.length]);

    useEffect(() => {
        const load = async () => {
            if (!inventoryId) {
                setError('Invalid inventory id');
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError('');

                const res = await adminApiService.getInventoryItemById(inventoryId);
                if (!res.success) {
                    setError(res.message || 'Failed to load inventory item');
                    return;
                }

                const it = res.data;
                setItemData((prev) => ({
                    ...prev,
                    name: it.name || '',
                    description: it.description || '',
                    size: it.size || '',
                    color: it.color || '',
                    brand: it.brand || '',
                    category: it.category || '',
                    subCategory: it.sub_category || it.subCategory || '',
                    material: it.material || '',
                    quantity: Number(it.quantity ?? 1),
                    price: Number(it.price ?? 0),
                    weight_gm: Number(it.weight_gm ?? 0),
                    existingImageUrls: (it.imageUrls || it.image_urls || []).filter(Boolean),
                    newImages: [],
                }));
            } catch (e: any) {
                setError(e?.message || 'Failed to load inventory item');
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [inventoryId]);


    const handleInputChange = (field: keyof InventoryItemForm, value: string | number) => {
        setItemData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCategoryChange = (category: string) => {
        setItemData((prev) => ({
            ...prev,
            category,
            subCategory: '',
        }));
    };

    const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith('image/')) {
                setError('Please select only image files');
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Image files must be smaller than 10MB');
                return false;
            }
            return true;
        });

        if (validFiles.length) {
            setItemData((prev) => ({
                ...prev,
                newImages: [...prev.newImages, ...validFiles],
            }));
            setError('');
        }
    };

    // ✅ remove existing url
    const removeExistingImage = (index: number) => {
        setItemData((prev) => ({
            ...prev,
            existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index),
        }));
    };

    // ✅ remove newly added file
    const removeNewImage = (index: number) => {
        setItemData((prev) => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const requiredFields = ['name', 'category', 'brand'] as const;

        for (const f of requiredFields) {
            if (!String(itemData[f] || '').trim()) {
                setError(`Please fill in required field: ${f}`);
                return false;
            }
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
        if (!inventoryId) return;
        if (!validateForm()) return;

        try {
            setIsSaving(true);
            setError('');

            const payload = {
                name: itemData.name,
                description: itemData.description,
                size: itemData.size,
                color: itemData.color,
                brand: itemData.brand,
                category: itemData.category,
                sub_category: itemData.subCategory,
                material: itemData.material,
                quantity: itemData.quantity,
                price: itemData.price,
                weight_gm: itemData.weight_gm,
                images: itemData.newImages,
                imageUrls: itemData.existingImageUrls,
            };

            const res = await adminApiService.updateInventoryItem(inventoryId, payload);

            if (res.success) {
                setSuccess('Inventory item updated successfully!');
                setTimeout(() => setSuccess(''), 4000);

                const fresh = await adminApiService.getInventoryItemById(inventoryId);
                if (fresh?.success) {
                    const it = fresh.data;
                    setItemData((prev) => ({
                        ...prev,
                        existingImageUrls: (it.imageUrls || it.image_urls || []).filter(Boolean),
                        newImages: [],
                    }));
                }
            } else {
                setError(res.message || 'Failed to update inventory item');
            }
        } catch (e: any) {
            setError(e?.message || 'Failed to update inventory item');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner text="Loading inventory item..." />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <button
                        onClick={() => navigate('/admin/inventory')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Inventory</span>
                    </button>

                    <div className="flex items-center space-x-3 mb-2">
                        <Archive className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Edit Inventory Item</h1>
                    </div>
                    <p className="text-gray-600">Update details, images, and stock.</p>
                </div>

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

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Package className="h-5 w-5 mr-2 text-blue-600" />
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    value={itemData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={itemData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                                <input
                                    type="text"
                                    value={itemData.brand}
                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                                <input
                                    type="text"
                                    value={itemData.material}
                                    onChange={(e) => handleInputChange('material', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category + Specs */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-green-600" />
                                Categories & Specifications
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select
                                    value={itemData.category}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select category</option>
                                    {INVENTORY_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {itemData.category && getSubCategories().length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
                                    <select
                                        value={itemData.subCategory}
                                        onChange={(e) => handleInputChange('subCategory', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select sub-category</option>
                                        {getSubCategories().map((sc) => (
                                            <option key={sc} value={sc}>{sc}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <input
                                        type="text"
                                        value={itemData.size}
                                        onChange={(e) => handleInputChange('size', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                                    <input
                                        type="text"
                                        value={itemData.color}
                                        onChange={(e) => handleInputChange('color', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={itemData.quantity}
                                        onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={itemData.price}
                                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.1"
                                        value={itemData.weight_gm}
                                        onChange={(e) => handleInputChange('weight_gm', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <ImageIcon className="h-5 w-5 mr-2 text-purple-600" />
                                Images ({totalPreviewImages})
                            </h3>

                            {/* Add new images */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleNewImageUpload}
                                    className="hidden"
                                    id="edit-image-upload"
                                />
                                <label
                                    htmlFor="edit-image-upload"
                                    className="cursor-pointer flex flex-col items-center space-y-2"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                                        <Plus className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">Add More Images</span>
                                    <span className="text-xs text-gray-500">PNG/JPG up to 10MB each</span>
                                </label>
                            </div>

                            {/* Existing images */}
                            {itemData.existingImageUrls.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        Existing Images ({itemData.existingImageUrls.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {itemData.existingImageUrls.map((url, index) => (
                                            <div key={`${url}-${index}`} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Existing ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove image"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New images */}
                            {itemData.newImages.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        New Images ({itemData.newImages.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {itemData.newImages.map((file, index) => (
                                            <div key={`${file.name}-${index}`} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    onClick={() => removeNewImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove image"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                        >
                            {isSaving ? (
                                <>
                                    <LoadingSpinner size="sm" text="" />
                                    <span>Updating Item...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Update Inventory Item</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryEditPage;