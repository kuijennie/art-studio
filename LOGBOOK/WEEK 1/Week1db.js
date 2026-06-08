// ============================================================
// BIT3208 — Week 1: Introduction to Databases
// MongoDB equivalent of introductory database concepts
// ============================================================

// ------------------------------------------------------------
// WHAT IS A DATABASE?
// A database is an organised collection of structured data
// stored electronically, managed by a Database Management
// System (DBMS). It allows data to be stored, retrieved,
// updated and deleted efficiently.
// ------------------------------------------------------------

// ------------------------------------------------------------
// WHY ARE DATABASES IMPORTANT?
//  - Store large volumes of data reliably
//  - Allow multiple users to access data at the same time
//  - Enforce data integrity and reduce duplication
//  - Support fast querying and reporting
//  - Keep data secure with access controls
// ------------------------------------------------------------

// ------------------------------------------------------------
// RELATIONAL DATABASES (SQL) vs NoSQL DATABASES
//
//  Relational (SQL)            NoSQL (MongoDB)
//  ─────────────────────────   ──────────────────────────────
//  Data stored in TABLES       Data stored in COLLECTIONS
//  Rows = records              Documents = records (JSON-like)
//  Columns = fields            Fields inside each document
//  Fixed schema (rigid)        Flexible schema (dynamic)
//  Uses SQL language           Uses JavaScript / JSON queries
//  Examples: MySQL, PostgreSQL Examples: MongoDB, Firebase
// ------------------------------------------------------------

// ------------------------------------------------------------
// MySQL vs MongoDB — DIRECT COMPARISON
//
//  MySQL Concept         MongoDB Equivalent
//  ──────────────────    ──────────────────────────────────
//  DATABASE              Database
//  TABLE                 Collection
//  ROW                   Document
//  COLUMN                Field
//  PRIMARY KEY           _id (ObjectId, auto-generated)
//  JOIN                  $lookup (aggregation pipeline)
//  INDEX                 Index (createIndex)
//  VARCHAR / INT / DATE  String / Number / Date (BSON types)
//  AUTO_INCREMENT        ObjectId (automatic)
//  NULL                  null or omitted field
// ------------------------------------------------------------

// ------------------------------------------------------------
// EXAMPLE: What a "table" looks like in each system
//
//  MySQL — users table:
//  ┌────┬──────────┬───────────────────┐
//  │ id │ username │ email             │
//  ├────┼──────────┼───────────────────┤
//  │  1 │ jane     │ jane@example.com  │
//  │  2 │ john     │ john@example.com  │
//  └────┴──────────┴───────────────────┘
//
//  MongoDB — users collection document:
//  {
//    "_id":      ObjectId("6840e3b2f1a2c3d4e5f60001"),
//    "username": "jane",
//    "email":    "jane@example.com"
//  }
// ------------------------------------------------------------

// ------------------------------------------------------------
// TYPES OF NoSQL DATABASES
//
//  Type            Example         Best For
//  ──────────────  ──────────────  ─────────────────────────
//  Document        MongoDB         General-purpose apps
//  Key-Value       Redis           Caching, sessions
//  Column-Family   Cassandra       Time-series, analytics
//  Graph           Neo4j           Social networks, relationships
// ------------------------------------------------------------

// ------------------------------------------------------------
// SUMMARY
//  - SQL databases use tables with fixed schemas
//  - NoSQL databases (like MongoDB) use flexible documents
//  - MongoDB stores data as BSON (Binary JSON)
//  - MongoDB is a good fit for JavaScript / Node.js applications
//    because queries and data use the same JSON format
// ------------------------------------------------------------

console.log("Week 1 — Introduction to Databases")
console.log("Database Type  : MongoDB (NoSQL Document Store)")
console.log("Project DB Name: lalapj")
console.log("Collections    : users, products, orders")
