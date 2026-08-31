# 👑 GourmetOS — Full-Stack Multi-Tenant Restaurant SaaS Platform
> **Managed & Powered by Local2Brand Agency**

A production-ready, white-label, multi-tenant Restaurant Ordering + Table Reservation + Kitchen Display System (KDS) + SaaS Platform built with the **MERN Stack** (React 19, Vite, Tailwind CSS v4, Framer Motion, Node.js, Express, MongoDB, Socket.io, Razorpay & jsPDF).

---

## 🌟 Key Architecture Highlights

1. **Multi-Tenant White-Label Core**: Strict tenant data isolation by subdomain/slug/header (`x-tenant-id`), complete custom branding, and dynamic theme engine.
2. **Visual Website Customizer (`/customizer`)**: Dual-pane builder with live responsive canvas (Desktop / Tablet / Mobile) to customize colors, fonts, hero banners, and section orders with real-time UI reflection.
3. **Four Dedicated Role Portals**:
   - 👑 **Developer / Super-Admin (`/developer`)**: SaaS Master Control, tenant provisioning wizard, global analytics.
   - 🏢 **Restaurant Owner / Admin (`/admin`)**: Executive KPI telemetry, Recharts revenue velocity, Menu & Variant builder, Table manager, Coupon engine, and BI insights.
   - 👨‍🍳 **Kitchen Staff / Chef (`/staff`)**: 3-Column Touch-friendly Live Kitchen Display System (KDS) with sound chimes and instant status transitions.
   - 👤 **Customer / Connoisseur (`/`)**: Cinematic hero, food customizer (portion variants + add-ons), slide-over cart, multi-step checkout, and live animated order tracking.
4. **Local2Brand Professional Tax Invoices**:
   - GST compliant (SAC 996331, CGST 2.5% + SGST 2.5%, FSSAI License, GSTIN).
   - High-res 2.5x retina **PDF Download (`Invoice_ORD-XXXX.pdf`)** and **80mm Thermal KOT Receipt** support.
5. **Real-Time Sockets**: Live order tracking updates and kitchen ticket updates via Socket.io.

---

## 🚀 Quick Start Guide

### 1. Installation
Run from the root directory:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run Both Frontend & Backend Simultaneously
```bash
npm run dev
```
- **Frontend Live**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Role Credentials (1-Click Login on `/login`)

| Role | Demo Email | Password | Landing Portal |
|---|---|---|---|
| **Developer Super-Admin** | `admin@antigravity.io` | `password123` | `/developer` |
| **Restaurant Owner** | `owner@royalspice.com` | `password123` | `/admin` |
| **Kitchen Chef** | `chef@royalspice.com` | `password123` | `/staff` |
| **Customer** | `soham@example.com` | `password123` | `/account` |

---

## 📁 Project Structure

```
├── frontend/                # React 19 + Vite + Tailwind v4 + Framer Motion
│   ├── src/
│   │   ├── components/     # Navbar, Footer, CartDrawer, InvoiceModal, AdminSidebar
│   │   ├── context/        # TenantContext, AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── customer/   # Home, Menu, Specials, Story, Offers, Reviews, Detail, Reserve, Checkout, Track, Account, Contact, Favorites
│   │   │   ├── customizer/ # Visual Website Customizer
│   │   │   ├── owner/      # Executive Dashboard, Orders, Products, Tables, Coupons, Analytics, Settings
│   │   │   ├── staff/      # Kitchen Display System (KDS)
│   │   │   ├── developer/  # SaaS Super-Admin & Client Provisioning
│   │   │   └── auth/       # Login & Register
│   │   └── utils/          # PDF Generator & Print Engine
│   └── package.json
│
├── backend/                 # Node.js + Express + Mongoose + Socket.io
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, Razorpay, Constants
│   │   ├── controllers/    # Auth, Restaurant, Product, Order, Payment, Table, Coupon, Review, Analytics
│   │   ├── middlewares/    # Auth (JWT), Tenant Resolver, RBAC Authorize, ErrorHandler
│   │   ├── models/         # Restaurant, User, Category, Product, Order, Table, Reservation, Coupon, Review
│   │   ├── routes/         # Master API Router
│   │   ├── sockets/        # Socket.io Event Handler
│   │   ├── seeds/          # Database Seeder
│   │   └── server.js       # Master Entrypoint
│   └── package.json
│
└── package.json            # Root Orchestrator (concurrently)
```

---

© 2026 **Local2Brand Agency** (www.local2brand.com). All Rights Reserved.
