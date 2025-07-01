const pool = require('../config/database');

class Contact {
  static async findExistingContacts(email, phoneNumber) {
    const query = `
      SELECT * FROM contact 
      WHERE (email = $1 OR phone_number = $2)
        AND deleted_at IS NULL
      ORDER BY created_at ASC;
    `;
    const { rows } = await pool.query(query, [email, phoneNumber]);
    return rows;
  }

  static async create(email, phoneNumber, linkedId, linkPrecedence) {
    const query = `
      INSERT INTO contact (email, phone_number, linked_id, link_precedence)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [email, phoneNumber, linkedId, linkPrecedence]);
    return rows[0];
  }

  static async updateToSecondary(contactId, primaryId) {
    const query = `
      UPDATE contact 
      SET link_precedence = 'secondary', 
          linked_id = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    await pool.query(query, [contactId, primaryId]);
  }

  static async getAllLinkedContacts(primaryId) {
    const query = `
      SELECT * FROM contact 
      WHERE id = $1 
         OR linked_id = $1
         AND deleted_at IS NULL
      ORDER BY created_at ASC;
    `;
    const { rows } = await pool.query(query, [primaryId]);
    return rows;
  }
}

module.exports = Contact; 