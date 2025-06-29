// Admin-specific constants
export const ADMIN_ROUTES = {
  ORDERS: '/admin/orders',
  LOCAL_ORDER_EVALUATION: '/admin/local-order-evaluation',
  VAULT_ENTRY: '/admin/vault-entry',
  SHIPPING_ORDER_UPDATE: '/admin/shipping-order-update',
  INVENTORY_ENTRY: '/admin/inventory-entry',
  CONTACT_SUPPORT: '/admin/contact-support',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
} as const;

export const EVALUATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DENIED: 'denied',
} as const;

export const DENY_REASONS = [
  'Product not available',
  'Price mismatch',
  'Quality issues',
  'Seller reliability concerns',
  'Shipping restrictions',
  'Customer request',
  'Payment issues',
  'Other',
] as const;

export const INVENTORY_CATEGORIES = [
  'Clothing',
  'Electronics',
  'Jewelry',
  'Home Decor',
  'Beauty',
  'Spices',
  'Books',
  'Accessories',
] as const;

export const INVENTORY_SUB_CATEGORIES = {
  Clothing: ['Kurtis', 'Sarees', 'Shirts', 'Pants', 'Dresses'],
  Electronics: ['Smartphones', 'Laptops', 'Accessories', 'Audio'],
  Jewelry: ['Necklaces', 'Earrings', 'Bracelets', 'Rings'],
  'Home Decor': ['Wall Art', 'Lighting', 'Furniture', 'Textiles'],
  Beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrances'],
  Spices: ['Whole Spices', 'Ground Spices', 'Spice Mixes', 'Organic'],
} as const;