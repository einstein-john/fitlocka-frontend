export interface ApiEnvelope<T = unknown> {
  message: string;
  data?: T;
}

export interface ApiMessage {
  message: string;
}

export interface ValidationErrorBody {
  message?: string;
  data?: {
    error?: Array<{ field?: string; message?: string }>;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  enabled?: boolean;
  isAdmin?: boolean;
  profilePicture?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface InventoryRecord {
  productId: number;
  stock: number;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE';

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  status?: ProductStatus;
  category?: Category;
  inventory?: InventoryRecord | null;
  images?: ProductImage[];
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryListResult {
  items: Category[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export interface OrderLine {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  product?: Product;
}

export interface Order {
  id: number;
  status?: string;
  total?: number;
  items?: OrderLine[];
  createdAt?: string;
}

export interface Application {
  id: number;
  name: string;
  apiKey?: string;
  active?: boolean;
}
