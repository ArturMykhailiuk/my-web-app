const { v4: uuidv4 } = require('uuid');
const dynamoService = require('../services/dynamoService');

class ContactController {
  // GET /api/contacts - Отримати всі контакти
  async getAllContacts(req, res) {
    try {
      const contacts = await dynamoService.getAllContacts();
      res.json({
        success: true,
        data: contacts,
        count: contacts.length
      });
    } catch (error) {
      console.error('Error in getAllContacts:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка при отриманні контактів',
        error: error.message
      });
    }
  }

  // GET /api/contacts/:id - Отримати контакт за ID
  async getContactById(req, res) {
    try {
      const { id } = req.params;
      const contact = await dynamoService.getContactById(id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Контакт не знайдено'
        });
      }

      res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Error in getContactById:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка при отриманні контакту',
        error: error.message
      });
    }
  }

  // POST /api/contacts - Створити новий контакт
  async createContact(req, res) {
    try {
      const { name, email, phone, company, notes } = req.body;

      // Валідація обов'язкових полів
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Імя та email є обовязковими полями'
        });
      }

      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Невірний формат email'
        });
      }

      const contactData = {
        id: uuidv4(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        notes: notes ? notes.trim() : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newContact = await dynamoService.createContact(contactData);
      
      res.status(201).json({
        success: true,
        message: 'Контакт успішно створено',
        data: newContact
      });
    } catch (error) {
      console.error('Error in createContact:', error);
      
      if (error.code === 'ConditionalCheckFailedException') {
        return res.status(409).json({
          success: false,
          message: 'Контакт з таким ID вже існує'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Помилка при створенні контакту',
        error: error.message
      });
    }
  }

  // PUT /api/contacts/:id - Оновити контакт
  async updateContact(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, company, notes } = req.body;

      // Валідація обов'язкових полів
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Імя та email є обовязковими полями'
        });
      }

      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Невірний формат email'
        });
      }

      const updateData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        notes: notes ? notes.trim() : ''
      };

      const updatedContact = await dynamoService.updateContact(id, updateData);
      
      res.json({
        success: true,
        message: 'Контакт успішно оновлено',
        data: updatedContact
      });
    } catch (error) {
      console.error('Error in updateContact:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка при оновленні контакту',
        error: error.message
      });
    }
  }

  // DELETE /api/contacts/:id - Видалити контакт
  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const deletedContact = await dynamoService.deleteContact(id);
      
      if (!deletedContact) {
        return res.status(404).json({
          success: false,
          message: 'Контакт не знайдено'
        });
      }

      res.json({
        success: true,
        message: 'Контакт успішно видалено',
        data: deletedContact
      });
    } catch (error) {
      console.error('Error in deleteContact:', error);
      res.status(500).json({
        success: false,
        message: 'Помилка при видаленні контакту',
        error: error.message
      });
    }
  }
}

module.exports = new ContactController();
