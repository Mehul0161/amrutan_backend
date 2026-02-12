# Amrutam Telemedicine Backend

Production-grade backend for Amrutam's telemedicine system, focused on scalability, security, and observability.

## Tech Stack
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js (v5)
- **ORM**: Prisma (v7)
- **Database**: PostgreSQL
- **Cache**: Redis (Idempotency & Rate Limiting)
- **Containerization**: Docker & Docker Compose
- **Validation**: Zod
- **Security**: JWT, bcryptjs, Helmet, Rate Limiting, Audit Trails

## Setup & Installation

### 1. Prerequisites
- Docker & Docker Desktop installed.
- Node.js (v18+) and npm.

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```text
DATABASE_URL=postgresql://amrutam_user:Amrutam123@127.0.0.1:5444/amrutam
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=your-32-character-encryption-key-here
ENCRYPTION_KEY=your-32-character-encryption-key-here
```
*Note: Using `127.0.0.1` ensures consistent connectivity on Windows systems.*

### 3. Start Infrastructure
Start the database and cache using Docker Compose:
```bash
docker-compose up -d
```

### 4. Initialize & Seed Database
Sync the schema, generate the client, and load sample data:
```bash
npx prisma db push
npx prisma generate
npx ts-node seed.ts
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
The server will be available at `http://localhost:3000`.

## API Documentation
Detailed examples for core API requests. All protected routes require a `Authorization: Bearer <TOKEN>` header.

### 1. User Registration
`POST /api/v1/auth/register`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123",
  "name": "Jane Doe",
  "role": "PATIENT"
}
```

### 2. User Login
`POST /api/v1/auth/login`
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```
- **Response**: Returns a `token` to be used in subsequent requests.

### 3. Fetch Doctor Availability
`GET /api/v1/doctors/:doctorId/availability`
- **Headers**: `Authorization: Bearer <TOKEN>`
- **Example**: `GET /api/v1/doctors/uuid-here/availability`

### 4. Book a Consultation
`POST /api/v1/consultations/bookings`
- **Headers**: 
  - `Authorization: Bearer <TOKEN>`
  - `Idempotency-Key: <UNIQUE_UUID>` (Required to prevent duplicate bookings)
- **Body**:
```json
{
  "doctorId": "uuid-of-doctor",
  "slotId": "uuid-of-availability-slot"
}
```

### 5. Health Check
`GET /health`
- **Response**: `{"status":"UP","timestamp":"..."}`

## Security Features
- **Idempotency**: Critical for booking transactions; enforced via Redis.
- **RBAC**: Access controlled for PATIENT, DOCTOR, and ADMIN roles.
- **Audit Logging**: Automatic logging of all sensitive operations.
- **Data Encryption**: PHI is protected via AES-256 server-side encryption.
