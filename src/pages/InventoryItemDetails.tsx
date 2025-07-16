import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star, 
  Package, 
  Truck, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  Share2
} from 'lucide-react';
import { inventoryService } from '../api/services/inventoryService';

interface InventoryItem {
  id: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  size: string[];
  colors: string[];
  brand: string;
  category: string;
  description: string;
  detailedDescription: string;
  material: string;
  weight: string;
  ingredients?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  features: string[];
}

interface CartItem {
  itemId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

const InventoryItemDetails: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const loadItemDetails = async () => {
      if (!itemId) return;
      setIsLoading(true);
      try {
        const response = await inventoryService.getInventoryItemDetails(itemId);
        if (response.success && response.item) {
          const apiItem = response.item;
          const mappedItem: InventoryItem = {
            id: apiItem.id.toString(),
            name: apiItem.name,
            images: apiItem.image_urls.map((url: string) => url.startsWith('http') ? url : `http://localhost:4000${url}`),
            price: parseFloat(apiItem.offer_price || apiItem.price),
            originalPrice: apiItem.price ? parseFloat(apiItem.price) : undefined,
            size: apiItem.size ? [apiItem.size] : ['Standard'],
            colors: apiItem.color ? [apiItem.color] : ['Default'],
            brand: apiItem.brand || '',
            category: apiItem.category || '',
            description: apiItem.description || '',
            detailedDescription: apiItem.description || '',
            material: apiItem.material || '',
            weight: apiItem.weight_gm ? `${apiItem.weight_gm} gm` : '',
            ingredients: [],
            rating: 4.5,
            reviewCount: 10,
            inStock: apiItem.is_active && apiItem.quantity > 0,
            stockCount: apiItem.quantity || 0,
            features: []
          };
          setItem(mappedItem);
          setSelectedSize(mappedItem.size[0]);
          setSelectedColor(mappedItem.colors[0]);
        }
      } catch (err) {
        setItem(null);
      }
      setIsLoading(false);
    };
    loadItemDetails();
  }, [itemId]);

  const addToCart = () => {
    if (!item) return;
    
    const cartItem: CartItem = {
      itemId: item.id,
      quantity,
      selectedSize,
      selectedColor
    };
    
    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.itemId === item.id && 
        cartItem.selectedSize === selectedSize && 
        cartItem.selectedColor === selectedColor
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.itemId === item.id && 
          cartItem.selectedSize === selectedSize && 
          cartItem.selectedColor === selectedColor
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prev, cartItem];
      }
    });
    
    // Show success message or redirect to cart
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!item) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? item.images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === item.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.name,
        text: item?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/inventory')}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Inventory</span>
            </button>
            
            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalCartItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalCartItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={item.images[selectedImageIndex]}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
              
              {/* Navigation Arrows */}
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {item.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{item.description}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {item.rating} ({item.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                {item.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Brand and Category */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {item.brand}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              {item.size.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {item.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {item.colors.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {item.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(item.stockCount, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={quantity >= item.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {item.stockCount} items available
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addToCart}
                disabled={!item.inStock}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 border rounded-lg transition-colors ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Information */}
            <div className="border-t pt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{item.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{item.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{item.brand}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="space-y-1">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Free shipping to your vault</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Secure packaging and handling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            {item.detailedDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemDetails;