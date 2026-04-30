# Backend-Frontend Connection Guide

## ✅ Changes Made

### 1. Backend CORS Configuration (server/server.js)
- Added explicit CORS policy to allow your deployed frontend
- Allowed origins:
  - `https://alirwanda.onrender.com` (your deployed frontend)
  - `http://localhost:3000` (local dev)
  - `http://localhost:5173` (Vite dev server)
  - Custom `FRONTEND_URL` from environment variables

### 2. Frontend API Service (client/src/services/api.js)
- Updated to use environment variable `VITE_API_URL`
- Falls back to `/api` for local development (uses Vite proxy)
- Production-ready for deployment

### 3. Environment Variables
- **Backend** (`server/.env`): Added `FRONTEND_URL=https://alirwanda.onrender.com`
- **Frontend** (`client/.env`): Created with `VITE_API_URL` placeholder
- **Frontend** (`client/.env.example`): Documentation for deployment

---

## 🚀 How to Connect Your Deployed Frontend to Backend

### Option 1: Deploy Backend to Render (Recommended)

1. **Deploy your backend to Render**:
   - Go to https://render.com
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to `server`
   - Build command: `npm install`
   - Start command: `npm start`

2. **Set environment variables on Render**:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<db username>:<db password>@appname.kk6f8.mongodb.net/?appName=Cluster0
   JWT_SECRET=
   JWT_EXPIRE=
   NODE_ENV=production
   FRONTEND_URL=
   ```

3. **Update frontend environment**:
   - On your frontend deployment platform (Render/Vercel/Netlify)
   - Add this environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   - Replace `your-backend-url` with your actual Render backend URL

4. **Redeploy frontend** to apply the new environment variable

---

### Option 2: Use Local Backend (Testing Only)

If your backend is running locally on port 5000:

1. **Start backend**:
   ```bash
   cd server
   npm start
   ```

2. **Update frontend** (`client/.env`):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Rebuild and redeploy frontend**

⚠️ **Note**: This only works if your local machine is publicly accessible (not recommended for production)

---

## 📝 Quick Testing

### Test Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "AliRwanda API is running"
}
```

### Test Frontend Connection
1. Open browser console (F12)
2. Navigate to your frontend: `https://alirwanda.onrender.com`
3. Check for any CORS errors in the console
4. Network tab should show successful API calls to your backend

---

## 🔧 Troubleshooting

### CORS Error
If you see: `Access-Control-Allow-Origin` error
- Verify backend `FRONTEND_URL` matches your frontend URL exactly
- Check that CORS configuration in `server.js` includes your frontend URL
- Redeploy backend after making changes

### API Calls Failing (404/500)
- Check backend logs on Render
- Verify `MONGODB_URI` is correct
- Ensure backend is running (check Render dashboard)

### Environment Variables Not Working
- Frontend: Variables must start with `VITE_` prefix
- After changing env vars, you MUST redeploy
- Local `.env` files are not used in production

---

## 📂 Files Modified

- ✅ `server/server.js` - CORS configuration
- ✅ `server/.env` - Added FRONTEND_URL
- ✅ `client/src/services/api.js` - Dynamic API URL
- ✅ `client/.env` - Created for local development
- ✅ `client/.env.example` - Documentation

---

## 🎯 Next Steps

1. Deploy backend to Render (or your preferred platform)
2. Set `VITE_API_URL` on your frontend deployment
3. Test the connection
4. Monitor logs for any issues

Need help with deployment? Let me know which platform you're using!
