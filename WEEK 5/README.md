# Week 5: MongoDB Integration, Full-Stack CRUD 

## Objective
Crud operations, database connections, database creations using MongoDB

---

## Fig 1 – Databse creation


**Code Snippet**
```ts
await connectDB()
await Product.deleteMany({})
await Product.insertMany(products)
console.log(`✓ Seeded ${products.length} products into MongoDB`)
```

**Evidence**

![Fig 1 – MongoDB Atlas Data Explorer showing the products collection with documents](Screenshot%202026-06-03%20201454.png)

---

## Fig 2 – Mongoose Schema Definition (Product Model)

**File:** `PROJECT/server/models/Product.ts`

Mongoose schemas define the shape of each document and enforce types - the equivalent of a SQL `CREATE TABLE` statement. The `{ timestamps: true }` option automatically adds `createdAt` and `updatedAt` to every document.

**Code Snippet**
```ts
// SQL equivalent: CREATE TABLE products (slug VARCHAR PRIMARY KEY, name VARCHAR, price NUMBER, ...)
const ProductSchema = new Schema<IProduct>(
  {
    slug:        { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    description: { type: String, required: true },
    image:       { type: String, required: true },
    tint:        { type: String, required: true },
    category:    { type: String, required: true },
  },
  { timestamps: true }
)
export const Product = mongoose.model<IProduct>('Product', ProductSchema)
```

**Evidence**

![Fig 2 – VS Code showing the Mongoose ProductSchema definition in Product.ts](Screenshot%202026-06-03%20203627.png)

---

## Fig 3 – MongoDB Connection & Server Startup

**File:** `PROJECT/server/db.ts`

A single `connectDB()` function wraps the Mongoose connection. The main server (`index.ts`) calls it on startup and only begins listening for requests once the database is ready.

**Code Snippet**
```ts
// db.ts
export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set in .env')

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  })
  console.log('[db] Connected to MongoDB')
}

// index.ts — only start the server after DB connects
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] http://localhost:${PORT}`))
})
```

**Evidence**

![Fig 3 – VS Code showing the connectDB function in db.ts](Screenshot%202026-06-03%20211925.png)

![Fig 3 – Terminal showing successful server startup: [db] Connected to MongoDB and [server] http://localhost:3001](Screenshot%202026-06-03%20212100.png)

---

## Fig 4 – CRUD Demo: CREATE

**File:** `PROJECT/server/crud-demo.ts`

The `CREATE` operation inserts a new document into the `products` collection. The terminal output mirrors what a SQL `INSERT` statement would produce.

**Code Snippet**
```ts
// SQL: INSERT INTO products(slug, name, price, category) VALUES('demo-art', 'Demo Art', 5000, 'painting');
const newProduct = await Product.create({
  slug: 'demo-art', name: 'Demo Art', price: 5000,
  description: 'A demo artwork for CRUD demonstration.',
  image: 'https://images.unsplash.com/...', tint: '#c8a84b', category: 'painting',
})
console.log(`✓ Product created: ${newProduct.slug} — KSh ${newProduct.price.toLocaleString()}`)
```

**Evidence**

![Fig 4 – Terminal output showing the CREATE operation result with _id, slug, name, price, category and createdAt](Screenshot%202026-06-03%20210157.png)

---

## Fig 5 – CRUD Demo: READ

The `READ` operation fetches all products from the collection using `Product.find()`. The `.select()` method limits which fields are returned — the same as naming columns in a SQL `SELECT`.

**Code Snippet**
```ts
// SQL: SELECT slug, name, price, category FROM products;
const allProducts = await Product.find()
  .select('slug name price category')
  .lean()

console.log(`✓ Found ${allProducts.length} products:`)
allProducts.forEach((p, i) => {
  console.log(`  [${i + 1}] ${p.slug}  —  ${p.name}  —  KSh ${p.price.toLocaleString()}  (${p.category})`)
})
```

**Evidence**

![Fig 5 – Terminal output showing the READ operation listing all 31 products with slug, name, price and category](Screenshot%202026-06-03%20210834.png)

---

## Fig 6 – CRUD Demo: UPDATE

The `UPDATE` operation fetches a document by slug, changes a field, then calls `.save()`. Mongoose re-runs validators and the pre-save hook before writing to the database.

**Code Snippet**
```ts
// SQL: UPDATE products SET price = 7500 WHERE slug = 'demo-art';
const product = await Product.findOne({ slug: 'demo-art' })
product.price = 7500
await product.save()
console.log(`✓ Price updated: KSh 5,000 → KSh ${product.price.toLocaleString()}`)
```

**Evidence**

![Fig 6 – Terminal output showing the UPDATE operation with old price KSh 5,000 changed to KSh 7,500 and updatedAt timestamp](Screenshot%202026-06-03%20211056.png)

---

## Fig 7 – CRUD Demo: DELETE

The `DELETE` operation removes the document from the collection. The final check (`Product.findOne`) confirms it no longer exists.

**Code Snippet**
```ts
// SQL: DELETE FROM products WHERE slug = 'demo-art';
await Product.deleteOne({ slug: 'demo-art' })
const check = await Product.findOne({ slug: 'demo-art' })
console.log(`✓ Product deleted. Still exists? ${check ? 'YES' : 'NO'}`)
```

**Evidence**

![Fig 7 – Terminal output confirming the DELETE operation: Product deleted. Still exists? NO](Screenshot%202026-06-03%20211307.png)

---

## Fig 8 –  Fetching Database Records

**File:** `PROJECT/server/routes/products.ts`


**Code Snippet**
```ts
// GET /api/products        — SQL: SELECT * FROM products
router.get('/products', async (_, res) => {
  const products = await Product.find().lean()
  res.json(products)
})

// GET /api/products/:slug  — SQL: SELECT * FROM products WHERE slug = ?
router.get('/products/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).lean()
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
})

// PUT /api/products/:slug  — SQL: UPDATE products SET ... WHERE slug = ?
router.put('/products/:slug', async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { slug: req.params.slug }, req.body, { new: true, runValidators: true }
  )
  res.json(product)
})

// DELETE /api/products/:slug — SQL: DELETE FROM products WHERE slug = ?
router.delete('/products/:slug', async (req, res) => {
  await Product.findOneAndDelete({ slug: req.params.slug })
  res.json({ ok: true })
})
```

**Evidence**

![Fig 8 – VS Code showing the GET /products and GET /products/:slug route handlers in products.ts](Screenshot%202026-06-03%20212534.png)

---

## Fig 9 – Admin Dashboard: READ DEMO

**File:** `PROJECT/src/pages/AdminPage.tsx`

The Products tab in the admin dashboard displays all artworks fetched live from the MongoDB API. Each row shows a thumbnail, name, slug, category (with tint dot), price, and Edit / Delete action buttons.

**Code Snippet**
```ts
// TanStack Query — fetches from GET /api/products and caches the result
export function useProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiFetch<Product[]>('/api/products'),
  })
  return { data: data ?? [], isLoading }
}
```

**Evidence**

![Fig 9 – Admin dashboard Products tab showing the list of artworks with thumbnail, name, category, price and Edit/Delete actions](Screenshot%202026-06-03%20210905.png)

---

## Fig 10 – Admin Dashboard: CREATE DEMO

Clicking **+ Add Artwork** reveals an inline form. All required fields (name, slug, price, category, image URL, tint colour, description) must be filled before the record is saved to MongoDB via a `POST /api/products` request.

**Code Snippet**
```ts
// Mutation — POST /api/products, then invalidates cache to refresh the list
export function useCreateProduct() {
  const qc = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: ProductFields) =>
      apiFetch<Product>('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  return { mutateAsync, isPending }
}
```

**Evidence**

![Fig 10 – Admin dashboard showing the Add New Artwork form with name, slug, price, category, image URL, tint colour and description fields](Screenshot%202026-06-03%20210639.png)

---

## Fig 11 – Admin Dashboard: UPDATE DEMO

Clicking **Edit** on any row pre-fills the same form with that product's current values. Saving sends a `PUT /api/products/:slug` request and the list refreshes automatically. The slug field is disabled in edit mode to prevent breaking existing links.

**Code Snippet**
```ts
// Mutation — PUT /api/products/:slug
export function useUpdateProduct() {
  const qc = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<ProductFields> }) =>
      apiFetch<Product>(`/api/products/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
  return { mutateAsync, isPending }
}
```

**Evidence**

![Fig 11 – Admin dashboard showing the edit form pre-filled with Fractured Light's existing values including image preview](Screenshot%202026-06-03%20211154.png)

---

## Fig 12 – Admin Dashboard: DELETE DEMO

Clicking **Delete** replaces the action buttons with inline **Confirm** / **Cancel** buttons to prevent accidental deletion. Confirming sends a `DELETE /api/products/:slug` request and removes the row from the list.

**Code Snippet**
```ts
// Inline delete confirmation state
const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

async function handleDelete(slug: string) {
  await del.mutateAsync(slug)   // DELETE /api/products/:slug
  setDeleteConfirm(null)
}

// In the row — swap Edit/Delete for Confirm/Cancel when deleteConfirm matches
{deleteConfirm === product.slug ? (
  <>
    <button onClick={() => handleDelete(product.slug)}>Confirm</button>
    <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
  </>
) : (
  <button onClick={() => setDeleteConfirm(product.slug)}>Delete</button>
)}
```

**Evidence**

![Fig 12 – Admin dashboard showing the delete confirmation with Confirm and Cancel buttons highlighted on a row](Screenshot%202026-06-03%20211348.png)

---

## Summary

| Task | Technology | SQL Equivalent |
|---|---|---|
| Database creation | `createdb.ts` + Mongoose | `CREATE DATABASE` / `CREATE TABLE` |
| Schema definition | Mongoose `Schema` | `CREATE TABLE` with column types |
| CRUD demo (products) | `crud-demo.ts` | `INSERT`, `SELECT`, `UPDATE`, `DELETE` |
| Product REST API | Express routes | REST endpoints over HTTP |
| MongoDB connection | `db.ts` + Mongoose | Database connection string |
| Admin dashboard | React + TanStack Query | Full-stack CMS interface |
