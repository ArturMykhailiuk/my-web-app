import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import ContactList from './pages/ContactList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/contacts" replace />} />
            <Route path="/add-contact" element={<AddContact />} />
            <Route path="/edit-contact/:id" element={<EditContact />} />
            <Route path="/contacts" element={<ContactList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
