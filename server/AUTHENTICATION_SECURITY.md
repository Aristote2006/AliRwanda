# 🔐 AliRwanda Authentication & Security System

## ✅ Implementation Complete

This document outlines the production-ready authentication and role management system implemented for AliRwanda e-commerce platform.

---

## 🎯 Security Features Implemented

### 1. **User Model Security**
- ✅ Password field has `select: false` - never returned in queries by default
- ✅ Automatic password hashing via `pre('save')` middleware
- ✅ Only hashes password if modified (prevents double-hashing)
- ✅ `toJSON()` method removes sensitive fields from responses
- ✅ Email is automatically lowercased and trimmed
- ✅ Password validation (minimum 6 characters)
- ✅ Account active/inactive status tracking

### 2. **Registration System** 🔒
```javascript
// SECURITY: Role is HARDCODED to 'user'
const user = await User.create({
  name,
  email,
  password,
  role: 'user', // ← Cannot be changed by frontend
});
```

**Security Measures:**
- ❌ Frontend CANNOT specify role
- ✅ All new users are automatically `role: 'user'`
- ✅ Input validation for required fields
- ✅ Password strength validation
- ✅ Duplicate email check

### 3. **Admin User Creation** 🛡️
**Admin credentials:**
- Email: `admin@alirwanda.com`
- Password: `Admin@123`

**Created via secure seed script ONLY:**
```bash
npm run seed:admin
```

**Security:**
- ✅ Password properly hashed with bcrypt (salt rounds: 10)
- ✅ Admin created server-side only
- ✅ Cannot be created through registration
- ✅ Verification confirms password is hashed

### 4. **Login System** 🔑
```javascript
// JWT token contains BOTH userId and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
```

**Security Features:**
- ✅ Password explicitly selected for comparison: `.select('+password')`
- ✅ Uses `bcrypt.compare()` for secure password verification
- ✅ JWT contains user role for authorization
- ✅ Checks if account is active before allowing login
- ✅ Generic error messages (prevents email enumeration)
- ✅ Returns user info WITHOUT password

### 5. **Authentication Middleware** 🚦

#### `protect` Middleware
```javascript
// Verifies JWT token and attaches user to request
const protect = async (req, res, next) => {
  // 1. Extracts token from Authorization header
  // 2. Verifies token validity and expiration
  // 3. Fetches user from database
  // 4. Checks if user account is active
  // 5. Attaches user to req.user
}
```

**Security Checks:**
- ✅ Token existence validation
- ✅ JWT signature verification
- ✅ Token expiration check
- ✅ User existence verification
- ✅ Account active status check
- ✅ Specific error messages for different failure types

#### `admin` Middleware
```javascript
// Restricts access to admin users ONLY
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};
```

**Security:**
- ✅ Must be used AFTER `protect` middleware
- ✅ Verifies user role is exactly `'admin'`
- ✅ Returns 403 Forbidden for non-admin users

### 6. **Route Protection** 🛣️

#### Public Routes (No Auth Required)
```
POST   /api/users/register
POST   /api/users/login
GET    /api/products/*
GET    /api/products/categories
```

#### Protected Routes (Login Required)
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/orders
GET    /api/orders/myorders
GET    /api/orders/:id
PUT    /api/orders/:id/pay
```

#### Admin-Only Routes (Admin Role Required)
```
POST   /api/products          (Create product)
PUT    /api/products/:id      (Update product)
DELETE /api/products/:id      (Delete product)
GET    /api/products/stats    (View statistics)
GET    /api/orders            (View all orders)
PUT    /api/orders/:id/deliver (Mark as delivered)
```

**Example:**
```javascript
router.route('/')
  .get(getProducts)                    // Public
  .post(protect, admin, createProduct); // Admin only

router.route('/:id')
  .get(getProductById)                 // Public
  .put(protect, admin, updateProduct)  // Admin only
  .delete(protect, admin, deleteProduct); // Admin only
```

### 7. **Frontend Role-Based Routing** 🎨

#### Login Flow
```javascript
// After successful login
const userInfo = localStorage.getItem('userInfo')
const user = JSON.parse(userInfo)

if (user.role === 'admin') {
  navigate('/admin')      // Admin → Admin Dashboard
} else {
  navigate('/dashboard')  // User → Customer Dashboard
}
```

#### Route Protection
```javascript
// AdminRoute.jsx
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  return user && user.role === 'admin' ? children : <Navigate to="/" />
}

// PrivateRoute.jsx  
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  return user ? children : <Navigate to="/login" />
}
```

### 8. **Security Rules** 📜

#### ✅ DO:
- Always hash passwords with bcrypt
- Store JWT in localStorage with user info
- Verify token on every protected route
- Use `protect` middleware before `admin` middleware
- Return generic error messages for login failures
- Check account active status
- Exclude password from API responses
- Validate all user inputs

#### ❌ NEVER:
- Accept role from frontend registration
- Expose password in API responses
- Trust client-side role validation
- Allow role changes through profile updates
- Store passwords in plain text
- Use weak passwords (min 6 chars enforced)
- Allow double-hashing of passwords

---

## 🧪 Testing the System

### 1. **Create Admin User**
```bash
cd server
npm run seed:admin
```

### 2. **Test Registration (User Role Only)**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",  // ← Always 'user'
  "token": "..."
}
```

### 3. **Test Login**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alirwanda.com","password":"Admin@123"}'
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@alirwanda.com",
  "role": "admin",  // ← Role included in token
  "token": "..."
}
```

### 4. **Test Protected Route (Without Token)**
```bash
curl http://localhost:5000/api/users/profile
```

**Expected:** `401 Unauthorized`

### 5. **Test Admin Route (With User Token)**
```bash
curl http://localhost:5000/api/products/stats \
  -H "Authorization: Bearer <USER_TOKEN>"
```

**Expected:** `403 Forbidden - Access denied. Admin privileges required.`

### 6. **Test Admin Route (With Admin Token)**
```bash
curl http://localhost:5000/api/products/stats \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected:** `200 OK` with statistics

---

## 🔒 Security Architecture

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND (React)                │
│                                                   │
│  Login → Store {user, role, token}              │
│  Role-based routing:                             │
│    - admin → /admin                              │
│    - user  → /dashboard                          │
│                                                   │
│  Every API call includes:                        │
│    Authorization: Bearer <token>                 │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│             MIDDLEWARE LAYER                     │
│                                                   │
│  1. protect:                                     │
│     - Verify JWT signature                       │
│     - Check expiration                           │
│     - Fetch user from DB                         │
│     - Check if active                            │
│                                                   │
│  2. admin:                                       │
│     - Verify req.user.role === 'admin'           │
│     - Deny access if not admin                   │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│             BACKEND (Express)                    │
│                                                   │
│  Controllers trust ONLY:                         │
│    - req.user (from verified JWT)                │
│    - req.user.role (from database)               │
│                                                   │
│  NEVER trust from client:                        │
│    - Role in request body                        │
│    - Role in headers                             │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│             DATABASE (MongoDB)                   │
│                                                   │
│  User Schema:                                    │
│    - password: select: false                     │
│    - role: enum ['user', 'admin']                │
│    - isActive: boolean                           │
│                                                   │
│  Password:                                       │
│    - Hashed with bcrypt (salt: 10)               │
│    - Never stored in plain text                  │
└─────────────────────────────────────────────────┘
```

---

## 📋 Checklist

- [x] User model with secure password handling
- [x] Registration prevents role selection
- [x] Admin created via seed script only
- [x] Login uses bcrypt.compare()
- [x] JWT contains userId and role
- [x] Protect middleware verifies JWT
- [x] Admin middleware checks role
- [x] All admin routes protected
- [x] Frontend role-based routing
- [x] Password never exposed in responses
- [x] Account active/inactive checking
- [x] Token expiration handling
- [x] Generic error messages for security

---

## 🚀 Production Ready

This authentication system is production-ready with:
- ✅ Secure password hashing
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Route protection
- ✅ Input validation
- ✅ Error handling
- ✅ Account management

**No user can become admin through the frontend. Admin access is strictly controlled via backend seed scripts only.**
