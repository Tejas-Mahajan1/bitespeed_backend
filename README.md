# Bitespeed Identity Reconciliation Service

A TypeScript-based service that provides an API endpoint for identifying and linking customer contacts across multiple purchases.

## Tech Stack
- TypeScript
- Node.js & Express.js
- PostgreSQL
- Nodemon (for development)

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Project Structure

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bitespeed_assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bitespeed
   PORT=3000
   ```

4. **Database Setup**
   ```sql
   CREATE DATABASE bitespeed;
   ```

5. **Build & Run**
   ```bash
   # Build TypeScript
   npm run build

   # Start production server
   npm start

   # Start development server (with auto-reload)
   npm run dev
   ```

## API Documentation

### POST /identify

Identifies and consolidates customer contact information.

#### Request
- Method: `POST`
- Endpoint: `/identify`
- Content-Type: `application/json`

#### Request Body Type
```typescript
interface ContactRequest {
  email?: string;
  phoneNumber?: string;
}
```
> Note: At least one of email or phoneNumber must be provided.

#### Response Type
```typescript
interface ContactResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  }
}
```

#### Example

**Request:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
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

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 400 | Bad Request | Neither email nor phoneNumber provided |
| 500 | Internal Server Error | Server-side errors |

## Business Logic

### Contact Linking Rules
1. The oldest contact becomes the primary contact
2. New contacts with matching email/phone become secondary contacts
3. Primary contacts can be converted to secondary if linked to an older primary contact

### Type Safety Implementation
- Strict TypeScript types for request/response handling
- Proper null handling for optional fields
- Enum-based type checking for contact precedence ('primary' | 'secondary')
- Type-safe database interactions

## Development

### Available Scripts
```bash
npm run build     # Compile TypeScript
npm start         # Start production server
npm run dev       # Start development server with nodemon
```

### Development Features
- Hot reloading with nodemon
- TypeScript compilation watching
- Automatic server restart on file changes

## Database Schema

The service uses a PostgreSQL table with the following structure:

**Contact Table:**
- Primary and secondary contact tracking
- Email and phone number linking
- Timestamps for creation and updates
- Soft deletion support

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request