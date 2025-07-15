export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}
