# DAB Enterprise – Business Web Solution (BWS)

## Tech Stack
- **Frontend**: React.js + Tailwind CSS + React Router DOM + Axios
- **Backend**: Node.js + Express.js + MySQL
- **Auth**: Session-based login with bcrypt password hashing

---

## Setup Instructions

### 1. MySQL Database
1. Open phpMyAdmin (or MySQL CLI)
2. Run the `database.sql` file found in the root folder
3. This creates the `dab_enterprise` database with all tables
4. Default login: **username:** `admin` | **password:** `Admin@1234`

> ⚠️ If the default admin password doesn't work, run `generate-hash.js` (see step below)

---

### 2. Backend Setup

```bash
cd backend-project
npm install
```

Edit `.env` to set your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dab_enterprise
SESSION_SECRET=DABEnterpriseSecretKey2026!
PORT=5000
```

Start the backend:
```bash
npm run dev
```
Backend runs on: http://localhost:5000

---

### 3. Frontend Setup

```bash
cd frontend-project
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

### 4. Generate a New Admin Password (optional)

If you want to change the admin password:

```bash
cd backend-project
node generate-hash.js
```

Copy the output hash and update the `database.sql` INSERT, or run directly in MySQL:
```sql
UPDATE users SET Password='<new_hash>' WHERE UserName='admin';
```

---

## Project Structure

```
DAB_BWS/
├── database.sql                  ← Run this first in MySQL
├── backend-project/
│   ├── server.js                 ← Main entry point
│   ├── db.js                     ← MySQL connection
│   ├── .env                      ← Database & session config
│   ├── package.json
│   └── routes/
│       ├── auth.js               ← Login / logout
│       ├── product.js            ← Product CRUD
│       ├── sales.js              ← Sales CRUD + daily report
│       └── stockstatus.js        ← Stock CRUD
└── frontend-project/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.jsx               ← Routing + auth context
        ├── api/api.js            ← All Axios calls
        ├── components/
        │   └── Layout.jsx        ← Navbar + footer
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Products.jsx
            ├── Sales.jsx
            ├── StockStatus.jsx
            ├── SalesReport.jsx   ← Daily sales report
            └── StockReport.jsx   ← Stock status report
```

---

## Features
- ✅ Session-based login with encrypted password
- ✅ Product management (CRUD)
- ✅ Sales recording with auto total calculation
- ✅ Stock status tracking with low-stock alerts
- ✅ Daily Sales Report (filter by date, print)
- ✅ Stock Status Report (with status badges, print)
- ✅ Fully responsive (mobile + desktop)
- ✅ Tailwind CSS UI design
