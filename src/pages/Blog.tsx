import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag,
  Loader2,
  Eye
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  thumbnail: string;
  views: number;
  featured: boolean;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = [
    'all',
    'shipping-tips',
    'product-guides',
    'cost-savings',
    'updates',
    'tutorials'
  ];

  // Mock blog data - replace with actual API call
  useEffect(() => {
    const loadBlogPosts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts: BlogPost[] = [
        {
          id: 'post-1',
          title: 'How to Save 70% on International Shipping: The Ultimate Consolidation Guide',
          excerpt: 'Learn the secrets of package consolidation and discover how smart shoppers are saving hundreds of dollars on international shipping costs.',
          content: `# How to Save 70% on International Shipping

Package consolidation is one of the most effective ways to reduce international shipping costs. Here's everything you need to know:

## What is Package Consolidation?

Package consolidation involves combining multiple packages into a single shipment. Instead of shipping each item individually, you accumulate purchases at a forwarding address and ship them together.

## Benefits of Consolidation

1. **Significant Cost Savings**: Save 50-70% on shipping costs
2. **Reduced Customs Hassle**: One customs declaration instead of multiple
3. **Better Protection**: Items are repacked for optimal protection
4. **Environmental Impact**: Fewer shipments mean lower carbon footprint

## Best Practices

- **Plan Your Purchases**: Time your orders to arrive within a few weeks
- **Consider Weight vs. Volume**: Balance actual weight with package dimensions
- **Check Prohibited Items**: Ensure all items can be shipped together
- **Optimize Timing**: Take advantage of free storage periods

## Real Example

Customer Sarah from Toronto saved $340 by consolidating 5 packages:
- Individual shipping: $480
- Consolidated shipping: $140
- **Total savings: $340 (71%)**

Start consolidating your packages today and see the savings add up!`,
          author: 'Priya Sharma',
          publishDate: '2024-01-25',
          readTime: '5 min read',
          category: 'cost-savings',
          tags: ['consolidation', 'savings', 'shipping-tips'],
          thumbnail: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 2847,
          featured: true
        },
        {
          id: 'post-2',
          title: 'Top 10 Indian Products International Customers Love Most',
          excerpt: 'Discover the most popular Indian products that international customers are ordering through JustShopAndShip, from traditional textiles to modern electronics.',
          content: `# Top 10 Indian Products International Customers Love

Based on our shipping data, here are the most popular Indian products among international customers:

## 1. Traditional Textiles
- Silk sarees
- Cotton kurtas
- Handwoven fabrics

## 2. Ayurvedic Products
- Skincare items
- Herbal supplements
- Natural cosmetics

## 3. Spices and Food Items
- Authentic spice blends
- Traditional snacks
- Tea varieties

## 4. Jewelry and Accessories
- Silver jewelry
- Traditional ornaments
- Handcrafted accessories

## 5. Home Decor
- Brass items
- Wooden handicrafts
- Traditional paintings

And much more! Each category offers unique value and authenticity that's hard to find elsewhere.`,
          author: 'Raj Patel',
          publishDate: '2024-01-20',
          readTime: '7 min read',
          category: 'product-guides',
          tags: ['products', 'popular', 'indian-goods'],
          thumbnail: 'https://images.pexels.com/photos/8148579/pexels-photo-8148579.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 1923,
          featured: false
        },
        {
          id: 'post-3',
          title: 'Understanding Customs and Duties: A Complete Guide for International Shoppers',
          excerpt: 'Navigate the complex world of international customs and duties with our comprehensive guide. Learn how to minimize costs and avoid delays.',
          content: `# Understanding Customs and Duties

International shipping involves customs procedures that every shopper should understand:

## What Are Customs Duties?

Customs duties are taxes imposed by governments on imported goods. They vary by:
- Product category
- Country of origin
- Destination country
- Product value

## How to Minimize Duties

1. **Understand Thresholds**: Most countries have duty-free thresholds
2. **Accurate Declarations**: Always declare correct values
3. **Product Classification**: Some items have lower duty rates
4. **Consolidation Benefits**: May help stay under thresholds

## Common Duty Rates by Country

- **USA**: 0-25% depending on product
- **Canada**: 0-20% plus GST/HST
- **UK**: 0-12% plus VAT
- **Australia**: 5-10% plus GST

## Tips for Smooth Customs Clearance

- Provide detailed product descriptions
- Include original purchase receipts
- Respond quickly to customs requests
- Use reputable shipping services

Understanding these basics will help you shop smarter and avoid unexpected costs.`,
          author: 'Sneha Reddy',
          publishDate: '2024-01-15',
          readTime: '8 min read',
          category: 'shipping-tips',
          tags: ['customs', 'duties', 'international-shipping'],
          thumbnail: 'https://images.pexels.com/photos/4465832/pexels-photo-4465832.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 3156,
          featured: true
        },
        {
          id: 'post-4',
          title: 'JustShopAndShip Platform Updates: New Features and Improvements',
          excerpt: 'Discover the latest features and improvements we\'ve added to make your international shopping experience even better.',
          content: `# Platform Updates: January 2024

We're excited to share the latest updates to the JustShopAndShip platform:

## New Features

### Enhanced Tracking
- Real-time package tracking
- SMS and email notifications
- Detailed shipping timeline

### Improved Dashboard
- Better order management
- Consolidated view of all packages
- Quick action buttons

### Mobile App
- iOS and Android apps now available
- Push notifications
- Mobile-optimized interface

## Bug Fixes and Improvements

- Faster page loading times
- Improved search functionality
- Better error handling
- Enhanced security measures

## Coming Soon

- AI-powered shipping recommendations
- Advanced consolidation optimizer
- Multi-language support
- Cryptocurrency payment options

We're constantly working to improve your experience. Have feedback? Let us know!`,
          author: 'Tech Team',
          publishDate: '2024-01-10',
          readTime: '4 min read',
          category: 'updates',
          tags: ['platform', 'updates', 'features'],
          thumbnail: 'https://images.pexels.com/photos/4465833/pexels-photo-4465833.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 1456,
          featured: false
        },
        {
          id: 'post-5',
          title: 'Step-by-Step: How to Place Your First Order with JustShopAndShip',
          excerpt: 'New to international shopping? This comprehensive tutorial will guide you through placing your first order and getting it shipped worldwide.',
          content: `# Your First Order: Step-by-Step Guide

Welcome to JustShopAndShip! Here's how to place your first order:

## Step 1: Create Your Account
1. Sign up at justshopandship.com
2. Verify your email address
3. Complete your profile

## Step 2: Get Your Vault Address
- Your personal Indian address will be provided
- Use this address for all Indian purchases
- Save it in your browser for easy access

## Step 3: Start Shopping
1. Visit your favorite Indian online store
2. Add items to cart
3. Use your vault address at checkout
4. Complete the purchase

## Step 4: Notify Us
- Log into your dashboard
- Add order details
- Upload receipts (optional but recommended)

## Step 5: Track and Ship
- Monitor packages in your vault
- Select items for consolidation
- Calculate shipping costs
- Initiate international shipment

## Pro Tips for First-Time Users

- Start with 2-3 small items
- Check prohibited items list
- Consider consolidation for savings
- Keep order confirmations

Ready to start? Create your account today and join thousands of satisfied customers worldwide!`,
          author: 'Customer Success Team',
          publishDate: '2024-01-05',
          readTime: '6 min read',
          category: 'tutorials',
          tags: ['tutorial', 'getting-started', 'first-order'],
          thumbnail: 'https://images.pexels.com/photos/4465834/pexels-photo-4465834.jpeg?auto=compress&cs=tinysrgb&w=400',
          views: 2234,
          featured: false
        }
      ];
      
      setPosts(mockPosts);
      setIsLoading(false);
    };

    loadBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(post => post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (selectedPost) {
    // Individual blog post view
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowRight className="h-4 w-4 transform rotate-180" />
            <span>Back to Blog</span>
          </button>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={selectedPost.thumbnail}
              alt={selectedPost.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedPost.publishDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{selectedPost.views.toLocaleString()} views</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedPost.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose prose-lg max-w-none">
                {selectedPost.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
                  } else if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.slice(3)}</h2>;
                  } else if (paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-4">{paragraph.slice(2)}</li>;
                  } else if (paragraph.trim()) {
                    return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">JustShopAndShip Blog</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tips, guides, and insights to help you make the most of international shopping and shipping.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search blog posts..."
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : formatCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Posts</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        Featured
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {formatCategoryName(post.category)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {searchTerm ? 'Search Results' : selectedCategory === 'all' ? 'Latest Posts' : `${formatCategoryName(selectedCategory)} Posts`}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {formatCategoryName(post.category)}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.publishDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;