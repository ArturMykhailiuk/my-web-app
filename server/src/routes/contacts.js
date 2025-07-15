const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts - Отримати всі контакти
router.get('/', contactController.getAllContacts);

// GET /api/contacts/:id - Отримати контакт за ID  
router.get('/:id', contactController.getContactById);

// POST /api/contacts - Створити новий контакт
router.post('/', contactController.createContact);

// PUT /api/contacts/:id - Оновити контакт
router.put('/:id', contactController.updateContact);

// DELETE /api/contacts/:id - Видалити контакт
router.delete('/:id', contactController.deleteContact);

module.exports = router;
