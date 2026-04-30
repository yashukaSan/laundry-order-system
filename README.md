# 🧺 LaundryPro — Mini Laundry Order Management System

A full-stack order management solution built for laundry businesses to track garments, manage order lifecycles, and view business analytics.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

---

## ✨ Features Implemented

- [x] **Dashboard Analytics**: Real-time stats for total orders, revenue, and status distribution.
- [x] **Dynamic Order Creation**: Multi-item garment rows with automatic subtotal and total calculation.
- [x] **Advanced Filtering**: Search by customer name, phone number, or filter by order status.
- [x] **Order Lifecycle Management**: Update orders through `RECEIVED`, `PROCESSING`, `READY`, and `DELIVERED` stages.
- [x] **Automated ID Generation**: Unique IDs generated in `ORD-YYYYMMDD-XXXX` format.
- [x] **Smart Estimates**: Automatic calculation of estimated delivery dates (3 days from creation).

---

## 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com
   cd laundry-order-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root and add:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_APP_NAME=LaundryPro
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

---

## 📑 API Documentation


| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/dashboard` | Get summary stats (revenue, counts per status). |
| **GET** | `/api/orders` | List all orders (supports `?status`, `?search`, `?phone`). |
| **POST** | `/api/orders` | Create a new laundry order. |
| **GET** | `/api/orders/[id]` | Get full details of a specific order. |
| **PATCH** | `/api/orders/[id]/status` | Update order status only. |
| **DELETE** | `/api/orders/[id]` | Remove an order record. |

---

## 🤖 AI Usage Report

- **Tools Used**: Claude AI / GitHub Copilot.
- **Sample Prompt**: *"Generate a Next.js 14 API route to update order status using Mongoose, ensuring params are awaited as per the new async pattern."*
- **What AI Got Right**: Component structure, Tailwind utility classes, and initial Mongoose schemas.
- **What I Fixed**: 
  - Fixed `params` access in dynamic routes (Next.js 14 requires `await params`).
  - Resolved Mongoose "Cannot overwrite model" errors by using `mongoose.models.Order`.
  - Corrected `next/navigation` imports which AI occasionally mixed up with `next/router`.

---

## ⚖️ Tradeoffs & Future Improvements

- **Tradeoff**: Used a static `priceConfig.js` for garment pricing to meet the 18-hour build estimate.
- **Improvement**: Implement a `Prices` collection in MongoDB for dynamic admin pricing.
- **Improvement**: Integrate Twilio for automated SMS alerts when order status moves to `READY`.

---

**License**: MIT  
**Deployment**: 
