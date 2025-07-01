import { Request, Response } from 'express';
import ContactModel from '../models/contact';
import { Contact, ContactRequest, ContactResponse } from '../types/contact';

class ContactController {
  static async identify(req: Request<{}, {}, ContactRequest>, res: Response<ContactResponse | { error: string }>) {
    try {
      const { email, phoneNumber } = req.body;

      // Validate input
      if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Either email or phoneNumber is required' });
      }

      // Find existing contacts
      const existingContacts = await ContactModel.findExistingContacts(email, phoneNumber);

      let primaryContact: Contact;
      let secondaryContacts: Contact[] = [];

      if (existingContacts.length === 0) {
        // Create new primary contact
        primaryContact = await ContactModel.create(email, phoneNumber, null, 'primary');
      } else {
        // Get the oldest contact as primary
        primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || existingContacts[0];

        // Check if we need to create a new secondary contact
        const hasNewInfo = email && phoneNumber && !existingContacts.some(
          contact => contact.email === email && contact.phoneNumber === phoneNumber
        );

        if (hasNewInfo) {
          await ContactModel.create(email, phoneNumber, primaryContact.id, 'secondary');
        }

        // Convert any primary contacts to secondary
        for (const contact of existingContacts) {
          if (contact.id !== primaryContact.id && contact.linkPrecedence === 'primary') {
            await ContactModel.updateToSecondary(contact.id, primaryContact.id);
          }
        }
      }

      // Get all linked contacts including the new ones
      const allLinkedContacts = await ContactModel.getAllLinkedContacts(primaryContact.id);

      // Prepare response
      const response: ContactResponse = {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [...new Set(allLinkedContacts.map(c => c.email).filter((email): email is string => email !== null))],
          phoneNumbers: [...new Set(allLinkedContacts.map(c => c.phoneNumber).filter((phone): phone is string => phone !== null))],
          secondaryContactIds: allLinkedContacts
            .filter(c => c.linkPrecedence === 'secondary')
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
      if (primaryContact.phoneNumber && response.contact.phoneNumbers[0] !== primaryContact.phoneNumber) {
        response.contact.phoneNumbers = [
          primaryContact.phoneNumber,
          ...response.contact.phoneNumbers.filter(p => p !== primaryContact.phoneNumber)
        ];
      }

      res.json(response);
    } catch (error) {
      console.error('Error in identify endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default ContactController; 