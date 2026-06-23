export type UserRole = "admin" | "merchant";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface StoreFormData {
  name: string;
  slug: string;
  description: string;
  logo: string;
  whatsappNumber: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  whatsappNumber: string;
}
