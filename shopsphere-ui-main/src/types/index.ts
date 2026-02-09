// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Order types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// Order item (matches backend exactly)
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Order
export interface Order {
  _id: string;
  userId: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}


export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}


// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}
