import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>📞 Contact Manager</h2>
        </div>
        <div className="nav-links">
          <Link 
            to="/add-contact" 
            className={`nav-link ${location.pathname === '/add-contact' ? 'active' : ''}`}
          >
            ➕ Додати контакт
          </Link>
          <Link 
            to="/contacts" 
            className={`nav-link ${location.pathname === '/contacts' ? 'active' : ''}`}
          >
            📋 Переглянути контакти
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
