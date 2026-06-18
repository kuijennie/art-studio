// ============================================================
// BIT3208 — Week 4: CRUD Operations
// Create, Read, Update, Delete on products and users
// Run with: node Week4db.js
// ============================================================

const { MongoClient, ObjectId } = require("mongodb")

const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/"

async function crudOperations() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db       = client.db("lalapj") // SQL: USE lalapj;
    const products = db.collection("products")
    const users    = db.collection("users")
    console.log("Connected to MongoDB — database: lalapj\n")
    console.log("=".repeat(55))


    // ==========================================================
    // ── PRODUCTS CRUD ─────────────────────────────────────────
    // ==========================================================

    // ----------------------------------------------------------
    // CREATE — insert a new product
    // SQL: INSERT INTO products (name, slug, price, category, image, description, tintColour)
    //      VALUES ('Golden Horizon', 'golden-horizon', 48000, 'painting',
    //              'https://example.com/img.jpg', 'A warm abstract painting.', '#c8a84b');
    // ----------------------------------------------------------
    console.log("\nPRODUCTS — CREATE")
    console.log("SQL: INSERT INTO products (name, slug, price, ...) VALUES (...);")

    // Clean up any previous run first
    await products.deleteOne({ slug: "golden-horizon" })

    const insertResult = await products.insertOne({
      name:        "Golden Horizon",
      slug:        "golden-horizon",
      price:       48000,
      category:    "painting",
      image:       "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=400",
      description: "A warm abstract painting with gold and amber tones.",
      tintColour:  "#c8a84b",
    })
    console.log("✓ Product inserted:")
    console.log("  _id  :", insertResult.insertedId)
    console.log("  slug : golden-horizon")
    console.log("  price: KSh 48,000")


    // ----------------------------------------------------------
    // READ — fetch all products
    // SQL: SELECT * FROM products;
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nPRODUCTS — READ ALL")
    console.log("SQL: SELECT * FROM products;")

    const allProducts = await products.find({}).toArray()
    console.log(`✓ Found ${allProducts.length} product(s):`)
    allProducts.forEach((p, i) => {
      console.log(`  [${i + 1}] ${p.slug}  —  ${p.name}  —  KSh ${p.price.toLocaleString()}  (${p.category})`)
    })


    // ----------------------------------------------------------
    // READ — fetch one product by slug
    // SQL: SELECT * FROM products WHERE slug = 'golden-horizon';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nPRODUCTS — READ ONE")
    console.log("SQL: SELECT * FROM products WHERE slug = 'golden-horizon';")

    const oneProduct = await products.findOne({ slug: "golden-horizon" })
    console.log("✓ Product found:")
    console.log("  name      :", oneProduct.name)
    console.log("  price     : KSh", oneProduct.price.toLocaleString())
    console.log("  category  :", oneProduct.category)
    console.log("  tintColour:", oneProduct.tintColour)


    // ----------------------------------------------------------
    // READ — filter products by category
    // SQL: SELECT * FROM products WHERE category = 'painting';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nPRODUCTS — READ (FILTER BY CATEGORY)")
    console.log("SQL: SELECT * FROM products WHERE category = 'painting';")

    const paintings = await products.find({ category: "painting" }).toArray()
    console.log(`✓ Found ${paintings.length} painting(s)`)


    // ----------------------------------------------------------
    // UPDATE — update a product's price
    // SQL: UPDATE products SET price = 55000 WHERE slug = 'golden-horizon';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nPRODUCTS — UPDATE")
    console.log("SQL: UPDATE products SET price = 55000 WHERE slug = 'golden-horizon';")

    const updateResult = await products.updateOne(
      { slug: "golden-horizon" },       // SQL: WHERE slug = 'golden-horizon'
      { $set: { price: 55000 } }        // SQL: SET price = 55000
    )
    console.log("✓ Product updated:")
    console.log("  matched :", updateResult.matchedCount)
    console.log("  modified:", updateResult.modifiedCount)
    console.log("  old price: KSh 48,000")
    console.log("  new price: KSh 55,000")


    // ----------------------------------------------------------
    // DELETE — delete a product
    // SQL: DELETE FROM products WHERE slug = 'golden-horizon';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nPRODUCTS — DELETE")
    console.log("SQL: DELETE FROM products WHERE slug = 'golden-horizon';")

    const deleteResult = await products.deleteOne({ slug: "golden-horizon" })
    const stillExists  = await products.findOne({ slug: "golden-horizon" })
    console.log("✓ Product deleted:")
    console.log("  deletedCount:", deleteResult.deletedCount)
    console.log("  Still exists?", stillExists ? "YES" : "NO")


    // ==========================================================
    // ── USERS CRUD ────────────────────────────────────────────
    // ==========================================================
    console.log("\n" + "=".repeat(55))

    // ----------------------------------------------------------
    // CREATE — insert a new user
    // SQL: INSERT INTO users (username, email, password)
    //      VALUES ('jane', 'jane@example.com', 'hashedpassword123');
    // ----------------------------------------------------------
    console.log("\nUSERS — CREATE")
    console.log("SQL: INSERT INTO users (username, email, password) VALUES ('jane', 'jane@example.com', '...');")

    await users.deleteOne({ username: "jane" }) // clean up if re-running

    const newUser = await users.insertOne({
      username:  "jane",
      email:     "jane@example.com",
      password:  "hashedpassword123", // in production this would be bcrypt-hashed
      lastLogin: null,
    })
    console.log("✓ User inserted:")
    console.log("  _id     :", newUser.insertedId)
    console.log("  username: jane")
    console.log("  email   : jane@example.com")


    // ----------------------------------------------------------
    // READ — fetch all users (never return the password field)
    // SQL: SELECT id, username, email, lastLogin FROM users;
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nUSERS — READ ALL")
    console.log("SQL: SELECT id, username, email, lastLogin FROM users;")

    const allUsers = await users.find(
      {},
      { projection: { password: 0 } }  // SQL: omit password column
    ).toArray()
    console.log(`✓ Found ${allUsers.length} user(s):`)
    allUsers.forEach((u, i) => {
      console.log(`  [${i + 1}] ${u.username}  —  ${u.email}  —  lastLogin: ${u.lastLogin ?? "Never"}`)
    })


    // ----------------------------------------------------------
    // READ — fetch one user by username
    // SQL: SELECT id, username, email FROM users WHERE username = 'jane';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nUSERS — READ ONE")
    console.log("SQL: SELECT id, username, email FROM users WHERE username = 'jane';")

    const oneUser = await users.findOne(
      { username: "jane" },
      { projection: { password: 0 } }
    )
    console.log("✓ User found:")
    console.log("  username:", oneUser.username)
    console.log("  email   :", oneUser.email)


    // ----------------------------------------------------------
    // UPDATE — update a user's lastLogin timestamp
    // SQL: UPDATE users SET lastLogin = NOW() WHERE username = 'jane';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nUSERS — UPDATE")
    console.log("SQL: UPDATE users SET lastLogin = NOW() WHERE username = 'jane';")

    const userUpdate = await users.updateOne(
      { username: "jane" },
      { $set: { lastLogin: new Date() } }  // SQL: SET lastLogin = NOW()
    )
    console.log("✓ User updated:")
    console.log("  matched :", userUpdate.matchedCount)
    console.log("  modified:", userUpdate.modifiedCount)
    console.log("  lastLogin set to:", new Date().toISOString())


    // ----------------------------------------------------------
    // DELETE — delete a user by username
    // SQL: DELETE FROM users WHERE username = 'jane';
    // ----------------------------------------------------------
    console.log("\n" + "-".repeat(55))
    console.log("\nUSERS — DELETE")
    console.log("SQL: DELETE FROM users WHERE username = 'jane';")

    const userDelete  = await users.deleteOne({ username: "jane" })
    const userCheck   = await users.findOne({ username: "jane" })
    console.log("✓ User deleted:")
    console.log("  deletedCount:", userDelete.deletedCount)
    console.log("  Still exists?", userCheck ? "YES" : "NO")

    console.log("\n" + "=".repeat(55))
    console.log("All CRUD operations complete for products and users.")

  } catch (err) {
    console.error("Error:", err.message)
  } finally {
    await client.close()
  }
}

crudOperations()
