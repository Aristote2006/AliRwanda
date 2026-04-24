import Product from '../models/Product.js';
import upload from '../middleware/upload.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;

    const { category, search, minPrice, maxPrice, rating, sort } = req.query;

    // Build query
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, images, category, rating, numReviews, countInStock, isFeatured, isTrending } = req.body;
    
    // Handle uploaded files
    let mainImage = image;
    let additionalImages = images || [];
    
    if (req.files && req.files.length > 0) {
      // Use first uploaded file as main image if no URL provided
      if (!mainImage) {
        mainImage = `/uploads/products/${req.files[0].filename}`;
      }
      // Add all uploaded files to additional images
      const uploadedPaths = req.files.map(file => `/uploads/products/${file.filename}`);
      additionalImages = [...additionalImages, ...uploadedPaths];
    }
    
    const product = new Product({
      name,
      description,
      price,
      image: mainImage,
      images: additionalImages,
      category,
      rating: rating || 0,
      numReviews: numReviews || 0,
      countInStock,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, images, category, countInStock, rating, numReviews, isFeatured, isTrending } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Handle uploaded files
      let mainImage = image || product.image;
      let additionalImages = images || product.images;
      
      if (req.files && req.files.length > 0) {
        // Use first uploaded file as main image if no URL provided
        if (!image) {
          mainImage = `/uploads/products/${req.files[0].filename}`;
        }
        // Add all uploaded files to additional images
        const uploadedPaths = req.files.map(file => `/uploads/products/${file.filename}`);
        additionalImages = [...additionalImages, ...uploadedPaths];
      }
      
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = mainImage;
      product.images = additionalImages;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;
      product.rating = rating !== undefined ? rating : product.rating;
      product.numReviews = numReviews !== undefined ? numReviews : product.numReviews;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/related/:id
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const related = await Product.find({
        _id: { $ne: req.params.id },
        category: product.category,
      })
        .limit(4)
        .sort({ rating: -1 });

      res.json(related);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const lowStock = await Product.find({ countInStock: { $lte: 5 } }).countDocuments();
    const featured = await Product.find({ isFeatured: true }).countDocuments();
    const trending = await Product.find({ isTrending: true }).countDocuments();
    
    res.json({ 
      totalProducts, 
      categories, 
      categoryStats, 
      lowStock, 
      featured, 
      trending 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getRelatedProducts,
  getCategories,
  getProductStats,
};
