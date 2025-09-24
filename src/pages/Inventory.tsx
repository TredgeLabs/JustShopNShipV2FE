import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Grid,
  List
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
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
}

interface CartItem {
  itemId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = ['all', 'clothing', 'electronics', 'jewelry', 'home-decor', 'beauty', 'spices'];
  const brands = ['all', 'Brand A', 'Brand B', 'Brand C', 'Brand D'];
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Load inventory from API
  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      try {
        const response = await inventoryService.getInventoryList();
        if (response.success && response.items) {
          const items: InventoryItem[] = response.items.map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            images: item.image_urls.map((url: string) => url.startsWith('http') ? url : `http://localhost:4000${url}`),
            price: parseFloat(item.offer_price || item.price),
            originalPrice: item.price ? parseFloat(item.price) : undefined,
            size: item.size ? [item.size] : ['Standard'],
            colors: item.color ? [item.color] : ['Default'],
            brand: item.brand || '',
            category: item.category || '',
            description: item.description || '',
            rating: item.rating || 4.5,
            reviewCount: item.reviewCount || 10,
            inStock: item.is_active && item.quantity > 0,
            stockCount: item.quantity || 0
          }));
          setItems(items);
          setFilteredItems(items);
        }
      } catch (err) {
        // Optionally set error state and show error UI
      }
      setIsLoading(false);
    };
    loadInventory();
  }, []);

  // Filter and sort items
  useEffect(() => {
    const filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max;
      const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return b.id.localeCompare(a.id);
        default: return a.name.localeCompare(b.name);
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [items, searchTerm, selectedCategory, priceRange, selectedBrand, sortBy]);

  const addToCart = (itemId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.itemId === itemId);
      if (existingItem) {
        return prev.map(item =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { itemId, quantity }];
      }
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.itemId !== itemId));
    } else {
      setCart(prev => prev.map(item =>
        item.itemId === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getCartItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/inventory/${itemId}`);
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory...</p>
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
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            </div>
            
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
              
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'All Brands' : brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {filteredItems.length} products found
                  </span>
                  
                  {/* View Mode Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {paginatedItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }>
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div 
                      className={`cursor-pointer ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className={`object-cover ${viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'}`}
                        />
                        {item.originalPrice && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                          </div>
                        )}
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 
                          className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => handleItemClick(item.id)}
                        >
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({item.reviewCount})</span>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                        </div>

                        {viewMode === 'list' && (
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        )}
                      </div>

                      {/* Add to Cart Controls */}
                      <div className="flex items-center justify-between">
                        {getCartItemQuantity(item.id) > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, getCartItemQuantity(item.id) - 1)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium">{getCartItemQuantity(item.id)}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, getCartItemQuantity(item.id) + 1)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                              disabled={!item.inStock}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item.id)}
                            disabled={!item.inStock}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </button>
                        )}
                        
                        <span className="text-xs text-gray-500">
                          {item.inStock ? `${item.stockCount} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;