import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  Edit3,
  Save,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { inventoryService } from '../api/services/inventoryService';
import { productService, ProductDetailsResponse } from '../api/services/userService';

interface Product {
  id?: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  url: string;
  image?: string;
  isEditing?: boolean;
  inventory_item_id?: string; // For inventory items
}

interface InventoryItem {
  id: string;
  name: string;
  images: string[];
  price: number;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [productUrl, setProductUrl] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<Partial<Product> | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [touched, setTouched] = useState(false);
  const isInvalid = touched && (!scrapedProduct?.price || scrapedProduct.price === 0);

  // Mock inventory data - replace with actual API call
  useEffect(() => {
    const loadInventoryItems = async () => {
      try {
        const response = await inventoryService.getInventoryList();
        if (response.success && response.items) {
          // Map API items to local InventoryItem type
          const items: InventoryItem[] = response.items.map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            images: item.image_urls.map((url: string) => url.startsWith('http') ? url : `http://localhost:4000${url}`),
            price: parseFloat(item.offer_price || item.price),
            sizes: item.size ? [item.size] : ['Standard'],
            colors: item.color ? [item.color] : ['Default'],
            inStock: item.is_active && item.quantity > 0
          }));
          setInventoryItems(items);
          const savedOrderData = localStorage.getItem('orderData');
          if (savedOrderData) {
            setCart(JSON.parse(savedOrderData).items || []);
          }
        }
      } catch (err) {
        setError(`Failed to load inventory items. ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    loadInventoryItems();
  }, []);

  const handleUrlScraping = async () => {
    if (!productUrl.trim()) {
      setError('Please enter a valid product URL');
      return;
    }

    setIsScrapingUrl(true);
    setError('');

    try {
      const response: ProductDetailsResponse = await productService.getProductDetailsByUrl(productUrl);
      if (response.success && response.details) {
        const scrapedData: Partial<Product> = {
          name: response.details.product_name,
          color: response.details.colors && response.details.colors.length > 0 ? response.details.colors[0] : '',
          size: response.details.sizes && response.details.sizes.length > 0 ? response.details.sizes[0] : '',
          quantity: 1,
          price: 0, // Price may not be available from scraping
          url: productUrl,
          image: response.details.product_image
        };
        setScrapedProduct(scrapedData);
        setSuccess('Product details fetched successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to fetch product details. Please check the URL and try again.');
      }
    } catch (err) {
      setError('Failed to fetch product details. Please check the URL and try again.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const addScrapedToCart = () => {
    if (!scrapedProduct) return;
    if (scrapedProduct.price === undefined || !scrapedProduct?.price || scrapedProduct.price === 0) {
      setTouched(true);
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: scrapedProduct.name || '',
      color: scrapedProduct.color || '',
      size: scrapedProduct.size || '',
      quantity: scrapedProduct.quantity || 1,
      price: scrapedProduct.price || 0,
      url: scrapedProduct.url || '',
      image: scrapedProduct.image
    };

    setCart(prev => [...prev, newProduct]);
    setScrapedProduct(null);
    setProductUrl('');
    setSuccess('Product added to cart!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const addInventoryToCart = (item: InventoryItem, selectedSize: string, selectedColor: string, quantity: number) => {
    const newProduct: Product = {
      // id: item.id,
      name: item.name,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: item.price,
      url: `/inventory/${item.id}`,
      image: item.images[0],
      inventory_item_id: item.id
    };

    setCart(prev => [...prev, newProduct]);
    setSuccess('Product added to cart!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const updateCartItem = (id: string, field: keyof Product, value: string | number) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));

    const orderData = JSON.parse(localStorage.getItem('orderData') || '{}');
    if (orderData.items) {
      orderData.items = (orderData.items as Product[]).filter((item: Product) => item.id !== id);
    }
    localStorage.setItem('orderData', JSON.stringify(orderData));
  };

  const toggleEdit = (id: string) => {
    const currentItem = cart.find(item => item.id === id);
    setIsEditing(!!currentItem?.isEditing);
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalWeight = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToConfirmation = () => {
    if (cart.length === 0) {
      setError('Please add at least one product to your cart');
      return;
    }

    // Navigate to address selection first
    const orderData = {
      items: cart,
      totalPrice: getTotalPrice(),
      totalWeight: getTotalWeight(),
      totalItems: getTotalItems(),
      orderDate: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create Order</h1>
          </div>
          <p className="text-gray-600">
            Add products from Indian online stores or select from our inventory to create your order.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Add New Product Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Product from URL</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product URL from Indian Online Store
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Paste product URL from Amazon.in, Flipkart, Myntra, etc."
                    />
                    <button
                      onClick={handleUrlScraping}
                      disabled={isScrapingUrl || !productUrl.trim()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                    >
                      {isScrapingUrl ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Fetching...
                        </>
                      ) : (
                        'Fetch Details'
                      )}
                    </button>
                  </div>
                </div>

                {/* Scraped Product Details */}
                {scrapedProduct && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-4">Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scrapedProduct.image && (
                        <div className="md:col-span-2">
                          <img
                            src={scrapedProduct.image}
                            alt={scrapedProduct.name}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={scrapedProduct.name || ''}
                          onChange={(e) => setScrapedProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                          type="text"
                          value={scrapedProduct.color || ''}
                          onChange={(e) => setScrapedProduct(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                        <input
                          type="text"
                          value={scrapedProduct.size || ''}
                          onChange={(e) => setScrapedProduct(prev => ({ ...prev, size: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={scrapedProduct.quantity || 1}
                          onChange={(e) => setScrapedProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={scrapedProduct.price ?? ""}
                          onChange={(e) => {
                            setTouched(true); // mark as interacted
                            const value = e.target.value;
                            setScrapedProduct((prev) => ({
                              ...prev,
                              price: parseFloat(value),
                            }));
                          }}
                          onBlur={() => setTouched(true)} // mark touched on blur too
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none 
          [appearance:textfield] 
          ${isInvalid ? "border-red-500" : "border-gray-300"}`}
                        />

                        {/* ✅ Inline error only if touched */}
                        {isInvalid && (
                          <p className="mt-1 text-sm text-red-600">
                            Price must be greater than 0
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={addScrapedToCart}
                      className="mt-4 w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Quick-Select Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Select from Inventory</h2>
                <button
                  onClick={() => navigate('/inventory')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <Package className="h-4 w-4" />
                  <span>View All</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventoryItems.slice(0, 6).map((item) => (
                  <InventoryQuickCard
                    key={item.id}
                    item={item}
                    onAddToCart={addInventoryToCart}
                    onViewDetails={() => navigate(`/inventory/${item.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cart */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdate={updateCartItem}
                    onRemove={removeFromCart}
                    onToggleEdit={toggleEdit}
                  />
                ))}

                {/* Total Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {cart.reduce((total, item) => total + item.quantity, 0)} items
                  </p>
                </div>

                {/* Proceed Button */}
                {isEditing && <button
                  onClick={handleProceedToConfirmation}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
interface CartItemProps {
  item: Product;
  onUpdate: (id: string, field: keyof Product, value: string | number) => void;
  onRemove: (id: string) => void;
  onToggleEdit: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdate, onRemove, onToggleEdit }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          {item.isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="Product name"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.color}
                  onChange={(e) => onUpdate(item.id, 'color', e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Color"
                />
                <input
                  type="text"
                  value={item.size}
                  onChange={(e) => onUpdate(item.id, 'size', e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Size"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onUpdate(item.id, 'quantity', parseInt(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => onUpdate(item.id, 'price', parseFloat(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Price"
                />
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.name}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {item.color} • {item.size} • Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onToggleEdit(item.id)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            {item.isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Inventory Quick Card Component
interface InventoryQuickCardProps {
  item: InventoryItem;
  onAddToCart: (item: InventoryItem, size: string, color: string, quantity: number) => void;
  onViewDetails: () => void;
}

const InventoryQuickCard: React.FC<InventoryQuickCardProps> = ({ item, onAddToCart, onViewDetails }) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(item.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(item, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-full h-32 object-cover rounded-lg mb-3 cursor-pointer"
        onClick={onViewDetails}
      />

      <h3
        className="font-medium text-gray-900 text-sm leading-tight mb-2 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={onViewDetails}
      >
        {item.name}
      </h3>

      <p className="text-sm font-semibold text-gray-900 mb-3">
        ₹{item.price.toLocaleString()}
      </p>

      <div className="space-y-2">
        {item.sizes.length > 1 && (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            {item.sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        )}

        {item.colors.length > 1 && (
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            {item.colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-1 border border-gray-300 rounded"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-1 border border-gray-300 rounded"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!item.inStock}
          className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-medium rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;