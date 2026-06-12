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
