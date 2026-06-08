// ============================================================
// BIT3208 — Week 2: Database Creation
// Creating the lalapj database and its collections
// Run with: node Week2db.js
// ============================================================

const { MongoClient } = require("mongodb")

// ------------------------------------------------------------
// CONNECTION — connect to MongoDB
// SQL equivalent: (opening a connection to the MySQL server)
// ------------------------------------------------------------
const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/"

async function createDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB\n")

    // ----------------------------------------------------------
    // SELECT DATABASE
    // SQL: USE lalapj;  (or CREATE DATABASE lalapj; USE lalapj;)
    //
    // In MongoDB, a database is created automatically the first
    // time a collection is written to it. There is no separate
    // CREATE DATABASE command required.
    // ----------------------------------------------------------
    const db = client.db("lalapj") // SQL: CREATE DATABASE lalapj;
    console.log("Database selected: lalapj")
    console.log("(MongoDB creates it automatically on first write)\n")

    // ----------------------------------------------------------
    // CREATE COLLECTION: users
    // SQL: CREATE TABLE users (
    //        id       INT PRIMARY KEY AUTO_INCREMENT,
    //        username VARCHAR(100) NOT NULL,
    //        email    VARCHAR(255),
    //        password VARCHAR(255),
    //        lastLogin DATETIME
    //      );
    // ----------------------------------------------------------
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username"],
          properties: {
            clerkId:   { bsonType: "string",  description: "External auth provider ID" },
            email:     { bsonType: "string",  description: "User email address" },
            username:  { bsonType: "string",  description: "VARCHAR(100) NOT NULL" },
            password:  { bsonType: "string",  description: "Hashed password" },
            lastLogin: { bsonType: "date",    description: "DATETIME — last login timestamp" },
          },
        },
      },
    })
    console.log("✓ Collection created: users")
    console.log("  SQL: CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(100), ...)\n")

    // ----------------------------------------------------------
    // CREATE COLLECTION: products
    // SQL: CREATE TABLE products (
    //        id          INT PRIMARY KEY AUTO_INCREMENT,
    //        name        VARCHAR(255) NOT NULL,
    //        slug        VARCHAR(255) NOT NULL UNIQUE,
    //        price       DECIMAL(10,2) NOT NULL,
    //        category    VARCHAR(100),
    //        image       TEXT,
    //        description TEXT,
    //        tintColour  VARCHAR(7)
    //      );
    // ----------------------------------------------------------
    await db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "slug", "price"],
          properties: {
            name:        { bsonType: "string",  description: "VARCHAR(255) NOT NULL" },
            slug:        { bsonType: "string",  description: "VARCHAR(255) NOT NULL UNIQUE" },
            price:       { bsonType: "number",  description: "DECIMAL(10,2) — price in KES" },
            category:    { bsonType: "string",  description: "VARCHAR(100)" },
            image:       { bsonType: "string",  description: "TEXT — image URL" },
            description: { bsonType: "string",  description: "TEXT" },
            tintColour:  { bsonType: "string",  description: "VARCHAR(7) — hex colour e.g. #c8a84b" },
          },
        },
      },
    })
    console.log("✓ Collection created: products")
    console.log("  SQL: CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), slug VARCHAR(255) UNIQUE, ...)\n")

    // ----------------------------------------------------------
    // CREATE COLLECTION: orders
    // SQL: CREATE TABLE orders (
    //        id         INT PRIMARY KEY AUTO_INCREMENT,
    //        userId     INT NOT NULL,
    //        totalPrice DECIMAL(10,2) NOT NULL,
    //        createdAt  DATETIME DEFAULT NOW()
    //      );
    // ----------------------------------------------------------
    await db.createCollection("orders", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "totalPrice"],
          properties: {
            userId:     { bsonType: "string",  description: "FOREIGN KEY → users._id" },
            products:   { bsonType: "array",   description: "Array of ordered items" },
            totalPrice: { bsonType: "number",  description: "DECIMAL(10,2) NOT NULL" },
            createdAt:  { bsonType: "date",    description: "DATETIME DEFAULT NOW()" },
          },
        },
      },
    })
    console.log("✓ Collection created: orders")
    console.log("  SQL: CREATE TABLE orders (id INT PRIMARY KEY AUTO_INCREMENT, userId INT, totalPrice DECIMAL(10,2), createdAt DATETIME DEFAULT NOW())\n")

    // ----------------------------------------------------------
    // CREATE INDEXES
    // SQL: CREATE UNIQUE INDEX ON products(slug);
    //      CREATE INDEX ON orders(userId);
    // ----------------------------------------------------------
    await db.collection("products").createIndex({ slug: 1 }, { unique: true })
    console.log("✓ Index created: products.slug (unique)")
    console.log("  SQL: CREATE UNIQUE INDEX idx_slug ON products(slug);\n")

    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    console.log("✓ Index created: users.username (unique)")
    console.log("  SQL: CREATE UNIQUE INDEX idx_username ON users(username);\n")

    await db.collection("orders").createIndex({ userId: 1 })
    console.log("✓ Index created: orders.userId")
    console.log("  SQL: CREATE INDEX idx_userId ON orders(userId);\n")

    console.log("=".repeat(50))
    console.log("Database 'lalapj' created with 3 collections: users, products, orders")

  } catch (err) {
    console.error("Error:", err.message)
  } finally {
    await client.close()
  }
}

createDatabase()
