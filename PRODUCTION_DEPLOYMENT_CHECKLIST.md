# 🚀 AliRwanda Production Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Environment Variables

#### Backend (.env)
- [ ] `PORT` - Set to 5000 (or your hosting provider's port)
- [ ] `MONGODB_URI` - **CRITICAL**: Use MongoDB Atlas URI, NOT localhost
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/alirwanda?retryWrites=true&w=majority`
- [ ] `JWT_SECRET` - **CRITICAL**: Change to a strong random string (minimum 32 characters)
  - Generate: `openssl rand -base64 64`
- [ ] `JWT_EXPIRE` - Set to `7d` (7 days) or your preference
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_URL` - Your deployed frontend URL
  - Example: `https://alirwanda.onrender.com`

#### Frontend (.env)
- [ ] `VITE_API_URL` - Set to your backend URL
  - Example: `https://alirwanda-server.onrender.com/api`
  - **Leave empty for local development**

---

### 2. Database Setup

- [ ] Create MongoDB Atlas account (if not already)
- [ ] Create a new cluster
- [ ] Create database user with read/write permissions
- [ ] Whitelist IP addresses (0.0.0.0/0 for all IPs, or specific IPs)
- [ ] Get connection string and update `MONGODB_URI` in .env
- [ ] Test connection locally before deploying

---

### 3. Security Checks

- [ ] **JWT_SECRET changed** from default value
- [ ] **.env files are in .gitignore** (never commit .env)
- [ ] **CORS configured** with production frontend URL
- [ ] **Password hashing** using bcrypt (already implemented)
- [ ] **Role-based access** working (admin vs user)
- [ ] **Input validation** on all forms
- [ ] **Error messages** don't leak sensitive info in production

---

### 4. File Upload System

- [ ] `server/uploads/` directory exists
- [ ] Directory has proper permissions (read/write)
- [ ] `.gitignore` configured to exclude uploaded files
- [ ] Multer middleware installed (`npm install multer` - already done)
- [ ] Static file serving configured (`/uploads` route)
- [ ] File size limits set (5MB per file - already configured)
- [ ] File type validation working (images only - already configured)

---

### 5. CORS Configuration

Current allowed origins:
- ✅ `https://alirwanda.onrender.com`
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5173`
- ✅ `process.env.FRONTEND_URL` (dynamic)

**Before deploying, verify:**
- [ ] `FRONTEND_URL` in backend .env matches your actual frontend URL
- [ ] Frontend can make requests to backend without CORS errors
- [ ] Test with browser DevTools Network tab

---

### 6. API Endpoints

#### Public Routes (No Auth Required)
- [ ] `GET /api/products` - List products
- [ ] `GET /api/products/:id` - Single product
- [ ] `GET /api/products/featured` - Featured products
- [ ] `GET /api/products/trending` - Trending products
- [ ] `GET /api/products/top` - Top products
- [ ] `GET /api/products/categories` - Categories
- [ ] `POST /api/users/register` - User registration
- [ ] `POST /api/users/login` - User login
- [ ] `GET /api/health` - Health check

#### Protected Routes (Auth Required)
- [ ] `GET /api/users/profile` - User profile
- [ ] `POST /api/orders` - Create order
- [ ] `GET /api/orders/:id` - Get order
- [ ] `GET /api/orders/myorders` - User's orders
- [ ] `POST /api/user/track/*` - User behavior tracking

#### Admin Routes (Admin Auth Required)
- [ ] `POST /api/products` - Create product
- [ ] `PUT /api/products/:id` - Update product
- [ ] `DELETE /api/products/:id` - Delete product
- [ ] `GET /api/products/stats` - Product statistics

---

### 7. Build Process

#### Backend
```bash
cd server
npm install --production  # Install only production dependencies
npm start                 # Start the server
```

#### Frontend
```bash
cd client
npm install
npm run build             # Build for production
# Output: client/dist/
```

---

### 8. Deployment Steps

#### Option A: Deploy to Render.com

**Backend:**
1. Create new Web Service on Render
2. Connect your GitHub repository
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `PORT` (Render auto-sets this)
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `NODE_ENV=production`
   - `FRONTEND_URL`

**Frontend:**
1. Create new Static Site on Render
2. Connect your GitHub repository
3. Root Directory: `client`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL=https://your-backend.onrender.com/api`

#### Option B: Deploy to Vercel (Frontend) + Render (Backend)

**Frontend (Vercel):**
1. Connect GitHub repo
2. Root Directory: `client`
3. Build Command: `npm install && npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_URL`

**Backend (Render):** Same as Option A

---

### 9. Post-Deployment Testing

#### Critical Tests
- [ ] **Health Check**: Visit `/api/health` - should return `{"status":"OK"}`
- [ ] **CORS Test**: Frontend can fetch products without errors
- [ ] **Registration**: Create new user account
- [ ] **Login**: Login with credentials
- [ ] **Product Listing**: Products display on homepage
- [ ] **Product Details**: Click product, view details
- [ ] **Cart**: Add to cart works
- [ ] **Admin Login**: Login as admin redirects to `/admin`
- [ ] **Admin Dashboard**: Dashboard loads with stats
- [ ] **Add Product (URL)**: Create product with image URL
- [ ] **Add Product (File)**: Upload product images from device
- [ ] **Image Display**: Uploaded images show on homepage
- [ ] **Edit Product**: Update existing product
- [ ] **Delete Product**: Remove product
- [ ] **User Dashboard**: Customer dashboard with AI recommendations
- [ ] **Behavior Tracking**: Searches and views are tracked

---

### 10. Monitoring & Maintenance

- [ ] Set up MongoDB Atlas monitoring alerts
- [ ] Configure Render/Vercel deployment notifications
- [ ] Monitor server logs for errors
- [ ] Check disk space for uploaded images
- [ ] Set up automated backups for MongoDB
- [ ] Monitor API response times
- [ ] Track error rates

---

## 🚨 Common Issues & Solutions

### Issue: CORS Errors After Deployment
**Solution:** 
- Update `FRONTEND_URL` in backend .env to match actual frontend URL
- Redeploy backend after changing .env

### Issue: Images Not Displaying
**Solution:**
- Check if `server/uploads/` directory exists on server
- Verify static file serving is configured
- Check file paths in database (should start with `/uploads/products/`)
- Ensure proper permissions on uploads directory

### Issue: Database Connection Failed
**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Test connection string locally first

### Issue: JWT Authentication Fails
**Solution:**
- Ensure `JWT_SECRET` is the same across restarts
- Don't change JWT_SECRET after users have logged in
- Clear localStorage and login again if changed

### Issue: File Upload Fails
**Solution:**
- Check disk space on server
- Verify uploads directory has write permissions
- Check file size (max 5MB)
- Verify file type is allowed (jpeg, jpg, png, gif, webp)

---

## 📝 Environment Variable Templates

### Backend .env (Production)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alirwanda?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://alirwanda.onrender.com
```

### Frontend .env (Production)
```env
VITE_API_URL=https://alirwanda-server.onrender.com/api
```

---

## ✅ Final Checklist Before Push

- [ ] All .env files are in .gitignore
- [ ] No hardcoded secrets in code
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB URI uses Atlas (not localhost)
- [ ] CORS includes production URLs
- [ ] Uploads directory exists and is writable
- [ ] All dependencies installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Test all critical features locally
- [ ] Admin user exists (run `npm run seed:admin`)
- [ ] Remove console.logs from production code (already done)
- [ ] Error handling doesn't leak sensitive info (already done)

---

## 🎯 Ready to Deploy!

Once all checkboxes are complete, you're ready to push and deploy!

**Push Commands:**
```bash
git add .
git commit -m "Production ready: Add file uploads, enhanced security, CORS fixes"
git push origin main
```

**Good luck with your deployment! 🚀**
