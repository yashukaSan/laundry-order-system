# 🧺 LaundryPro — Mini Laundry Order Management System

> A lightweight, fast, and fully functional order management system built for dry cleaning stores. Manage orders, track status, calculate billing, and monitor daily operations — all from a clean dashboard.

<br/>

## 🚀 Live Demo

🔗 **[laundry-order-system.vercel.app](https://laundry-order-system.vercel.app)** *(update this link after deployment)*

<br/>

## 📸 Screenshots

> *(Add screenshots here after deployment — Dashboard, Orders List, Create Order, Order Detail)*

<br/>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (no TypeScript) |
| Database | MongoDB Atlas + Mongoose |
| Styling | Tailwind CSS |
| Deployment | Vercel |

<br/>

## ✅ Features Implemented

- ✅ **Create Orders** — Customer name, phone, multiple garments with auto-calculated billing
- ✅ **Unique Order IDs** — Auto-generated format: `ORD-20240512-4821`
- ✅ **Estimated Delivery Date** — Auto-set to 3 days from order creation
- ✅ **Order Status Tracking** — `RECEIVED → PROCESSING → READY → DELIVERED`
- ✅ **Update Status** — One-click status update from the order detail page
- ✅ **View All Orders** — Paginated grid with card layout
- ✅ **Filter Orders** — By status, customer name, phone number, or garment type
- ✅ **Dashboard Stats** — Total orders, total revenue, breakdown by status, recent orders table
- ✅ **Delete Orders** — Full CRUD support
- ✅ **Input Validation** — Phone number format, required fields, valid garment types
- ✅ **Error Handling** — Proper HTTP status codes on all API routes
- ✅ **Responsive UI** — Works on mobile, tablet, and desktop

<br/>

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/yashukaSan/laundry-order-system.git
cd laundry-order-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user (username + password)
4. Go to **Network Access** → Add IP: `0.0.0.0/0` (allow all)
5. Go to **Connect** → Drivers → Node.js → Copy the connection string

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/laundry-db?retryWrites=true&w=majority
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

<br/>

## 🌍 Deploying to Vercel

1. Push your code to a **public GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. In **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |

4. Click **Deploy**
5. Done — your app is live ✅

<br/>

## 📁 Project Structure

```
laundry-order-system/
│
├── app/
│   ├── api/
│   │   ├── orders/
│   │   │   ├── route.js                 ← GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.js             ← GET (single), DELETE
│   │   │       └── status/
│   │   │           └── route.js         ← PATCH (update status)
│   │   └── dashboard/
│   │       └── route.js                 ← GET (stats)
│   │
│   ├── dashboard/page.js                ← Dashboard page
│   ├── orders/page.js                   ← Orders list page
│   ├── orders/create/page.js            ← Create order page
│   ├── orders/[id]/page.js              ← Order detail page
│   ├── layout.js                        ← Root layout + Navbar
│   └── globals.css                      ← Tailwind base styles
│
├── components/
│   ├── Navbar.jsx                       ← Top navigation
│   ├── OrderCard.jsx                    ← Order card for list view
│   ├── OrderForm.jsx                    ← Create order form
│   ├── StatusBadge.jsx                  ← Colored status pill
│   ├── FilterBar.jsx                    ← Search + filter controls
│   └── DashboardStats.jsx              ← Stats card grid
│
├── lib/
│   ├── mongodb.js                       ← MongoDB singleton connection
│   ├── priceConfig.js                   ← Hardcoded garment prices
│   └── generateOrderId.js              ← Unique order ID generator
│
├── models/
│   └── Order.js                         ← Mongoose schema
│
├── postman_collection.json              ← Ready-to-import API collection
├── jsconfig.json                        ← Path alias config (@/)
├── .env.example                         ← Sample environment file
└── README.md
```

<br/>

## 📡 API Reference

### Base URL (local)
```
http://localhost:3000/api
```

---

### Orders

#### `POST /api/orders` — Create Order

**Request Body:**
```json
{
  "customerName": "Rahul Sharma",
  "phoneNumber": "9876543210",
  "garments": [
    { "type": "Shirt", "quantity": 2 },
    { "type": "Saree", "quantity": 1 }
  ]
}
```

**Response `201`:**
```json
{
  "success": true,
  "orderId": "ORD-20240512-4821",
  "totalAmount": 140,
  "order": { "...full order object" }
}
```

---

#### `GET /api/orders` — List Orders

**Query Parameters:**

| Param | Example | Description |
|---|---|---|
| `status` | `?status=RECEIVED` | Filter by status |
| `search` | `?search=Rahul` | Search by customer name |
| `phone` | `?phone=9876543210` | Filter by phone |
| `garment` | `?garment=Shirt` | Filter by garment type |
| `page` | `?page=1&limit=10` | Pagination |

**Response `200`:**
```json
{
  "success": true,
  "total": 42,
  "page": 1,
  "totalPages": 5,
  "orders": [ "...array of orders" ]
}
```

---

#### `GET /api/orders/:id` — Get Single Order

**Response `200`:**
```json
{
  "success": true,
  "order": { "...full order object" }
}
```

---

#### `PATCH /api/orders/:id/status` — Update Status

**Request Body:**
```json
{ "status": "PROCESSING" }
```

Valid values: `RECEIVED` | `PROCESSING` | `READY` | `DELIVERED`

**Response `200`:**
```json
{
  "success": true,
  "message": "Status updated successfully",
  "order": { "...updated order" }
}
```

---

#### `DELETE /api/orders/:id` — Delete Order

**Response `200`:**
```json
{
  "success": true,
  "message": "Order \"ORD-20240512-4821\" deleted successfully"
}
```

---

### Dashboard

#### `GET /api/dashboard` — Get Stats

**Response `200`:**
```json
{
  "success": true,
  "totalOrders": 42,
  "totalRevenue": 8750,
  "byStatus": {
    "RECEIVED": 10,
    "PROCESSING": 15,
    "READY": 8,
    "DELIVERED": 9
  },
  "recentOrders": [ "...last 5 orders" ]
}
```

<br/>

## 💰 Garment Pricing

| Garment | Price (₹) |
|---|---|
| Shirt | 30 |
| T-Shirt | 25 |
| Pants | 40 |
| Kurta | 50 |
| Dress | 70 |
| Saree | 80 |
| Jacket | 100 |
| Blazer | 120 |
| Suit | 150 |
| Bedsheet | 60 |

> Prices are configured in `lib/priceConfig.js` — update them there to change across the entire app.

<br/>

## 🤖 AI Usage Report

### Tools Used

| Tool | How I Used It |
|---|---|
| **Claude (Anthropic)** | Initial scaffolding, API logic, component structure, bug fixes |
| **GitHub Copilot** | Inline autocompletion while writing boilerplate |

---

### Sample Prompts I Gave to AI

**Prompt 1 — API Route:**
> "Generate the POST /api/orders route for a Next.js 14 App Router project using Mongoose. It should validate customerName, a 10-digit phoneNumber, and a garments array. Look up price per item from a config object and calculate subtotals and total. Return orderId, totalAmount, and the full order."

**Prompt 2 — Dynamic Form Component:**
> "Create a React OrderForm component with dynamic add/remove garment rows. Each row has a garment type dropdown and quantity input. Show a live estimated total calculated on the client side. On submit, POST to /api/orders and show a success banner with the order ID."

**Prompt 3 — MongoDB Aggregation:**
> "Write a MongoDB aggregation using $facet to return total order count, sum of totalAmount as revenue, and count per status value — all in a single DB query."

**Prompt 4 — Bug Fix:**
> "My Next.js 14 app crashes on Vercel with 'Module not found: Can't resolve @/lib/mongodb'. How do I fix path aliases in a JavaScript Next.js project with no tsconfig?"

---

### What AI Got Right ✅

- Mongoose schema structure with proper enums and timestamps
- MongoDB `$facet` aggregation pattern — correct on first attempt
- Dynamic garment row add/remove logic in `OrderForm`
- Tailwind responsive class combinations
- Singleton MongoDB connection pattern with global cache

---

### What AI Got Wrong ❌ (and how I fixed it)

| Issue | AI's Mistake | My Fix |
|---|---|---|
| API route pattern | Generated `export default function handler(req, res)` (Pages Router) | Changed to `export async function GET(request)` (App Router) |
| params access | Used `params.id` directly in dynamic routes | Changed to `const { id } = await params` (Next.js 14 requirement) |
| Mongoose model | No re-registration guard | Added `mongoose.models.Order \|\| mongoose.model(...)` |
| Router import | Used `useRouter` from `next/router` | Changed to `next/navigation` |
| Server fetch | Fetched own API via `http://localhost:3000` from server components | Replaced with direct DB queries (required for Vercel) |
| React version | Used `use(params)` requiring React 19 | Replaced with `useParams()` (works in React 18) |
| Missing config | No `jsconfig.json` for path alias resolution | Added manually — Vercel build failed without it |

<br/>

## ⚖️ Tradeoffs

### What I Skipped (and why)

| Feature | Reason Skipped |
|---|---|
| Authentication | Out of scope for the 72-hour timeframe; adds significant complexity |
| Unit / integration tests | Prioritised working features over test coverage given time constraint |
| SMS notifications | Nice-to-have bonus; Twilio setup takes time and costs money |
| Optimistic UI updates | Not needed for a store-management tool used by one operator |

---

### What I'd Improve With More Time

- **Auth** — Add NextAuth.js with credentials provider (username/password for the store owner)
- **Payment status** — Track whether an order is paid or unpaid
- **Analytics** — Revenue by garment type, busiest days of the week
- **SMS alerts** — Notify customer via MSG91/Twilio when order status changes to READY
- **Print invoice** — Generate a printable bill PDF per order
- **Audit log** — Track who changed status and when

<br/>

## 📮 Postman Collection

A ready-to-import Postman collection is included in the repo root:

```
postman_collection.json
```

**To use:**
1. Open Postman → **Import** → select `postman_collection.json`
2. Set the `baseUrl` collection variable to `http://localhost:3000` (dev) or your Vercel URL (prod)
3. Run **Create Order** first to get a real `orderId`, then update the `orderId` variable

<br/>

## 📄 License

MIT — free to use, modify, and distribute.

---

<p align="center">Built with ❤️ using Next.js + MongoDB</p>
