import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactService from '../services/contactService';
import { ContactFormData } from '../types/contact';
import './AddContact.css';

const AddContact: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищуємо помилки при зміні
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Імя є обовязковим полем');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email є обовязковим полем');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Невірний формат email');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await ContactService.createContact(formData);
      setSuccess(true);
      
      // Очищуємо форму
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        notes: ''
      });
      
      // Через 2 секунди переходимо до списку контактів
      setTimeout(() => {
        navigate('/contacts');
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка при створенні контакту');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    });
    setError(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="add-contact-page">
        <div className="form-container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Контакт успішно створено!</h2>
            <p>Через кілька секунд ви будете перенаправлені до списку контактів...</p>
            <button 
              onClick={() => navigate('/contacts')}
              className="btn btn-primary"
            >
              Перейти до контактів зараз
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-contact-page">
      <div className="form-container">
        <div className="form-header">
          <h1>➕ Додати новий контакт</h1>
          <p>Заповніть форму для додавання нового контакту до бази даних</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">
              Імя *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введіть повне імя"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введіть email адресу"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Введіть номер телефону"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              Компанія
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Введіть назву компанії"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              Примітки
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Додаткові примітки..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={loading}
            >
              Очистити
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Зберігання...
                </>
              ) : (
                'Зберегти контакт'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContact;
