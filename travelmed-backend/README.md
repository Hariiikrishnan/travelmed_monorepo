# TravelMed Backend API

This is the backend API for the TravelMed application, built with **Node.js, Express, Prisma ORM, and PostgreSQL**.

---

## 1. Architecture

The backend follows a modular, layer-separated architecture:
- **Server (`src/server.js`)**: Entry point to bind port and start server listener.
- **Application (`src/app.js`)**: Configures Express application, security headers (helmet), CORS parameters, JSON parsing, rate limiting, and route mounts.
- **Routes (`src/routes/`)**: Mounts endpoints and maps HTTP methods to controller methods.
- **Controllers (`src/controllers/`)**: Handles request extraction, calls validators, delegates business logic to services, and shapes JSON responses.
- **Services (`src/services/`)**: Implements primary business logic and executes queries using Prisma Client.
- **Database Client (`src/config/database.js`)**: Configures and exports the single PrismaClient instance.
- **Middlewares (`src/middleware/`)**: Encapsulates rate limiters, central error formatters, and authentication validation.
- **Validators (`src/validators/`)**: Uses Zod to declare strict request body structural schemas.
- **Utils (`src/utils/`)**: Standalone classes for HTTP errors.

---

## 2. Database Schema

Normal database structure mapping with constraints, cascades, indexes, and array data types:
- **User**: Administrator credentials (emails and passwords hashed with bcrypt).
- **Medicine**: Core details including compartments, symptoms (stored as `TEXT[]`), warnings, and active ingredients.
- **Doctor**: Physician panel information including ratings, languages spoken (`TEXT[]`), availability, and bios.
- **TravelScenario**: Destination groups matching regions to instructions and recommended medicines lists (`TEXT[]`).
- **Testimonial**: User review items.
- **Order**: Customer order invoice header referencing payment subtotals, addresses, and delivery dates.
- **OrderItem**: Sub-items under an order representing either a specific kit size or add-on product.

---

## 3. Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) database running locally or remotely.

### Setup Environment
Create a `.env` file in the root of the `Backend` directory by copying `.env.example` and filling in the values:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your local database credentials. For example:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/travelmed?schema=public"
JWT_SECRET="YOUR_JWT_SECRET_KEY"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### Install Dependencies
Run from the `Backend` directory:
```bash
npm install
```

### Run Migrations & Seed Data
Initialize the database tables and populate mock datasets:
```bash
npx prisma migrate dev --name init
```
This command automatically executes the seed script (`prisma/seed.js`).

---

## 4. Running the Server

### Development mode (with nodemon auto-restart)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

---

## 5. API Documentation

### Public Endpoints

#### GET `/api/medicines`
- **Purpose**: Fetch all medicines. Supports searching via optional query parameter.
- **Query Parameter**: `search` (e.g. `GET /api/medicines?search=paracetamol`)

#### GET `/api/medicines/:id`
- **Purpose**: Fetch details of a single medicine.

#### GET `/api/doctors`
- **Purpose**: Fetch list of doctors.

#### GET `/api/doctors/:id`
- **Purpose**: Fetch details of a single doctor.

#### GET `/api/travel-scenarios`
- **Purpose**: Fetch list of travel scenario guides.

#### GET `/api/testimonials`
- **Purpose**: Fetch list of customer testimonials.

#### POST `/api/orders`
- **Purpose**: Places a new order.
- **Request Body**:
```json
{
  "shippingAddress": {
    "fullName": "Jane Doe",
    "address": "456 Test Lane",
    "city": "Delhi",
    "country": "India",
    "zipCode": "110001"
  },
  "items": [
    {
      "id": "kit-standard-india",
      "name": "Travel Med Kit - Standard Package",
      "price": 2900,
      "quantity": 1,
      "type": "kit",
      "options": {
        "size": "Solo"
      }
    }
  ]
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "TM-123456",
    "status": "Processing",
    "trackingNumber": "TRK987654321US",
    "estimatedDelivery": "Monday, Aug 18, 2026",
    ...
  }
}
```

#### GET `/api/orders/:orderId`
- **Purpose**: Track an order by its `orderId` or `trackingNumber`.

---

### Admin-Only Protected Endpoints
*Requires header: `Authorization: Bearer <token>`*

#### POST `/api/auth/register`
- **Purpose**: Register a new administrator user.

#### POST `/api/auth/login`
- **Purpose**: Authenticates admin user and returns a JWT token.
- **Request Body**:
```json
{
  "email": "admin@travelmed.com",
  "password": "AdminPassword123"
}
```

#### GET `/api/auth/me`
- **Purpose**: Get current admin profile.

#### GET `/api/orders`
- **Purpose**: Get lists of all placed orders.

#### PATCH `/api/orders/:orderId/status`
- **Purpose**: Update shipping status.
- **Request Body**:
```json
{
  "status": "Shipped" // Allowed: Processing, Shipped, Out for Delivery, Delivered
}
```

---

## 6. Testing

Run integration tests using the native Node.js test runner:
```bash
npm test
```
The test suite validates:
- Retrieving medicine catalog & dynamic searches.
- Testimonial, doctor panel, and travel scenario listings.
- Admin registration, login authentication, and auth failure status codes.
- Order placements, address validations, and pricing calculations.
- Dynamic tracking query lookup.
- Admin-restricted order status updates.
