# AliRwanda - Modern Rwandan E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features a modern, responsive design with dark mode support, JWT authentication, and a complete shopping experience.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first approach, works on all devices
- **Product Catalog**: Browse, search, filter, and sort products
- **Shopping Cart**: Add, remove, update quantities with persistent storage
- **User Authentication**: JWT-based login and registration
- **Checkout Process**: Complete order placement with multiple payment options
- **Toast Notifications**: User-friendly feedback messages
- **Loading States**: Skeleton loaders and spinners

### Backend
- **RESTful API**: Complete CRUD operations for products, users, and orders
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Database**: Mongoose ODM for data modeling
- **Role-Based Access**: User and admin roles
- **Error Handling**: Comprehensive error middleware
- **Input Validation**: Request validation and sanitization

## 📁 Project Structure

```
AliRwanda/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   │   ├── common/    # Shared components
│   │   │   ├── layout/    # Layout components (Navbar, Footer)
│   │   │   ├── products/  # Product-related components
│   │   │   └── ui/        # UI components
│   │   ├── context/       # React Context (Cart, Auth, Theme)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                # Express Backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   ├── seed.js          # Database seeder
│   └── package.json
│
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blue (#0F172A)
- **Secondary**: Orange (#F97316)
- **Accent**: Emerald (#10B981)
- **Background**: Light Gray (#F8FAFC)
- **Text**: Dark (#111827)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **React Toastify**: Notification system

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **dotenv**: Environment variables

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/alirwanda
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Seed the database with mock products:
```bash
npm run seed
```

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/top` - Get top rated products
- `GET /api/products/related/:id` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)

## 🎯 Key Features

### Product Filtering & Search
- Category filter
- Price range filter
- Rating filter
- Text search
- Multiple sort options

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart (localStorage)
- Real-time price calculations

### Authentication
- JWT-based auth
- Protected routes
- User profile management
- Password encryption

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized images

## 🚀 Build for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```

The build artifacts will be stored in the `client/dist/` directory.

## 📝 Mock Data

The project includes realistic mock products across categories:
- **Electronics**: Phones, laptops, headphones, tablets
- **Fashion**: Shoes, clothing, accessories
- **Home**: Decor, kitchen items, lighting

Each product includes:
- Name and description
- Price and images
- Category and rating
- Stock count
- Featured/trending flags

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- CORS enabled
- Environment variables for sensitive data

## 🎨 UI Components

### Reusable Components
- ProductCard
- LoadingSpinner
- PrivateRoute
- Navbar (with mobile menu)
- Footer

### Custom Tailwind Classes
- `.btn-primary`, `.btn-secondary`, `.btn-outline`
- `.card`
- `.input-field`
- `.section-title`
- `.fade-in`
- `.skeleton`

## 🌟 Future Enhancements

- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Payment gateway integration (Flutterwave)
- [ ] Image upload (Cloudinary)
- [ ] Email notifications
- [ ] Product recommendations (AI)
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@alirwanda.rw or open an issue in the repository.

---

Built with ❤️ for Rwanda's digital commerce future
