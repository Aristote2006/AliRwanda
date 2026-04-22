import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';

dotenv.config();

// Connect to database
connectDB();

const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max',
    description: 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features a 6.7-inch Super Retina XDR display with ProMotion technology.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1696520647066-8e267456c7d9?w=500',
    ],
    category: 'Electronics',
    rating: 4.8,
    numReviews: 256,
    countInStock: 45,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. Built with titanium frame for durability.',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=500',
    images: [
      'https://images.unsplash.com/photo-1610945265078-3858a0828671?w=500',
    ],
    category: 'Electronics',
    rating: 4.7,
    numReviews: 189,
    countInStock: 38,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Powerful laptop with M3 Max chip, 36GB RAM, stunning Liquid Retina XDR display. Perfect for professionals and creators.',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    ],
    category: 'Electronics',
    rating: 4.9,
    numReviews: 142,
    countInStock: 22,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with exceptional sound quality. 30-hour battery life and premium comfort.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1618366712815-3315d6c1e8f4?w=500',
    images: [
      'https://images.unsplash.com/photo-1618366712815-3315d6c1e8f4?w=500',
    ],
    category: 'Electronics',
    rating: 4.6,
    numReviews: 324,
    countInStock: 67,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'Ultra-thin iPad with M2 chip, ProMotion display, and Apple Pencil support. Perfect for creativity and productivity.',
    price: 1099.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    ],
    category: 'Electronics',
    rating: 4.8,
    numReviews: 198,
    countInStock: 31,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'AirPods Pro 2nd Gen',
    description: 'Active noise cancellation, adaptive transparency, and personalized spatial audio. MagSafe charging case included.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a4e945e8e9?w=500',
    images: [
      'https://images.unsplash.com/photo-1606841837239-c5a4e945e8e9?w=500',
    ],
    category: 'Electronics',
    rating: 4.7,
    numReviews: 412,
    countInStock: 89,
    isFeatured: false,
    isTrending: true,
  },

  // Fashion
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with visible Air unit, breathable mesh upper, and modern design. Perfect for everyday wear.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    ],
    category: 'Fashion',
    rating: 4.5,
    numReviews: 287,
    countInStock: 56,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Adidas Ultraboost 23',
    description: 'Premium running shoes with Boost cushioning technology, Primeknit upper, and Continental rubber outsole.',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500',
    images: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500',
    ],
    category: 'Fashion',
    rating: 4.6,
    numReviews: 213,
    countInStock: 42,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with vintage wash, button closure, and multiple pockets. A wardrobe essential.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    ],
    category: 'Fashion',
    rating: 4.4,
    numReviews: 156,
    countInStock: 73,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant genuine leather crossbody bag with adjustable strap, multiple compartments, and gold-tone hardware.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    ],
    category: 'Fashion',
    rating: 4.7,
    numReviews: 178,
    countInStock: 34,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt with relaxed fit. Available in multiple colors. Perfect for casual wear.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    ],
    category: 'Fashion',
    rating: 4.3,
    numReviews: 421,
    countInStock: 145,
    isFeatured: false,
    isTrending: false,
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    description: 'Iconic aviator sunglasses with polarized lenses, metal frame, and UV protection. Timeless style.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    ],
    category: 'Fashion',
    rating: 4.8,
    numReviews: 267,
    countInStock: 48,
    isFeatured: true,
    isTrending: false,
  },

  // Home
  {
    name: 'Smart LED Desk Lamp',
    description: 'Modern desk lamp with adjustable brightness, color temperature, USB charging port, and touch control.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    ],
    category: 'Home',
    rating: 4.5,
    numReviews: 198,
    countInStock: 87,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs with unique designs. Microwave and dishwasher safe. 12oz capacity.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    ],
    category: 'Home',
    rating: 4.6,
    numReviews: 312,
    countInStock: 92,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Minimalist Wall Clock',
    description: 'Scandinavian-inspired wall clock with silent movement, wooden frame, and clean design. 12-inch diameter.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500',
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500',
    ],
    category: 'Home',
    rating: 4.4,
    numReviews: 145,
    countInStock: 64,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Luxury Throw Pillow Set',
    description: 'Set of 2 premium velvet throw pillows with inserts. Soft, durable, and elegant. 18x18 inches.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500',
    ],
    category: 'Home',
    rating: 4.5,
    numReviews: 223,
    countInStock: 78,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Stainless Steel Cookware Set',
    description: '10-piece professional cookware set with tri-ply construction, ergonomic handles, and glass lids.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500',
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500',
    ],
    category: 'Home',
    rating: 4.7,
    numReviews: 167,
    countInStock: 28,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Scented Candle Collection',
    description: 'Set of 3 luxury soy wax candles with essential oils. Lavender, vanilla, and eucalyptus scents. 40-hour burn time each.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1602607666833-aa77fb84db39?w=500',
    images: [
      'https://images.unsplash.com/photo-1602607666833-aa77fb84db39?w=500',
    ],
    category: 'Home',
    rating: 4.8,
    numReviews: 289,
    countInStock: 103,
    isFeatured: true,
    isTrending: true,
  },
];

const seedProducts = async () => {
  try {
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany();
    console.log('✅ Existing products cleared');

    console.log('📦 Importing new products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Successfully imported ${createdProducts.length} products`);

    console.log('🎉 Database seeding completed!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedProducts();
