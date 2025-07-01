import { QueryResult } from "pg";
import pool from "../config/database";
import { Contact, LinkPrecedence } from "../types/contact";

class ContactModel {
  static async findExistingContacts(
    email: string | undefined,
    phoneNumber: string | undefined
  ): Promise<Contact[]> {
    const query = `
      SELECT * FROM contact 
      WHERE (email = $1 OR phone_number = $2)
        AND deleted_at IS NULL
      ORDER BY created_at ASC;
    `;
    const { rows }: QueryResult<Contact> = await pool.query(query, [
      email,
      phoneNumber,
    ]);
    return rows;
  }

  static async create(
    email: string | undefined,
    phoneNumber: string | undefined,
    linkedId: number | null,
    linkPrecedence: LinkPrecedence
  ): Promise<Contact> {
    const query = `
      INSERT INTO contact (email, phone_number, linked_id, link_precedence)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows }: QueryResult<Contact> = await pool.query(query, [
      email,
      phoneNumber,
      linkedId,
      linkPrecedence,
    ]);
    return rows[0];
  }

  static async updateToSecondary(
    contactId: number,
    primaryId: number
  ): Promise<void> {
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

  static async getAllLinkedContacts(primaryId: number): Promise<Contact[]> {
    const query = `
      SELECT * FROM contact 
      WHERE id = $1 
         OR linked_id = $1
         AND deleted_at IS NULL
      ORDER BY created_at ASC;
    `;
    const { rows }: QueryResult<Contact> = await pool.query(query, [primaryId]);
    return rows;
  }
}

export default ContactModel;
