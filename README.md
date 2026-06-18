# Art Studio

**Mount Kenya University**
School of Computing and Informatics - Department of Information Technology

| Field | Details |
|---|---|
| Student | Jane Wangui Gichuhi |
| Reg No | BSCCS/2024/32659 |
| Unit Code | BIT3208 |
| Unit Title | Advanced Web and Development |
| Lecturer | Michael Nyoro |
| Semester | Year 4, Sem 2 |
| GitHub | [kuijennie/art-studio](https://github.com/kuijennie/art-studio/tree/main) |
| Project Document | [Advanced Web Final Report](https://eu.wps.com/cms/docs/d/cbPasrcgP08kXbiH) |

---

## Overview

Art Studio is a full-stack e-commerce web application for browsing and purchasing artwork online. The interface is designed to replicate the ambiance of a physical art museum, featuring a dynamic color theme that adapts to each artwork for an immersive gallery experience.

The system supports two roles:
- **Customer** - browse artworks, add to cart, checkout, and pay
- **Admin** - manage products (add, edit, delete) and view orders

---

## Technologies Used

| Frontend | Backend | Database | Auth & Payments | DevTools |
|---|---|---|---|---|
| React 19 | Express (Node.js) | MongoDB (Mongoose) | Clerk | Vite |
| TypeScript | PHP | MySQL | Stripe | XAMPP |
| TailwindCSS | | | | GitHub / Vercel |

---

## Features

- Dynamic gallery homepage with artwork browsing
- Product detail page with Add to Cart functionality
- Checkout with contact, shipping, and order summary
- Stripe payment integration
- Clerk authentication (sign in / sign up)
- Admin dashboard - full CRUD for artwork products
- Responsive design with dynamic background color theming per artwork

---

## Project Structure

```
ARTSTUDIO/
├── PROJECT/              # Main full-stack app (React + Express + MongoDB)
│   ├── src/              # React frontend (TanStack Router & Query)
│   ├── server/           # Express backend, Mongoose models, routes
│   │   ├── models/       # Product.ts, User.ts, Order.ts
│   │   ├── routes/       # API route handlers
│   │   ├── db.ts         # MongoDB connection via Mongoose
│   │   ├── seed.ts       # Database seeder
│   │   └── index.ts      # Server entry point
│   └── package.json
├── LOGBOOK/              # Weekly development logbooks
│   ├── WEEK 1/           # XAMPP setup, PHP Hello World, MySQL connection
│   ├── WEEK 2/           # UI wireframes, color theme, navigation design
│   ├── WEEK 3/           # JS form validation, PHP syntax & DB connection
│   ├── WEEK 4/           # PHP forms, registration/login, authentication
│   └── WEEK 5/           # MongoDB CRUD, Mongoose schemas, full-stack integration
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- A `.env` file inside `PROJECT/` with:

```env
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Install & Run

```bash
cd PROJECT
npm install
npm run dev
```

This starts both the Vite frontend and Express backend concurrently.

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend together |
| `npm run dev:client` | Vite frontend only |
| `npm run dev:server` | Express backend only |
| `npm run build` | Production build |
| `npm run seed` | Seed the database |
| `npm run createdb` | Run database creation script |
| `npm run crud-demo` | Run CRUD demo script |

---

## Weekly Logbook Summary

| Week | Topic | Key Activities |
|---|---|---|
| 1 | Local Dev Environment | Installed XAMPP, ran Apache & MySQL, tested PHP Hello World, connected PHP to MySQL |
| 2 | UI Planning & System Design | Designed wireframes, color theme, customer & admin navigation flows |
| 3 | Frontend & Backend Foundations | JS form validation, password strength checker, PHP syntax & dynamic input handling |
| 4 | Server-Side & Backend | PHP registration/login/contact forms, session-based authentication, backend folder structure |
| 5 | Database Systems | MongoDB Atlas, Mongoose schemas, full CRUD operations, connected to React frontend |
