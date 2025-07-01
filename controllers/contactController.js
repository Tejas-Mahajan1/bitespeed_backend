const Contact = require('../models/contact');

class ContactController {
  static async identify(req, res) {
    try {
      const { email, phoneNumber } = req.body;

      // Validate input
      if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Either email or phoneNumber is required' });
      }

      // Find existing contacts
      const existingContacts = await Contact.findExistingContacts(email, phoneNumber);

      let primaryContact;
      let secondaryContacts = [];

      if (existingContacts.length === 0) {
        // Create new primary contact
        primaryContact = await Contact.create(email, phoneNumber, null, 'primary');
      } else {
        // Get the oldest contact as primary
        primaryContact = existingContacts.find(contact => contact.link_precedence === 'primary');
        
        if (!primaryContact) {
          primaryContact = existingContacts[0];
        }

        // Check if we need to create a new secondary contact
        const hasNewInfo = email && phoneNumber && !existingContacts.some(
          contact => contact.email === email && contact.phone_number === phoneNumber
        );

        if (hasNewInfo) {
          await Contact.create(email, phoneNumber, primaryContact.id, 'secondary');
        }

        // Convert any primary contacts to secondary
        for (const contact of existingContacts) {
          if (contact.id !== primaryContact.id && contact.link_precedence === 'primary') {
            await Contact.updateToSecondary(contact.id, primaryContact.id);
          }
        }
      }

      // Get all linked contacts including the new ones
      const allLinkedContacts = await Contact.getAllLinkedContacts(primaryContact.id);

      // Prepare response
      const response = {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [...new Set(allLinkedContacts.map(c => c.email).filter(Boolean))],
          phoneNumbers: [...new Set(allLinkedContacts.map(c => c.phone_number).filter(Boolean))],
          secondaryContactIds: allLinkedContacts
            .filter(c => c.link_precedence === 'secondary')
            .map(c => c.id)
        }
      };

      // Ensure primary contact's email and phone are first in the arrays
      if (primaryContact.email && response.contact.emails[0] !== primaryContact.email) {
        response.contact.emails = [
          primaryContact.email,
          ...response.contact.emails.filter(e => e !== primaryContact.email)
        ];
      }
      if (primaryContact.phone_number && response.contact.phoneNumbers[0] !== primaryContact.phone_number) {
        response.contact.phoneNumbers = [
          primaryContact.phone_number,
          ...response.contact.phoneNumbers.filter(p => p !== primaryContact.phone_number)
        ];
      }

      res.json(response);
    } catch (error) {
      console.error('Error in identify endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = ContactController; 