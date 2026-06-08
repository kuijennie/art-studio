// ============================================================
// BIT3208 — Week 5: Connecting to Database & Fetching Records
// Mongoose connection setup and querying the products collection
// Run with: node Week5db.js
// ============================================================

// ------------------------------------------------------------
// DEPENDENCIES
// npm install mongoose dotenv
// ------------------------------------------------------------
require("dotenv").config()
const mongoose = require("mongoose")

// ------------------------------------------------------------
// MONGOOSE CONNECTION SETUP
//
// PHP/SQL equivalent:
// <?php
//   $host     = getenv('DB_HOST');
//   $dbname   = getenv('DB_NAME');
//   $username = getenv('DB_USER');
//   $password = getenv('DB_PASS');
//
//   $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
//   echo "Connected to database.";
// ?>
// ------------------------------------------------------------
async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("MONGODB_URI is not set in .env")
    // PHP: if (!$pdo) die("Connection failed");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000, // timeout after 15 seconds
    family: 4,                       // force IPv4
  })

  console.log("[db] Connected to MongoDB — database: lalapj")
  // PHP: echo "Connected successfully";
}

// ------------------------------------------------------------
// PRODUCT SCHEMA & MODEL
//
// PHP/SQL equivalent:
// SQL: CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT,
//        name VARCHAR(255), slug VARCHAR(255) UNIQUE,
//        price DECIMAL(10,2), category VARCHAR(100),
//        image TEXT, description TEXT, tintColour VARCHAR(7));
// ------------------------------------------------------------
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },   // SQL: name VARCHAR(255) NOT NULL
    slug:        { type: String, required: true, unique: true }, // SQL: slug VARCHAR(255) UNIQUE
    price:       { type: Number, required: true },   // SQL: price DECIMAL(10,2) NOT NULL
    category:    { type: String, required: true },   // SQL: category VARCHAR(100)
    image:       { type: String, required: true },   // SQL: image TEXT
    description: { type: String, required: true },   // SQL: description TEXT
    tintColour:  { type: String, required: true },   // SQL: tintColour VARCHAR(7)
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
  // SQL: createdAt DATETIME DEFAULT NOW(), updatedAt DATETIME ON UPDATE NOW()
)

const Product = mongoose.model("Product", productSchema)

// ------------------------------------------------------------
// FETCH ALL PRODUCTS
//
// PHP/SQL equivalent:
// <?php
//   $stmt = $pdo->query("SELECT * FROM products");
//   $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
//   foreach ($products as $product) {
//     echo $product['name'] . ' — KSh ' . $product['price'];
//   }
// ?>
//
// SQL: SELECT * FROM products;
// ------------------------------------------------------------
async function getAllProducts() {
  console.log("\n" + "=".repeat(55))
  console.log("FETCH ALL PRODUCTS")
  console.log("SQL: SELECT * FROM products;")
  console.log("PHP: $stmt = $pdo->query(\"SELECT * FROM products\"); $products = $stmt->fetchAll();\n")

  const products = await Product.find()
  // PHP: $stmt->fetchAll(PDO::FETCH_ASSOC)

  console.log(`✓ Found ${products.length} product(s):`)
  products.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.slug}  —  ${p.name}  —  KSh ${p.price.toLocaleString()}  (${p.category})`)
  })

  return products
}

// ------------------------------------------------------------
// FETCH A SINGLE PRODUCT BY SLUG
//
// PHP/SQL equivalent:
// <?php
//   $slug = 'golden-horizon';
//   $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?");
//   $stmt->execute([$slug]);
//   $product = $stmt->fetch(PDO::FETCH_ASSOC);
//   echo $product['name'];
// ?>
//
// SQL: SELECT * FROM products WHERE slug = 'golden-horizon';
// ------------------------------------------------------------
async function getProductBySlug(slug) {
  console.log("\n" + "-".repeat(55))
  console.log("FETCH ONE PRODUCT BY SLUG")
  console.log(`SQL: SELECT * FROM products WHERE slug = '${slug}';`)
  console.log(`PHP: $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?"); $stmt->execute([$slug]);\n`)

  const product = await Product.findOne({ slug })
  // PHP: $stmt->fetch(PDO::FETCH_ASSOC)

  if (!product) {
    console.log(`  No product found with slug: ${slug}`)
    // PHP: if (!$product) { echo "Product not found"; }
    return null
  }

  console.log("✓ Product found:")
  console.log("  name       :", product.name)
  console.log("  slug       :", product.slug)
  console.log("  price      : KSh", product.price.toLocaleString())
  console.log("  category   :", product.category)
  console.log("  tintColour :", product.tintColour)
  console.log("  createdAt  :", product.createdAt)

  return product
}

// ------------------------------------------------------------
// FETCH PRODUCTS BY CATEGORY
//
// PHP/SQL equivalent:
// <?php
//   $category = 'painting';
//   $stmt = $pdo->prepare("SELECT * FROM products WHERE category = ?");
//   $stmt->execute([$category]);
//   $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
// ?>
//
// SQL: SELECT * FROM products WHERE category = 'painting' ORDER BY price ASC;
// ------------------------------------------------------------
async function getProductsByCategory(category) {
  console.log("\n" + "-".repeat(55))
  console.log("FETCH PRODUCTS BY CATEGORY")
  console.log(`SQL: SELECT * FROM products WHERE category = '${category}' ORDER BY price ASC;`)
  console.log(`PHP: $stmt->execute(['${category}']); $products = $stmt->fetchAll();\n`)

  const products = await Product.find({ category })
    .sort({ price: 1 })
  // PHP: ... ORDER BY price ASC

  console.log(`✓ Found ${products.length} product(s) in category '${category}':`)
  products.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.name}  —  KSh ${p.price.toLocaleString()}`)
  })

  return products
}

// ------------------------------------------------------------
// FETCH PRODUCTS WITH SELECTED FIELDS ONLY
//
// PHP/SQL equivalent:
// SQL: SELECT name, slug, price, category FROM products;
// PHP: $stmt = $pdo->query("SELECT name, slug, price, category FROM products");
// ------------------------------------------------------------
async function getProductSummaries() {
  console.log("\n" + "-".repeat(55))
  console.log("FETCH PRODUCTS — SELECTED FIELDS ONLY")
  console.log("SQL: SELECT name, slug, price, category FROM products;")
  console.log("PHP: $stmt = $pdo->query(\"SELECT name, slug, price, category FROM products\");\n")

  const products = await Product.find()
    .select("name slug price category")  // SQL: SELECT name, slug, price, category
    .lean()                              // returns plain JS objects (faster, no Mongoose overhead)

  console.log(`✓ ${products.length} product summaries:`)
  products.slice(0, 5).forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.name}  —  KSh ${p.price.toLocaleString()}  (${p.category})`)
  })
  if (products.length > 5) console.log(`  ... and ${products.length - 5} more`)

  return products
}

// ------------------------------------------------------------
// MAIN — run all fetch examples
// ------------------------------------------------------------
async function main() {
  try {
    await connectDB()

    await getAllProducts()
    await getProductBySlug("golden-horizon")
    await getProductsByCategory("painting")
    await getProductSummaries()

    console.log("\n" + "=".repeat(55))
    console.log("Week 5 complete — connection and fetch operations done.")

  } catch (err) {
    console.error("[error]", err.message)
  } finally {
    await mongoose.disconnect()
    // PHP: $pdo = null; (close connection)
    console.log("[db] Disconnected from MongoDB")
  }
}

main()
