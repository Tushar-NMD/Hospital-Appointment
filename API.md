# MedCare API Documentation

Base URL: `http://localhost:3000/api`

All responses:
```json
{ "success": true, "data": { ... } }
// or
{ "success": false, "message": "Error text" }
```

Auth: Send JWT via `Authorization: Bearer <token>` header or `token` httpOnly cookie (set on login/register).

---

## Auth

### POST `/auth/register`
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "role": "patient",
  "photo": "data:image/jpeg;base64,..." 
}
```

### POST `/auth/login`
```json
{ "email": "patient@medcare.com", "password": "patient123" }
```

### GET `/auth/me`
Returns `{ user, doctorProfile? }`

### POST `/auth/logout`

---

## Upload

### POST `/upload/photo`
```json
{ "photo": "data:image/jpeg;base64,..." }
```
Returns `{ url: "https://res.cloudinary.com/..." }`

---

## Patient

### GET `/patients/me`
### PUT `/patients/me`
```json
{ "name": "...", "phone": "...", "photo": "data:... or url" }
```

---

## Doctors (patient)

### GET `/doctors?q=cardio`
### GET `/doctors/:id`
### GET `/doctors/:id/slots?date=2026-06-15`

---

## Doctor Profile

### GET `/doctors/me/profile`
### PUT `/doctors/me/profile`
```json
{
  "specialization": "Cardiology",
  "degree": "MBBS, MD",
  "experience": 10,
  "hospital": "Apollo Hospital",
  "bio": "...",
  "consultationFee": 1500,
  "availableDays": ["Monday", "Tuesday"],
  "availableTimeSlots": ["09:00 AM", "10:00 AM"],
  "image": "data:... or url"
}
```

---

## Appointments

### POST `/appointments`
```json
{
  "doctorId": "...",
  "date": "2026-06-15",
  "timeSlot": "09:00 AM",
  "symptoms": "Chest pain",
  "paymentMethod": "cash"
}
```

### GET `/appointments/patient`
### GET `/appointments/doctor?date=2026-06-15`
Returns `{ appointments, stats }`

### PATCH `/appointments/:id/status`
```json
{ "status": "confirmed", "notes": "optional" }
```

### PATCH `/appointments/:id/payment`
```json
{ "paymentStatus": "paid" }
```

---

## Seed demo data

```bash
npm run seed
```

Creates doctors + patient with passwords `doctor123` / `patient123`.

## Payment

### POST `/payment/create-order`
**Auth Required:** Patient

Creates a Razorpay order for appointment booking.

**Request:**
```json
{
  "amount": 500,
  "doctorId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "date": "2026-06-15",
  "timeSlot": "10:00 AM - 10:30 AM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_abc123",
      "amount": 50000,
      "currency": "INR",
      "receipt": "apt_1234567890"
    },
    "key": "rzp_test_xxxxx"
  }
}
```

---

## Razorpay Integration Flow

1. **Patient selects UPI payment method**
2. **Frontend calls** `/api/payment/create-order` to create Razorpay order
3. **Razorpay checkout opens** for payment
4. **On successful payment**, Razorpay returns:
   - `razorpay_payment_id`
   - `razorpay_order_id`
   - `razorpay_signature`
5. **Frontend sends these to** `/api/appointments` along with booking details
6. **Backend verifies payment signature** using HMAC SHA256
7. **If valid**, appointment is created with `paymentStatus: "paid"`

**Payment Verification:**
```javascript
const sign = order_id + "|" + payment_id;
const expectedSign = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(sign)
  .digest("hex");
  
if (razorpay_signature === expectedSign) {
  // Payment verified
}
```

---
