// ============================================================
// BIT3208 — Week 3: Creating Collections & Defining Structure
// Defining the schema for users, products and orders
// Run with: node Week3db.js
// ============================================================

const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/"

async function createCollections() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("lalapj") // SQL: USE lalapj;
    console.log("Connected to MongoDB — database: lalapj\n")

    // ==========================================================
    // COLLECTION 1: users
    // ==========================================================
    //
    // SQL equivalent:
    // CREATE TABLE users (
    //   id        INT          PRIMARY KEY AUTO_INCREMENT,
    //   clerkId   VARCHAR(255) UNIQUE,
    //   email     VARCHAR(255),
    //   username  VARCHAR(100) NOT NULL UNIQUE,
    //   password  VARCHAR(255),
    //   lastLogin DATETIME     DEFAULT NULL
    // );
    //
    await db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["username"],
          description: "SQL: CREATE TABLE users (...)",
          properties: {
            // _id is MongoDB's automatic PRIMARY KEY (ObjectId)
            // SQL: id INT PRIMARY KEY AUTO_INCREMENT
            clerkId: {
              bsonType: "string",
              description: "VARCHAR(255) UNIQUE — external auth provider ID (Clerk)",
            },
            email: {
              bsonType: "string",
              description: "VARCHAR(255) — user email address",
            },
            username: {
              bsonType: "string",
              maxLength: 100,
              description: "VARCHAR(100) NOT NULL UNIQUE — display name",
            },
            password: {
              bsonType: "string",
              description: "VARCHAR(255) — bcrypt-hashed password",
            },
            lastLogin: {
              bsonType: ["date", "null"],
              description: "DATETIME DEFAULT NULL — timestamp of last login",
            },
          },
        },
      },
    })

    // SQL: CREATE UNIQUE INDEX ON users(username);
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    // SQL: CREATE UNIQUE INDEX ON users(clerkId);
    await db.collection("users").createIndex({ clerkId: 1 }, { unique: true, sparse: true })

    console.log("✓ Collection defined: users")
    console.log("  Fields  : _id (PK), clerkId, email, username, password, lastLogin")
    console.log("  SQL     : CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, clerkId VARCHAR(255) UNIQUE, email VARCHAR(255), username VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(255), lastLogin DATETIME DEFAULT NULL)\n")


    // ==========================================================
    // COLLECTION 2: products
    // ==========================================================
    //
    // SQL equivalent:
    // CREATE TABLE products (
    //   id          INT           PRIMARY KEY AUTO_INCREMENT,
    //   name        VARCHAR(255)  NOT NULL,
    //   slug        VARCHAR(255)  NOT NULL UNIQUE,
    //   price       DECIMAL(10,2) NOT NULL,
    //   category    VARCHAR(100)  NOT NULL,
    //   image       TEXT          NOT NULL,
    //   description TEXT          NOT NULL,
    //   tintColour  VARCHAR(7)    NOT NULL
    // );
    //
    await db.createCollection("products", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "slug", "price", "category", "image", "description", "tintColour"],
          description: "SQL: CREATE TABLE products (...)",
          properties: {
            // _id: SQL → id INT PRIMARY KEY AUTO_INCREMENT
            name: {
              bsonType: "string",
              description: "VARCHAR(255) NOT NULL — display name of the artwork",
            },
            slug: {
              bsonType: "string",
              description: "VARCHAR(255) NOT NULL UNIQUE — URL-safe identifier e.g. 'golden-horizon'",
            },
            price: {
              bsonType: "number",
              description: "DECIMAL(10,2) NOT NULL — price in Kenyan Shillings (KES)",
            },
            category: {
              bsonType: "string",
              description: "VARCHAR(100) NOT NULL — e.g. painting, print, photography",
            },
            image: {
              bsonType: "string",
              description: "TEXT NOT NULL — full image URL",
            },
            description: {
              bsonType: "string",
              description: "TEXT NOT NULL — artwork description",
            },
            tintColour: {
              bsonType: "string",
              description: "VARCHAR(7) NOT NULL — hex accent colour e.g. '#c8a84b'",
            },
          },
        },
      },
    })

    // SQL: CREATE UNIQUE INDEX ON products(slug);
    await db.collection("products").createIndex({ slug: 1 }, { unique: true })
    // SQL: CREATE INDEX ON products(category);
    await db.collection("products").createIndex({ category: 1 })
    // SQL: CREATE INDEX ON products(price);
    await db.collection("products").createIndex({ price: 1 })

    console.log("✓ Collection defined: products")
    console.log("  Fields  : _id (PK), name, slug, price, category, image, description, tintColour")
    console.log("  SQL     : CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL UNIQUE, price DECIMAL(10,2) NOT NULL, category VARCHAR(100), image TEXT, description TEXT, tintColour VARCHAR(7))\n")


    // ==========================================================
    // COLLECTION 3: orders
    // ==========================================================
    //
    // SQL equivalent (simplified — line items would be a separate table):
    // CREATE TABLE orders (
    //   id         INT           PRIMARY KEY AUTO_INCREMENT,
    //   userId     VARCHAR(255)  NOT NULL,
    //   totalPrice DECIMAL(10,2) NOT NULL,
    //   createdAt  DATETIME      DEFAULT NOW()
    // );
    //
    // CREATE TABLE order_items (
    //   id        INT          PRIMARY KEY AUTO_INCREMENT,
    //   orderId   INT          NOT NULL REFERENCES orders(id),
    //   productId VARCHAR(255) NOT NULL,
    //   quantity  INT          NOT NULL DEFAULT 1,
    //   price     DECIMAL(10,2) NOT NULL
    // );
    //
    // In MongoDB, order items are embedded directly inside the
    // order document as an array — no join table needed.
    //
    await db.createCollection("orders", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "products", "totalPrice", "createdAt"],
          description: "SQL: CREATE TABLE orders (...) + CREATE TABLE order_items (...)",
          properties: {
            // _id: SQL → id INT PRIMARY KEY AUTO_INCREMENT
            userId: {
              bsonType: "string",
              description: "VARCHAR(255) NOT NULL — FOREIGN KEY → users._id",
            },
            products: {
              bsonType: "array",
              description: "Embedded array — replaces a JOIN to order_items table in SQL",
              items: {
                bsonType: "object",
                required: ["productId", "quantity", "price"],
                properties: {
                  productId: { bsonType: "string", description: "FOREIGN KEY → products._id" },
                  name:      { bsonType: "string", description: "Product name at time of order" },
                  quantity:  { bsonType: "number", description: "INT NOT NULL DEFAULT 1" },
                  price:     { bsonType: "number", description: "DECIMAL(10,2) — price at time of order" },
                },
              },
            },
            totalPrice: {
              bsonType: "number",
              description: "DECIMAL(10,2) NOT NULL — sum of all items",
            },
            createdAt: {
              bsonType: "date",
              description: "DATETIME DEFAULT NOW() — when the order was placed",
            },
          },
        },
      },
    })

    // SQL: CREATE INDEX ON orders(userId);
    await db.collection("orders").createIndex({ userId: 1 })
    // SQL: CREATE INDEX ON orders(createdAt);
    await db.collection("orders").createIndex({ createdAt: -1 })

    console.log("✓ Collection defined: orders")
    console.log("  Fields  : _id (PK), userId (FK), products (embedded array), totalPrice, createdAt")
    console.log("  SQL     : CREATE TABLE orders (id INT PRIMARY KEY AUTO_INCREMENT, userId VARCHAR(255) NOT NULL, totalPrice DECIMAL(10,2) NOT NULL, createdAt DATETIME DEFAULT NOW()) + order_items join table\n")

    console.log("=".repeat(55))
    console.log("All 3 collections created in database 'lalapj'.")
    console.log("Collections: users, products, orders")

  } catch (err) {
    // Collection already exists errors are safe to ignore on re-run
    if (err.codeName === "NamespaceExists") {
      console.log("Note: Collection already exists — skipping creation.")
    } else {
      console.error("Error:", err.message)
    }
  } finally {
    await client.close()
  }
}

createCollections()
