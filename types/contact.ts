export type LinkPrecedence = 'primary' | 'secondary';

export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: LinkPrecedence;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ContactRequest {
  email?: string;
  phoneNumber?: string;
}

export interface ContactResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
} 