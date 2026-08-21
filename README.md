# Local2Brand Platform Setup Instructions

Local2Brand is a digital agency platform + website marketplace designed for local businesses, built using React (JSX) + Vite + Tailwind CSS v4 on the frontend and Node.js + Express + MongoDB on the backend.

---

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Ensure local instance `mongodb://127.0.0.1:27017/local2brand` is running, or replace connection string in `backend/.env`)

---

## 1. Backend Setup & Seeding

1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Run database seed to inject 10+ premium website templates, case studies, admin credentials (`admin@local2brand.com`), and client user credentials (`john@gmail.com`):
   ```bash
   npm run seed
   ```
3. Start the Express development server:
   ```bash
   npm run start
   ```
   *The backend server will run on `http://localhost:5000`.*

---

## 2. Frontend Setup

1. Open a terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will run on `http://localhost:5173`.*

---

## 3. Credentials for Manual Verification

Use these accounts to explore the dashboards:

### Client User account:
- **Email**: `john@gmail.com`
- **Password**: `password123`

### Administrator account:
- **Email**: `admin@local2brand.com`
- **Password**: `password123`
