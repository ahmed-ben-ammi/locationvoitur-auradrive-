const contactService = require('../services/contactService');

class ContactController {
  async createContactMessage(req, res) {
    console.log('📝 [contactController] createContactMessage called!');
    console.log('📝 [contactController] Request body:', req.body);
    try {
      const { name, phone, cne, message } = req.body;
      
      if (!name || !phone || !cne || !message) {
        console.log('❌ [contactController] Missing fields');
        return res.status(400).json({ error: 'All fields are required' });
      }

      console.log('✅ [contactController] All fields present, calling service');
      const newMessage = await contactService.createContactMessage({ name, phone, cne, message });
      console.log('✅ [contactController] Service returned newMessage:', newMessage);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('❌ [contactController] Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllContactMessages(req, res) {
    try {
      const filters = {
        status: req.query.status
      };
      const messages = await contactService.getAllContactMessages(filters);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContactMessageById(req, res) {
    try {
      const message = await contactService.getContactMessageById(req.params.id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      const message = await contactService.markAsRead(req.params.id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteContactMessage(req, res) {
    try {
      const deleted = await contactService.deleteContactMessage(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDashboardStats(req, res) {
    try {
      const stats = await contactService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContactController();
