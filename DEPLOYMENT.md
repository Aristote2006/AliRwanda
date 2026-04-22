# AliRwanda - Deployment Guide

## 🚀 Deploy to Production

### Prerequisites
- MongoDB Atlas account (or MongoDB server)
- Hosting platform account (Render, Railway, Heroku, etc.)
- Domain name (optional)

---

## 📦 Backend Deployment (Render/Railway)

### Option 1: Render

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Create new Web Service on Render**
   - Connect your GitHub repository
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add Environment Variables**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/alirwanda
JWT_SECRET=your_production_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

4. **Deploy**
   - Render will automatically deploy your backend
   - Note the deployment URL (e.g., `https://alirwanda-api.onrender.com`)

### Option 2: Railway

1. Connect GitHub repository
2. Select `server` directory
3. Add environment variables
4. Deploy automatically

---

## 🌐 Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Update API URL**
   
   Create `client/.env.production`:
```
VITE_API_URL=https://your-backend-url.com
```

2. **Update `client/src/services/api.js`**
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

3. **Deploy to Vercel**
```bash
cd client
npm install -g vercel
vercel
```

   Or use Vercel dashboard:
   - Import from GitHub
   - Root directory: `client`
   - Build command: `npm run build`
   - Output directory: `dist`

### Option 2: Netlify

1. Build the project:
```bash
cd client
npm run build
```

2. Deploy `dist` folder to Netlify
   - Drag and drop or connect GitHub

---

## 🗄️ MongoDB Setup

### MongoDB Atlas (Recommended)

1. **Create cluster** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create database user**
   - Username and password
   - Grant read/write permissions

3. **Whitelist IP addresses**
   - Add `0.0.0.0/0` for all IPs (or specific IPs)

4. **Get connection string**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alirwanda?retryWrites=true&w=majority
```

5. **Update `.env`**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/alirwanda
```

6. **Seed production database**
```bash
cd server
node seed.js
```

---

## 🔒 Security Checklist

Before deploying:

- ✅ Change JWT_SECRET to a strong, random string
- ✅ Set NODE_ENV=production
- ✅ Use MongoDB Atlas (not localhost)
- ✅ Enable CORS for your frontend domain only
- ✅ Use HTTPS
- ✅ Remove console.logs from production code
- ✅ Set up rate limiting
- ✅ Enable MongoDB IP whitelisting
- ✅ Use environment variables for all secrets
- ✅ Test all features in production

---

## 📊 Performance Optimization

### Frontend
```bash
# Build for production
cd client
npm run build
```

- Code splitting (automatic with Vite)
- Image optimization (use WebP)
- Lazy loading routes
- Minimize bundle size

### Backend
- Enable compression
```javascript
const compression = require('compression');
app.use(compression());
```

- Add rate limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

- Use PM2 for process management
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## 🌍 Custom Domain

### Vercel
1. Go to project settings
2. Add custom domain
3. Update DNS records

### Render
1. Add custom domain in dashboard
2. Configure DNS with your registrar

---

## 📈 Monitoring

### Error Tracking
- Sentry: `@sentry/react` (frontend)
- Sentry: `@sentry/node` (backend)

### Analytics
- Google Analytics
- Plausible Analytics

### Uptime Monitoring
- UptimeRobot
- Pingdom

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: echo "Deploy script here"
```

---

## 🧪 Post-Deployment Testing

1. ✅ Test all pages load correctly
2. ✅ Test user registration/login
3. ✅ Test product browsing
4. ✅ Test add to cart
5. ✅ Test checkout process
6. ✅ Test dark mode
7. ✅ Test mobile responsiveness
8. ✅ Check browser console for errors
9. ✅ Test API endpoints
10. ✅ Verify database connection

---

## 📱 Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-api.com
```

---

## 🆘 Common Issues

### CORS Error
```javascript
// server/server.js
app.use(cors({
  origin: 'https://your-frontend.com'
}));
```

### Database Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network access settings

### API Not Found
- Verify base URL in frontend
- Check proxy settings in production
- Update API URL in services/api.js

---

## 🎯 Production URLs Example

- **Frontend**: https://alirwanda.com
- **Backend API**: https://api.alirwanda.com
- **MongoDB**: mongodb+srv://cluster.mongodb.net/alirwanda

---

**Your AliRwanda e-commerce platform is now live! 🚀**
