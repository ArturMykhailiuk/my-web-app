import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContactService from '../services/contactService';
import { Contact } from '../types/contact';
import './ContactList.css';

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'company' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Завантаження контактів
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ContactService.getAllContacts();
      setContacts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка при завантаженні контактів');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Видалення контакту
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Ви впевнені, що хочете видалити контакт "${name}"?`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await ContactService.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка при видаленні контакту');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Фільтрація контактів
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  // Сортування контактів
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Обробка сортування
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Форматування дати
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="contact-list-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Завантаження контактів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-list-page">
      <div className="page-container">
        <div className="page-header">
          <h1>📋 Мої контакти</h1>
          <Link to="/add-contact" className="btn btn-primary">
            ➕ Додати контакт
          </Link>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
            <button onClick={loadContacts} className="retry-btn">
              Спробувати знову
            </button>
          </div>
        )}

        {contacts.length === 0 && !loading && !error ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Контактів поки немає</h3>
            <p>Почніть з додавання вашого першого контакту!</p>
            <Link to="/add-contact" className="btn btn-primary">
              Додати перший контакт
            </Link>
          </div>
        ) : (
          <>
            <div className="controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="🔍 Пошук контактів..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="sort-container">
                <label>Сортувати за:</label>
                <select 
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="sort-select"
                >
                  <option value="name-asc">Імя (А-Я)</option>
                  <option value="name-desc">Імя (Я-А)</option>
                  <option value="email-asc">Email (А-Я)</option>
                  <option value="email-desc">Email (Я-А)</option>
                  <option value="company-asc">Компанія (А-Я)</option>
                  <option value="company-desc">Компанія (Я-А)</option>
                  <option value="createdAt-desc">Найновіші</option>
                  <option value="createdAt-asc">Найстаріші</option>
                </select>
              </div>
            </div>

            <div className="contacts-stats">
              <p>
                Знайдено контактів: <strong>{sortedContacts.length}</strong> з <strong>{contacts.length}</strong>
              </p>
            </div>

            <div className="contacts-grid">
              {sortedContacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-header">
                    <h3>{contact.name}</h3>
                    <div className="contact-actions">
                      <button
                        onClick={() => handleDelete(contact.id, contact.name)}
                        className="btn-delete"
                        disabled={deleteLoading === contact.id}
                        title="Видалити контакт"
                      >
                        {deleteLoading === contact.id ? (
                          <span className="spinner-small"></span>
                        ) : (
                          '🗑️'
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="contact-details">
                    <div className="contact-field">
                      <span className="field-icon">📧</span>
                      <span className="field-value">
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </span>
                    </div>
                    
                    {contact.phone && (
                      <div className="contact-field">
                        <span className="field-icon">📞</span>
                        <span className="field-value">
                          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                        </span>
                      </div>
                    )}
                    
                    {contact.company && (
                      <div className="contact-field">
                        <span className="field-icon">🏢</span>
                        <span className="field-value">{contact.company}</span>
                      </div>
                    )}
                    
                    {contact.notes && (
                      <div className="contact-field">
                        <span className="field-icon">📝</span>
                        <span className="field-value notes">{contact.notes}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="contact-footer">
                    <small>
                      Створено: {formatDate(contact.createdAt)}
                    </small>
                    {contact.updatedAt !== contact.createdAt && (
                      <small>
                        Оновлено: {formatDate(contact.updatedAt)}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactList;
