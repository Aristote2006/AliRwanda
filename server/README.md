# AliRwanda Server - Quick Reference

## 🚀 Quick Start

### 1. Start MongoDB
```bash
mongod
```

### 2. Seed Database
```bash
cd server
npm run seed
```

### 3. Start Server
```bash
npm run dev
```

---

## 📦 Available Scripts

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm run seed     # Seed database with mock products
```

---

## 🔧 Environment Variables

Create `.env` file in `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alirwanda
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### MongoDB Atlas (Production)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/alirwanda?retryWrites=true&w=majority
```

---

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/top` - Get top rated products
- `GET /api/products/related/:id` - Get related products

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── error.js           # Error handler
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── orderRoutes.js
├── .env                   # Environment variables
├── .env.example           # Example env file
├── server.js              # Entry point
├── seed.js                # Database seeder
└── package.json
```

---

## 🔐 Authentication

### Register
```bash
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/users/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Use Token
```bash
Authorization: Bearer <token>
```

---

## 🎯 Filter Products

### Query Parameters
```
GET /api/products?category=Electronics&minPrice=100&maxPrice=1000&sort=price_asc
```

**Available Filters:**
- `category` - Electronics, Fashion, Home, Sports, Books, Beauty
- `search` - Text search
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `rating` - Minimum rating (1-5)
- `sort` - price_asc, price_desc, rating, newest
- `pageNumber` - Page number (default: 1)

---

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin'
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  images: [String],
  category: String,
  rating: Number,
  numReviews: Number,
  countInStock: Number,
  isFeatured: Boolean,
  isTrending: Boolean
}
```

### Order
```javascript
{
  user: ObjectId (ref: 'User'),
  orderItems: [{
    name: String,
    qty: Number,
    image: String,
    price: Number,
    product: ObjectId
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean,
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
}
```

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Auth**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: express-validator
- **Logging**: morgan
- **CORS**: cors

---

## 🔍 Modern Features

✅ ES Modules (import/export)
✅ No deprecated MongoDB options
✅ Async/await throughout
✅ Centralized error handling
✅ JWT authentication middleware
✅ Role-based access control
✅ Clean console output with emojis
✅ Connection timeout handling
✅ Graceful error messages

---

## 📝 Code Style

### Import Order
```javascript
// 1. External packages
import express from 'express';
import mongoose from 'mongoose';

// 2. Internal modules (with .js extension)
import connectDB from './config/db.js';
import Product from './models/Product.js';

// 3. Named exports
import { protect, admin } from './middleware/auth.js';
```

### Export Pattern
```javascript
// Default export
export default connectDB;

// Named exports
export { protect, admin };
```

---

## 🆘 Common Issues

### MongoDB Not Running
```
❌ Database connection error: connect ECONNREFUSED
```
**Solution:** Start MongoDB with `mongod`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill the process

### JWT Token Expired
```
Not authorized, token failed
```
**Solution:** Login again to get new token

---

## 📊 Server Info

- **Port**: 5000 (default)
- **Environment**: development/production
- **Node Version**: 14+
- **ES Modules**: Yes (`"type": "module"`)

---

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Happy Coding! 🚀**
