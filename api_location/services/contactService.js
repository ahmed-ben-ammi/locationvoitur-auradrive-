const contactRepository = require('../repositories/contactRepository');

class ContactService {
  async createContactMessage(data) {
    console.log('🔧 [contactService] createContactMessage called with data:', data);
    try {
      const message = await contactRepository.createContactMessage(data);
      console.log('✅ [contactService] Repository returned message:', message);
      
      try {
        // TODO: Implement proper notification creation for admins later
        // For now, just skip notifications to prevent errors
      } catch (error) {
        console.error('Error creating notification:', error);
        // Don't fail the contact message creation if notifications fail
      }
      
      return message;
    } catch (error) {
      console.error('❌ [contactService] Error:', error);
      throw error;
    }
  }

  async getAllContactMessages(filters) {
    return await contactRepository.getAllContactMessages(filters);
  }

  async getContactMessageById(id) {
    return await contactRepository.getContactMessageById(id);
  }

  async markAsRead(id) {
    return await contactRepository.markAsRead(id);
  }

  async deleteContactMessage(id) {
    return await contactRepository.deleteContactMessage(id);
  }

  async getDashboardStats() {
    const unread = await contactRepository.getUnreadCount();
    const total = await contactRepository.getTotalCount();
    return { unread, total };
  }
}

module.exports = new ContactService();
