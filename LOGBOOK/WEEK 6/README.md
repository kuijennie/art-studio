# WEEK 6: DATABASE INTEGRATION AND CRUD OPERATIONS

**Unit:** BIT3208 — Advanced Web and Development
**Student:** Jane Wangui Gichuhi
**Reg No:** BSCCS/2024/32659

---

## Fig 1: MongoDB Atlas Data Explorer showing the art studio products collection

![Fig 1](Screenshot%202026-06-18%20070319.png)

Fig 1: Shows the MongoDB Atlas Data Explorer with the `lalapj` database and `products` collection open, displaying 30 product documents stored in the database.

---

## Fig 2: Mongoose ProductSchema defining the structure of the products collection

![Fig 2](Screenshot%202026-06-18%20070617.png)

Fig 2: Shows the `ProductSchema` defined in `server/models/Product.ts` using Mongoose, outlining the fields — `slug`, `name`, `price`, `description`, `image`, `tint`, and `category` — each with type and validation rules.

---

## Fig 3: Terminal confirms successful MongoDB connection with server running on localhost:3001

![Fig 3](Screenshot%202026-06-18%20071531.png)

Fig 3: Terminal output confirms `[db] Connected to MongoDB` and `[server] http://localhost:3001`, verifying the Express server is running and successfully connected to the MongoDB database.

---

## Fig 4: Admin form used to add new artwork to the database (CREATE)

![Fig 4](Screenshot%202026-06-18%20072047.png)

Fig 4: Shows the Add New Artwork form in the admin dashboard at `localhost:5173/admin`, with fields filled in ready to be submitted. This form sends a POST request to the `/api/products` Express endpoint.

---

## Fig 5: Admin dashboard displays "Artwork added successfully!" confirming the CREATE operation

![Fig 5](Screenshot%202026-06-18%20073148.png)

Fig 5: Shows the green "Artwork added successfully!" banner after the form was submitted, confirming the new artwork document was inserted into the MongoDB `products` collection via `Product.create()`.

---

## Fig 6: MongoDB Atlas showing the newly added document in the products collection

![Fig 6](Screenshot%202026-06-18%20073438.png)

Fig 6: MongoDB Atlas Data Explorer displays the newly created product document, confirming the CREATE operation successfully persisted the data to the database with a generated `_id` and timestamps.

---

## Fig 7: Admin dashboard displays all artworks fetched from MongoDB (READ)

![Fig 7](Screenshot%202026-06-18%20073620.png)

Fig 7: Shows the admin products table listing all artworks retrieved from the database. This demonstrates the READ operation — the Express GET `/api/products` route calls `Product.find()` to fetch all documents and display them in the UI.

---

## Fig 8: Admin dashboard showing all products before performing the UPDATE operation

![Fig 8](Screenshot%202026-06-18%20074005.png)

Fig 8: Displays the full products list in the admin dashboard before an edit is applied, showing the current state of all records including names, categories, and prices.

---

## Fig 9: Admin dashboard displays "Artwork updated successfully!" confirming the UPDATE operation

![Fig 9](Screenshot%202026-06-18%20074244.png)

Fig 9: Shows the green "Artwork updated successfully!" banner after editing a product. The UPDATE operation sends a PUT request to `/api/products/:slug`, which calls `Product.findOneAndUpdate()` in MongoDB to modify the existing document.

---

## Fig 10: MongoDB Atlas confirms the product document was successfully updated

![Fig 10](Screenshot%202026-06-18%20074452.png)

Fig 10: MongoDB Atlas shows the updated `Fractured Light` document with the new price of `11000` and an updated `updatedAt` timestamp (`2026-06-18`), confirming the UPDATE operation was persisted to the database.

---

## Fig 11: Admin dashboard showing updated product price after the UPDATE operation

![Fig 11](Screenshot%202026-06-18%20074651.png)

Fig 11: The admin products list now reflects the updated price for `Fractured Light` (KSh 11,000), confirming the UI correctly re-fetches and displays the latest data from MongoDB after the update.

---

## Fig 12: Admin dashboard showing 29 artworks after the DELETE operation

![Fig 12](Screenshot%202026-06-18%20074820.png)

Fig 12: The admin dashboard now shows 29 artworks after a product was deleted. The DELETE operation sends a DELETE request to `/api/products/:slug`, which calls `Product.findOneAndDelete()` to permanently remove the document from MongoDB.

---

## Fig 13: MongoDB Atlas confirms the deleted document no longer exists in the collection

![Fig 13](Screenshot%202026-06-18%20075014.png)

Fig 13: MongoDB Atlas returns "No results" when searching for the deleted document by name, confirming the DELETE operation successfully removed the record from the `products` collection.

---

## Reflection

This week I applied Database Integration and CRUD operations using the MERN stack within my Art Studio project. Rather than PHP and MySQL, I used **MongoDB** as the database and **Express.js** as the server-side framework with **Mongoose** for schema definition and database interaction.

The `connectDB()` function in `server/db.ts` handles the database connection securely using environment variables. Full CRUD was implemented through RESTful API routes:

| Operation | HTTP Method | Route | Mongoose Method |
|---|---|---|---|
| Create | POST | `/api/products` | `Product.create()` |
| Read | GET | `/api/products` | `Product.find()` |
| Update | PUT | `/api/products/:slug` | `Product.findOneAndUpdate()` |
| Delete | DELETE | `/api/products/:slug` | `Product.findOneAndDelete()` |

The React-based admin dashboard provides a user-friendly interface for all four operations, with real-time feedback messages after each action and confirmation prompts before deletion. This week strengthened my understanding of how data flows between the frontend, backend API, and a NoSQL database in a full-stack web application.
