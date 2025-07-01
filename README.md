# Bitespeed Identity Reconciliation Service

This service provides an API endpoint for identifying and linking customer contacts across multiple purchases.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bitespeed
PORT=3000
```

3. Make sure PostgreSQL is installed and running on your system.

4. Create a database named 'bitespeed':
```sql
CREATE DATABASE bitespeed;
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Documentation

### POST /identify

Identifies and consolidates customer contact information.

**Request Body:**
```json
{
  "email": "string?",
  "phoneNumber": "string?"
}
```
Note: At least one of email or phoneNumber must be provided.

**Response:**
```json
{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

**Example Request:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Example Response:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Error Handling

- 400 Bad Request: When neither email nor phoneNumber is provided
- 500 Internal Server Error: For any server-side errors

## Implementation Details

The service maintains a PostgreSQL database with a `contact` table that tracks:
- Primary and secondary contacts
- Contact linking through email or phone number
- Creation and update timestamps
- Soft deletion support

The linking logic ensures:
1. The oldest contact becomes the primary contact
2. New contacts with matching email/phone become secondary contacts
3. Primary contacts can be converted to secondary if linked to an older primary contact 