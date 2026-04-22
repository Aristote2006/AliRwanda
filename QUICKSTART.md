# AliRwanda - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install-all
```

### Step 2: Setup Database

Make sure MongoDB is running on your system, then seed the database:

```bash
cd server
npm run seed
```

This will populate the database with realistic mock products.

### Step 3: Start the Application

```bash
# From the root directory
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) simultaneously.

**Open your browser and visit:** http://localhost:3000

---

## 📋 Alternative: Manual Start

If you prefer to start client and server separately:

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

---

## 🧪 Test the Application

1. **Browse Products**: Visit the home page to see featured and trending products
2. **Shop**: Navigate to the shop page and use filters
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Register**: Create a new account
5. **Checkout**: Complete a test order

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check your `.env` file has the correct `MONGODB_URI`

### Port Already in Use
- Backend (5000): Change `PORT` in `server/.env`
- Frontend (3000): Change `port` in `client/vite.config.js`

### Dependencies Issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Features to Test

✅ Dark mode toggle (top right corner)
✅ Mobile responsive design (resize browser)
✅ Product search and filters
✅ Shopping cart persistence
✅ User authentication
✅ Checkout process
✅ Toast notifications
✅ Loading states

---

## 🎯 Default Admin Account

To create an admin account, register normally then manually update in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@alirwanda.rw" },
  { $set: { role: "admin" } }
)
```

---

## 📦 Project Structure

```
AliRwanda/
├── client/          # React Frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/          # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── README.md
```

---

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Review API endpoints in the README
- Inspect browser console for frontend errors
- Check server terminal for backend errors

---

**Enjoy building with AliRwanda! 🎉**
