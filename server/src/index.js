const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Статичні файли для React (якщо будемо деплоїти разом)
app.use(express.static(path.join(__dirname, '../../client/build')));

// API маршрути
const contactRoutes = require('./routes/contacts');
app.use('/api/contacts', contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    port: PORT,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint  
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Contact Management API',
    version: '1.0.0',
    endpoints: {
      contacts: '/api/contacts',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Fallback для React Router (SPA)
app.get('*', (req, res) => {
  const clientBuildPath = path.join(__dirname, '../../client/build/index.html');
  res.sendFile(clientBuildPath, (err) => {
    if (err) {
      res.status(404).json({ 
        message: 'Contact Management API',
        error: 'Frontend not found. Please build React app first.'
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Внутрішня помилка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`📞 Contacts API: http://localhost:${PORT}/api/contacts`);
});
