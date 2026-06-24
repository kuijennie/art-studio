# Week 7: User Authentication and Session Management

**Unit:** BIT3208 – Advanced Web and Development
**Student:** Jane Wangui Gichuhi | Reg No: BSCCS/2024/32659
**University:** Mount Kenya University – School of Computing and Informatics
**Lecturer:** Michael Nyoro | Year 4, Semester 2
**GitHub:** https://github.com/kuijennie/art-studio

---

## Overview

This week implements a complete, production-ready authentication system for the **ART STUDIO** e-commerce platform built on the MERN stack (MongoDB, Express.js, React, Node.js). The system replaces third-party authentication with a fully custom solution using JSON Web Tokens (JWT) and bcrypt password hashing.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, TanStack Router |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth Tokens | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs (cost factor 10) |

---

## Figure 1 – Login Form

The custom login page with email, password (show/hide toggle), Remember Me checkbox, and error handling. No third-party auth library — built entirely from scratch.

![Login Form](Screenshot%202026-06-24%20192921.png)

---

## Figure 2 – Login Error Handling

When incorrect credentials are entered, the server responds with `"Invalid email or password"` without revealing which field is wrong — a security best practice against enumeration attacks.

![Login Error](Screenshot%202026-06-24%20195213.png)

---

## Figure 3 – Welcome Message on Login

After a successful login, the user is redirected to the homepage and a welcome toast appears at the bottom of the screen showing the user's first name. This confirms the session is active.

![Welcome Message](Screenshot%202026-06-24%20194950.png)

---

## Figure 4 – Session and User Profile (Header Dropdown)

The header shows the authenticated user's initials avatar. Clicking it reveals the full name, email address, role badge (ADMIN), links to the dashboard, and a Sign Out button. This is role-based authorization in action.

![User Session Dropdown](Screenshot%202026-06-24%20193202.png)

---

## Figure 5 – Authenticated Homepage (Protected Access)

The homepage after login shows the user is authenticated — the header displays the initials pill, Admin link, and user name. Unauthenticated users see only a Sign In button instead.

![Authenticated Homepage](Screenshot%202026-06-24%20194337.png)

---

## Figure 6 – Password Hashing in MongoDB Atlas

The user document in MongoDB Atlas shows the password stored as a bcrypt hash (`$2b$10$...`), never as plain text. Also visible: fullname, email, role, lastLogin, createdAt — all the fields defined in the User schema.

![Hashed Password in MongoDB](Screenshot%202026-06-24%20193645.png)

---

## Authentication Workflow

```
1. User fills registration form (fullname, email, password)
         ↓
2. POST /api/auth/register
         ↓
3. Server hashes password with bcrypt (cost factor = 10)
         ↓
4. User document saved to MongoDB Atlas
         ↓
5. Server signs JWT: { userId, role } → expires in 7d or 30d (Remember Me)
         ↓
6. JWT returned to client → stored in localStorage or sessionStorage
         ↓
7. Client sends JWT as Authorization: Bearer <token> on protected requests
         ↓
8. Logout: JWT removed from storage → user redirected to homepage
```

---

## Database Schema

```javascript
// MongoDB Users Collection
{
  fullname:  String,   // required
  email:     String,   // required, unique, lowercase
  password:  String,   // bcrypt hash — never stored plain
  role:      String,   // 'customer' | 'admin'
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**SQL Equivalent (from course notes):**
```sql
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  fullname   VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,   -- stores bcrypt hash
  role       ENUM('customer','admin')  DEFAULT 'customer',
  last_login TIMESTAMP     NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Public (no auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user, returns JWT |
| `POST` | `/api/auth/login` | Login, returns JWT |

### Protected (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update name or password |

### Admin Only (JWT + role = admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List all registered users |
| `DELETE` | `/api/users/:id` | Delete a user account |
| `PATCH` | `/api/users/:id/role` | Promote or demote a user |

---

## Security Practices Implemented

| Threat | Mitigation |
|--------|-----------|
| Plain-text passwords | bcrypt hashing with cost factor 10 |
| Injection attacks | Mongoose parameterized queries |
| Session hijacking | Short-lived JWT + HTTPS in production |
| Brute force | Error message does not reveal which field failed |
| Credential exposure | Password field excluded from all API responses |
| Unauthorized access | `requireAuth` and `requireAdmin` middleware on protected routes |

---

## Bonus Features Implemented

| Feature | Details |
|---------|---------|
| Remember Me | JWT TTL: 30 days (checked) vs 7 days (unchecked) |
| Password Strength Meter | Live indicator: Too short / Weak / Medium / Strong |
| Show/Hide Password | Toggle button on all password fields |
| Role-Based Access | `customer` and `admin` roles with different permissions |
| Admin User Management | Promote, demote, and delete users from Admin Dashboard |
| Auto Admin Detection | Registering with the admin email auto-assigns the admin role |
| Welcome Toast | "Welcome back, [Name]!" shown on homepage after login |

---

## Weekly Reflection

**1. What is authentication?**
Authentication is verifying who a user is. Here, users prove identity by providing an email and password that matches the bcrypt hash stored in MongoDB.

**2. How does authorization differ from authentication?**
Authentication answers "Who are you?" Authorization answers "What can you do?" After authentication, the JWT carries a `role` field — `admin` users can access product/user management; `customer` users can only browse and shop.

**3. Why should passwords be hashed?**
If the database is breached, plain-text passwords would expose every user's credentials immediately. Bcrypt hashing is one-way — even with the hash, an attacker cannot recover the original password without brute-forcing it.

**4. What is the purpose of sessions/tokens?**
Once logged in, a user shouldn't re-enter credentials on every request. The JWT acts as a proof of identity — the server trusts any request carrying a valid, unexpired token without needing to query the database each time.

**5. Why are protected pages important?**
Without protection, any visitor could access the admin dashboard, manipulate products, or view user data. The `requireAdmin` middleware ensures only authenticated admin users can reach sensitive endpoints.

**6. What are the dangers of SQL/NoSQL injection?**
Injection attacks embed malicious input into database queries to bypass authentication or extract data. Mongoose's query API prevents raw string injection by design.

**7. How does logout improve security?**
Logout deletes the JWT from browser storage. Even if someone later accesses the browser, the token is gone and cannot be reused. This is especially important on shared or public devices.

---

## Deliverables Checklist

- [x] Source Code — `PROJECT/` folder
- [x] Database Schema — MongoDB schema + SQL equivalent above
- [x] README Documentation — this file
- [x] Fig 1: Login Form
- [x] Fig 2: Login Error Handling
- [x] Fig 3: Welcome Message after Login
- [x] Fig 4: User Session Dropdown (role-based UI)
- [x] Fig 5: Authenticated Homepage
- [x] Fig 6: Hashed Password in MongoDB Atlas
- [x] User Registration System
- [x] Secure Login with JWT
- [x] Password Hashing (bcrypt)
- [x] Token-Based Session Management
- [x] Protected Routes (admin-only access)
- [x] Logout Functionality
- [x] Role-Based Access Control
- [x] Remember Me (30-day token)
- [x] Password Strength Indicator
- [x] Admin User Management
