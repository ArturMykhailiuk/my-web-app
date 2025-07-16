import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContactService from '../services/contactService';
import { ContactFormData } from '../types/contact';
import './AddContact.css'; // Використовуємо ті ж стилі

const EditContact: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingContact, setLoadingContact] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Завантаження контакту для редагування
  useEffect(() => {
    const loadContact = async () => {
      if (!id) {
        setError('ID контакту не знайдено');
        setLoadingContact(false);
        return;
      }

      try {
        setLoadingContact(true);
        const contact = await ContactService.getContactById(id);
        
        if (!contact) {
          setError('Контакт не знайдено');
          return;
        }

        setFormData({
          name: contact.name,
          email: contact.email,
          phone: contact.phone || '',
          company: contact.company || '',
          notes: contact.notes || ''
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Помилка при завантаженні контакту');
      } finally {
        setLoadingContact(false);
      }
    };

    loadContact();
  }, [id]);

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
    
    if (!validateForm() || !id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await ContactService.updateContact(id, formData);
      setSuccess(true);
      
      // Через 2 секунди переходимо до списку контактів
      setTimeout(() => {
        navigate('/contacts');
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка при оновленні контакту');
    } finally {
      setLoading(false);
    }
  };

  if (loadingContact) {
    return (
      <div className="add-contact-page">
        <div className="page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Завантаження контакту...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="add-contact-page">
        <div className="page-container">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Контакт успішно оновлено!</h2>
            <p>Перенаправлення до списку контактів...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-contact-page">
      <div className="page-container">
        <div className="page-header">
          <h1>✏️ Редагувати контакт</h1>
          <button 
            onClick={() => navigate('/contacts')} 
            className="btn btn-secondary"
          >
            ← Назад до списку
          </button>
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
              <span className="field-icon">👤</span>
              Повне імя *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введіть повне імя"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <span className="field-icon">📧</span>
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
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <span className="field-icon">📞</span>
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Введіть номер телефону"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              <span className="field-icon">🏢</span>
              Компанія
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Введіть назву компанії"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">
              <span className="field-icon">📝</span>
              Примітки
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Додаткові примітки..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Скасувати
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Оновлення...
                </>
              ) : (
                <>
                  💾 Зберегти зміни
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContact;
