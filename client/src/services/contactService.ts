import axios from 'axios';
import { Contact, ContactFormData, ApiResponse } from '../types/contact';

// Базовий URL для API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3005/api';

// Створюємо інстанс axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд таймаут
});

// Обробка помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Сервер відповів з кодом помилки
      throw new Error(error.response.data?.message || 'Помилка сервера');
    } else if (error.request) {
      // Запит був зроблений, але відповіді немає
      throw new Error('Сервер не відповідає. Перевірте інтернет з\'єднання.');
    } else {
      // Щось пішло не так при створенні запиту
      throw new Error('Помилка при створенні запиту');
    }
  }
);

export class ContactService {
  // Отримати всі контакти
  static async getAllContacts(): Promise<Contact[]> {
    try {
      const response = await api.get<ApiResponse<Contact[]>>('/contacts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  // Отримати контакт за ID
  static async getContactById(id: string): Promise<Contact> {
    try {
      const response = await api.get<ApiResponse<Contact>>(`/contacts/${id}`);
      if (!response.data.data) {
        throw new Error('Контакт не знайдено');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw error;
    }
  }

  // Створити новий контакт
  static async createContact(contactData: ContactFormData): Promise<Contact> {
    try {
      const response = await api.post<ApiResponse<Contact>>('/contacts', contactData);
      if (!response.data.data) {
        throw new Error('Помилка при створенні контакту');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  // Оновити контакт
  static async updateContact(id: string, contactData: ContactFormData): Promise<Contact> {
    try {
      const response = await api.put<ApiResponse<Contact>>(`/contacts/${id}`, contactData);
      if (!response.data.data) {
        throw new Error('Помилка при оновленні контакту');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  // Видалити контакт
  static async deleteContact(id: string): Promise<void> {
    try {
      await api.delete(`/contacts/${id}`);
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  // Перевірити з'єднання з API
  static async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }
}

export default ContactService;
