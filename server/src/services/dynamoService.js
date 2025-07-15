const AWS = require('aws-sdk');

// Налаштування AWS DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'eu-central-1'
});

const TABLE_NAME = 'Contacts';

class DynamoService {
  // Створити новий контакт
  async createContact(contactData) {
    const params = {
      TableName: TABLE_NAME,
      Item: contactData,
      // Не перезаписувати якщо вже існує
      ConditionExpression: 'attribute_not_exists(id)'
    };

    try {
      await dynamodb.put(params).promise();
      return contactData;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  // Отримати всі контакти
  async getAllContacts() {
    const params = {
      TableName: TABLE_NAME
    };

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  }

  // Отримати контакт за ID
  async getContactById(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    try {
      const result = await dynamodb.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      throw error;
    }
  }

  // Оновити контакт
  async updateContact(id, updateData) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #name = :name, email = :email, phone = :phone, company = :company, notes = :notes, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name' // 'name' - зарезервоване слово в DynamoDB
      },
      ExpressionAttributeValues: {
        ':name': updateData.name,
        ':email': updateData.email,
        ':phone': updateData.phone,
        ':company': updateData.company,
        ':notes': updateData.notes,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    try {
      const result = await dynamodb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  // Видалити контакт
  async deleteContact(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      ReturnValues: 'ALL_OLD'
    };

    try {
      const result = await dynamodb.delete(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
}

module.exports = new DynamoService();
