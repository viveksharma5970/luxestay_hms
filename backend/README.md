# Hotel Management System - API Documentation

## Prerequisites
- Java 21
- Maven 3.8+
- Eclipse IDE (no external plugins required)

## How to Run

```bash
mvn clean install
mvn spring-boot:run
```

The server starts at: `http://localhost:8080`  
SQLite database file `hotel.db` is auto-created in the project root.

---

## Authentication

JWT is stored in an **HttpOnly cookie** named `jwt`. It is automatically sent by the browser/Postman on every request after login.

**No `Authorization` header is needed.** The cookie is set automatically on login and cleared on logout.

### Postman Cookie Setup
In Postman, cookies are handled automatically. Just make sure:
- Go to **Settings → General** → enable **"Automatically follow redirects"**
- Postman's **Cookie Manager** will store and send the `jwt` cookie after login

---

## API Endpoints

---

### 1. AUTH

#### Register (GUEST only)
- **POST** `http://localhost:8080/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Jane Guest",
  "email": "guest@hotel.com",
  "password": "guest123"
}
```
- **Response:** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

> ⚠️ **Security Policy:** Admin accounts cannot be registered via this endpoint.
> Admins must be inserted directly into the database with a BCrypt-encoded password.
>
> **Sample SQL to add an admin manually:**
> ```sql
> INSERT INTO users (name, email, password, role)
> VALUES ('John Admin', 'admin@hotel.com', '$2a$10$...bcrypt_hash...', 'ADMIN');
> ```
> Generate a BCrypt hash at: https://bcrypt-generator.com (use rounds = 10)

#### Login
- **POST** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "admin@hotel.com",
  "password": "admin123"
}
```
- **Response:** `200 OK`
  - Sets `HttpOnly` cookie named `jwt` automatically
```json
{
  "email": "admin@hotel.com",
  "role": "ADMIN"
}
```

#### Logout
- **POST** `http://localhost:8080/api/auth/logout`
- **Headers:** None required (cookie is sent automatically)
- **Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```
> Clears the `jwt` cookie immediately.

---

### 2. ROOM MANAGEMENT

> All room management endpoints use the `jwt` cookie automatically — no manual header needed.

#### Create Room (Admin only)
- **POST** `http://localhost:8080/api/rooms`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "roomNumber": "101",
  "type": "DELUXE",
  "price": 150.00
}
```
- **Response:**
```json
{
  "id": 1,
  "roomNumber": "101",
  "type": "DELUXE",
  "price": 150.00,
  "status": "AVAILABLE"
}
```

#### Update Room (Admin only)
- **PUT** `http://localhost:8080/api/rooms/1`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "roomNumber": "101",
  "type": "SUITE",
  "price": 250.00
}
```

#### Delete Room (Admin only)
- **DELETE** `http://localhost:8080/api/rooms/1`
- **Response:** `204 No Content`

#### Get All Rooms (Authenticated)
- **GET** `http://localhost:8080/api/rooms`

#### Get Available Rooms (Public)
- **GET** `http://localhost:8080/api/rooms/available`

---

### 3. BOOKING SYSTEM

#### Create Booking (Guest/Admin)
- **POST** `http://localhost:8080/api/bookings`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "roomId": 1,
  "checkInDate": "2025-08-01",
  "checkOutDate": "2025-08-05"
}
```
- **Response:**
```json
{
  "id": 1,
  "userId": 2,
  "userName": "Jane Guest",
  "roomId": 1,
  "roomNumber": "101",
  "checkInDate": "2025-08-01",
  "checkOutDate": "2025-08-05",
  "status": "CONFIRMED"
}
```

#### Get My Bookings
- **GET** `http://localhost:8080/api/bookings/my`

#### Get All Bookings (Admin)
- **GET** `http://localhost:8080/api/bookings`

#### Cancel Booking
- **PUT** `http://localhost:8080/api/bookings/1/cancel`

---

### 4. FACILITY & PANTRY SERVICES

#### Create Service (Admin only)
- **POST** `http://localhost:8080/api/services/manage`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "name": "Gym",
  "price": 20.00
}
```

> Repeat for: `Laundry`, `Food`, `Room Service`

```json
{ "name": "Laundry", "price": 15.00 }
{ "name": "Food", "price": 30.00 }
{ "name": "Room Service", "price": 25.00 }
```

#### Get All Services (Authenticated)
- **GET** `http://localhost:8080/api/services`

#### Delete Service (Admin only)
- **DELETE** `http://localhost:8080/api/services/manage/1`

#### Request a Service (Guest)
- **POST** `http://localhost:8080/api/services/request`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "bookingId": 1,
  "serviceId": 2
}
```
- **Response:**
```json
{
  "id": 1,
  "bookingId": 1,
  "serviceName": "Laundry",
  "servicePrice": 15.00,
  "status": "PENDING",
  "requestedAt": "2025-07-20T10:30:00"
}
```

#### Get Services by Booking
- **GET** `http://localhost:8080/api/services/booking/1`

---

### 5. BILLING SYSTEM

> There is always **one bill per booking**. It is updated in-place as new services are added.

#### Generate Bill (initial)
- **POST** `http://localhost:8080/api/billing/generate/1`
- **Response:**
```json
{
  "id": 1,
  "bookingId": 1,
  "roomCharges": 600.00,
  "serviceCharges": 45.00,
  "totalAmount": 645.00,
  "amountPaid": 0.00,
  "balanceDue": 645.00,
  "paymentStatus": "PENDING"
}
```
> Room charges = price per night × number of nights  
> Service charges = sum of all services requested before bill was generated

#### Pay the Current Balance
- **PUT** `http://localhost:8080/api/billing/1/pay`
- **Response:**
```json
{
  "id": 1,
  "bookingId": 1,
  "roomCharges": 600.00,
  "serviceCharges": 45.00,
  "totalAmount": 645.00,
  "amountPaid": 645.00,
  "balanceDue": 0.00,
  "paymentStatus": "PAID"
}
```

#### Request More Services After Payment
1. Guest requests new services via `POST /api/services/request` as usual
2. Call **Refresh Bill** to pull new charges into the existing bill:

#### Refresh Bill (add new services to existing bill)
- **PUT** `http://localhost:8080/api/billing/refresh/1`
- **Response:**
```json
{
  "id": 1,
  "bookingId": 1,
  "roomCharges": 600.00,
  "serviceCharges": 70.00,
  "totalAmount": 670.00,
  "amountPaid": 645.00,
  "balanceDue": 25.00,
  "paymentStatus": "PARTIALLY_PAID"
}
```
> The bill status reverts from `PAID` → `PARTIALLY_PAID` and `balanceDue` shows the new outstanding amount.

3. Pay the remaining balance again via `PUT /api/billing/1/pay`

#### Get Bill by Booking
- **GET** `http://localhost:8080/api/billing/booking/1`

---

### 6. ADMIN DASHBOARD

#### Get Dashboard Stats (Admin only)
- **GET** `http://localhost:8080/api/admin/dashboard`
- **Response:**
```json
{
  "totalBookings": 10,
  "totalRevenue": 5430.00,
  "activeGuests": 4
}
```

---

## Postman Quick-Start Flow

Follow this sequence to test the full flow:

1. **Add Admin to DB** → Insert admin user directly into SQLite `users` table with BCrypt password
2. **Register Guest** → `POST /api/auth/register`
3. **Login Admin** → `POST /api/auth/login` → `jwt` cookie is set automatically
4. **Create Rooms** → `POST /api/rooms` (cookie sent automatically)
5. **Create Services** → `POST /api/services/manage`
6. **Logout Admin** → `POST /api/auth/logout`
7. **Login Guest** → `POST /api/auth/login` → `jwt` cookie is now guest's
8. **Check Available Rooms** → `GET /api/rooms/available`
9. **Book a Room** → `POST /api/bookings`
10. **Request Services** → `POST /api/services/request`
11. **Generate Bill** → `POST /api/billing/generate/{bookingId}`
12. **Pay Bill** → `PUT /api/billing/{billingId}/pay`
13. **Request More Services** → `POST /api/services/request` (new services after payment)
14. **Refresh Bill** → `PUT /api/billing/refresh/{bookingId}` (pulls new charges into bill, status → PARTIALLY_PAID)
15. **Pay Remaining Balance** → `PUT /api/billing/{billingId}/pay`
16. **Logout Guest** → `POST /api/auth/logout`
14. **Login Admin** → `POST /api/auth/login`
15. **View Dashboard** → `GET /api/admin/dashboard`

---

## Error Response Format

```json
{
  "timestamp": "2025-07-20T10:30:00",
  "status": 400,
  "message": "Room is already booked for the selected dates"
}
```

## Validation Error Format

```json
{
  "timestamp": "2025-07-20T10:30:00",
  "status": 400,
  "errors": {
    "email": "must be a well-formed email address",
    "password": "must not be blank"
  }
}
```

---

## Role-Based Access Summary

| Endpoint                         | ADMIN | GUEST        |
|----------------------------------|-------|--------------|
| POST /api/rooms                  | ✅    | ❌           |
| PUT /api/rooms/{id}              | ✅    | ❌           |
| DELETE /api/rooms/{id}           | ✅    | ❌           |
| GET /api/rooms/available         | ✅    | ✅ (public)  |
| POST /api/bookings               | ✅    | ✅           |
| GET /api/bookings/my             | ✅    | ✅           |
| GET /api/bookings                | ✅    | ❌           |
| POST /api/services/manage        | ✅    | ❌           |
| DELETE /api/services/manage/{id} | ✅    | ❌           |
| POST /api/services/request       | ✅    | ✅           |
| POST /api/billing/generate/{id}  | ✅    | ✅           |
| PUT /api/billing/{id}/pay        | ✅    | ✅           |
| GET /api/admin/dashboard         | ✅    | ❌           |
