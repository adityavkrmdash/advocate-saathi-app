# Advocate Saathi — API Documentation

Base URL: `http://localhost:5000/api`
ML Server: `http://localhost:8000`

---

## Authentication

All protected 🔒 routes require:
```
Authorization: Bearer <token>
```
Token is returned on login/signup.

---

## Auth Routes `/api/auth`

### POST `/api/auth/signup`
```json
Body:     { "name": "Aditya Vikram", "email": "a@b.com", "password": "abc123" }
Response: { "token": "eyJ...", "user": { "_id": "...", "name": "...", "plan": "free" } }
```

### POST `/api/auth/login`
```json
Body:     { "email": "a@b.com", "password": "abc123" }
Response: { "token": "eyJ...", "user": { ... } }
```

### GET `/api/auth/me` 🔒
```json
Response: { "user": { "_id": "...", "name": "...", "email": "...", "plan": "free" } }
```

### PATCH `/api/auth/me` 🔒
```json
Body:     { "name": "New Name", "language": "hi", "state": "Maharashtra" }
Response: { "user": { ... } }
```

---

## Chat Routes `/api/chat` 🔒

Three-step flow — call in order:

### Step 1 — POST `/api/chat/classify`
User describes problem → ML classifies it.
```json
Body:     { "text": "My employer has not paid salary for 3 months" }
Response: {
  "category": "labour",
  "confidence": 0.92,
  "followUpQuestions": ["Do you have an offer letter?", "How many months pending?", ...],
  "message": "Case classified as labour law."
}
```

### Step 2 — POST `/api/chat/fir-check`
Based on answers → decide FIR applicability.
```json
Body: {
  "category": "labour",
  "answers": {
    "q0": "Yes",
    "q1": "3",
    "q2": "No",
    "q3": "I have resigned"
  }
}
Response: {
  "firApplicable": true,
  "reason": "FIR applicable under IPC Section 406...",
  "recommendedAuthority": "Nearest Police Station + Labour Commissioner",
  "urgency": "high"
}
```

### Step 3 — POST `/api/chat/guidance`
Full action plan.
```json
Body: {
  "category": "labour",
  "firApplicable": true,
  "answers": { "q0": "Yes", ... }
}
Response: {
  "laws": ["Payment of Wages Act, 1936", "IPC Section 406"],
  "steps": ["Send demand notice...", "File complaint with Labour Commissioner..."],
  "documents": ["Offer letter", "Salary slips", ...],
  "firApplicable": true,
  "authority": "Nearest Police Station",
  "helplineNumbers": [{ "name": "Labour Helpline", "number": "1800-11-2200" }]
}
```

---

## Lawyer Routes `/api/lawyers`

### GET `/api/lawyers` (public)
Search lawyers by case type and location.

Query params:
| Param     | Example       | Description                          |
|-----------|---------------|--------------------------------------|
| category  | `labour`      | Case type to filter by               |
| city      | `Delhi`       | City name (partial match)            |
| state     | `Maharashtra` | State name                           |
| minRating | `4`           | Minimum average rating               |
| maxFee    | `1000`        | Max consultation fee in ₹            |
| page      | `1`           | Page number                          |
| limit     | `10`          | Results per page                     |

```json
Response: {
  "lawyers": [
    {
      "_id": "...",
      "name": "Adv. Rajesh Sharma",
      "specialisations": ["labour", "civil"],
      "experience": 12,
      "location": { "city": "Delhi", "state": "Delhi" },
      "averageRating": 4.5,
      "consultationFee": 500,
      "languages": ["Hindi", "English"],
      "isVerified": true
    }
  ],
  "total": 5,
  "page": 1
}
```

### GET `/api/lawyers/:id` (public)
Get full lawyer profile including reviews.

### POST `/api/lawyers/:id/review` 🔒
```json
Body:     { "rating": 5, "comment": "Very helpful and knowledgeable" }
Response: { "message": "Review added.", "averageRating": 4.6 }
```

### POST `/api/lawyers/seed` (dev only)
Seeds 5 dummy lawyers into the database for testing.
```json
Response: { "message": "5 lawyers seeded successfully." }
```

---

## Cases Routes `/api/cases` 🔒

### GET `/api/cases`
List user's saved cases.
Query: `status`, `category`, `page`, `limit`

### POST `/api/cases`
```json
Body: {
  "title": "Unpaid Salary – 3 Months",
  "category": "labour",
  "summary": "Employer refusing to pay after resignation.",
  "laws": ["Payment of Wages Act 1936"],
  "messages": [{ "role": "user", "content": "..." }]
}
```

### GET `/api/cases/:id`
Get full case with all messages.

### PATCH `/api/cases/:id`
Update status, append messages, etc.

### DELETE `/api/cases/:id`
Delete a case permanently.

---

## ML Server Routes (Python — port 8000)

### GET `/health`
```json
{ "status": "ok", "service": "Advocate Saathi ML Server" }
```

### POST `/classify`
```json
Body:     { "text": "My UPI was hacked" }
Response: { "category": "cyber", "confidence": 0.91, "followUpQuestions": [...] }
```

### POST `/fir-check`
```json
Body:     { "category": "cyber", "answers": { "q0": "yes", "q1": "45000" } }
Response: { "firApplicable": true, "reason": "...", "recommendedAuthority": "...", "urgency": "high" }
```

### POST `/guidance`
```json
Body:     { "category": "cyber", "firApplicable": true, "answers": {} }
Response: { "laws": [...], "steps": [...], "documents": [...], "helplineNumbers": [...] }
```

---

## Error Format

```json
{ "error": "Human-readable error message." }
```

| Code | Meaning                        |
|------|--------------------------------|
| 400  | Bad request / validation error |
| 401  | Not authenticated              |
| 403  | Not authorized                 |
| 404  | Not found                      |
| 409  | Conflict (duplicate email)     |
| 429  | Rate limit exceeded            |
| 500  | Server error                   |

---

## Rate Limits

| Endpoint      | Limit             |
|---------------|-------------------|
| All `/api/*`  | 100 req / 15 min  |
| `/api/chat/*` | 30 req / 1 min    |
