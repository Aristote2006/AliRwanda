import UserBehavior from '../models/UserBehavior.js';
import Product from '../models/Product.js';

// @desc    Track user search query
// @route   POST /api/user/track/search
// @access  Private
const trackSearch = async (req, res) => {
  try {
    const { query, resultsCount } = req.body;
    
    let behavior = await UserBehavior.findOne({ user: req.user._id });
    
    if (!behavior) {
      behavior = new UserBehavior({ user: req.user._id });
    }
    
    behavior.searchQueries.push({
      query,
      resultsCount: resultsCount || 0,
      timestamp: new Date(),
    });
    
    // Keep only last 50 searches
    if (behavior.searchQueries.length > 50) {
      behavior.searchQueries = behavior.searchQueries.slice(-50);
    }
    
    await behavior.save();
    res.json({ message: 'Search tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track category view
// @route   POST /api/user/track/category
// @access  Private
const trackCategoryView = async (req, res) => {
  try {
    const { category } = req.body;
    
    let behavior = await UserBehavior.findOne({ user: req.user._id });
    
    if (!behavior) {
      behavior = new UserBehavior({ user: req.user._id });
    }
    
    const existingCategory = behavior.categoryViews.find(
      (cv) => cv.category === category
    );
    
    if (existingCategory) {
      existingCategory.count += 1;
      existingCategory.lastViewed = new Date();
    } else {
      behavior.categoryViews.push({
        category,
        count: 1,
        lastViewed: new Date(),
      });
    }
    
    await behavior.save();
    res.json({ message: 'Category view tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track product view
// @route   POST /api/user/track/product
// @access  Private
const trackProductView = async (req, res) => {
  try {
    const { productId } = req.body;
    
    let behavior = await UserBehavior.findOne({ user: req.user._id });
    
    if (!behavior) {
      behavior = new UserBehavior({ user: req.user._id });
    }
    
    const existingProduct = behavior.productViews.find(
      (pv) => pv.product.toString() === productId
    );
    
    if (existingProduct) {
      existingProduct.count += 1;
      existingProduct.lastViewed = new Date();
    } else {
      behavior.productViews.push({
        product: productId,
        count: 1,
        lastViewed: new Date(),
      });
    }
    
    await behavior.save();
    res.json({ message: 'Product view tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track filter usage
// @route   POST /api/user/track/filter
// @access  Private
const trackFilter = async (req, res) => {
  try {
    const { filterType, filterValue } = req.body;
    
    let behavior = await UserBehavior.findOne({ user: req.user._id });
    
    if (!behavior) {
      behavior = new UserBehavior({ user: req.user._id });
    }
    
    const existingFilter = behavior.filters.find(
      (f) => f.filterType === filterType && f.filterValue === filterValue
    );
    
    if (existingFilter) {
      existingFilter.count += 1;
      existingFilter.lastUsed = new Date();
    } else {
      behavior.filters.push({
        filterType,
        filterValue,
        count: 1,
        lastUsed: new Date(),
      });
    }
    
    await behavior.save();
    res.json({ message: 'Filter tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user behavior analytics and AI recommendations
// @route   GET /api/user/analytics
// @access  Private
const getUserAnalytics = async (req, res) => {
  try {
    const behavior = await UserBehavior.findOne({ user: req.user._id })
      .populate('productViews.product', 'name image price category')
      .populate('purchases.product', 'name image price category');
    
    if (!behavior) {
      return res.json({
        searchHistory: [],
        topCategories: [],
        frequentlyViewed: [],
        recommendedProducts: [],
        insights: [],
      });
    }
    
    // Analyze top searched queries
    const searchFrequency = {};
    behavior.searchQueries.forEach((search) => {
      searchFrequency[search.query] = (searchFrequency[search.query] || 0) + 1;
    });
    
    const topSearches = Object.entries(searchFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));
    
    // Analyze top categories
    const topCategories = behavior.categoryViews
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Update favorite categories in preferences
    behavior.preferences.favoriteCategories = topCategories.map((c) => c.category);
    
    // Analyze most viewed products
    const frequentlyViewed = behavior.productViews
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // AI Recommendation Engine
    let recommendedProducts = [];
    
    if (topCategories.length > 0) {
      // Get products from favorite categories
      const favoriteCats = topCategories.slice(0, 3).map((c) => c.category);
      
      const categoryProducts = await Product.find({
        category: { $in: favoriteCats },
        _id: { $nin: frequentlyViewed.map((p) => p.product) },
      })
        .sort({ rating: -1, createdAt: -1 })
        .limit(12);
      
      recommendedProducts = categoryProducts;
    } else {
      // Fallback to trending and featured products
      const fallback = await Product.find({
        $or: [{ isTrending: true }, { isFeatured: true }],
      })
        .sort({ rating: -1 })
        .limit(12);
      
      recommendedProducts = fallback;
    }
    
    // Generate insights
    const insights = [];
    
    if (behavior.searchQueries.length > 0) {
      insights.push({
        type: 'search',
        message: `You've searched ${behavior.searchQueries.length} times`,
        icon: 'search',
      });
    }
    
    if (topCategories.length > 0) {
      insights.push({
        type: 'category',
        message: `Your favorite category is ${topCategories[0].category}`,
        icon: 'category',
      });
    }
    
    if (frequentlyViewed.length > 0) {
      insights.push({
        type: 'views',
        message: `You've viewed ${frequentlyViewed.length} products multiple times`,
        icon: 'views',
      });
    }
    
    await behavior.save();
    
    res.json({
      searchHistory: topSearches,
      topCategories,
      frequentlyViewed: frequentlyViewed.slice(0, 5),
      recommendedProducts,
      insights,
      stats: {
        totalSearches: behavior.searchQueries.length,
        totalCategoryViews: behavior.categoryViews.reduce((sum, c) => sum + c.count, 0),
        totalProductViews: behavior.productViews.reduce((sum, p) => sum + p.count, 0),
        totalPurchases: behavior.purchases.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get personalized product feed based on AI analysis
// @route   GET /api/user/feed
// @access  Private
const getPersonalizedFeed = async (req, res) => {
  try {
    const behavior = await UserBehavior.findOne({ user: req.user._id });
    
    if (!behavior || behavior.categoryViews.length === 0) {
      // Return trending products for new users
      const products = await Product.find({
        $or: [{ isTrending: true }, { isFeatured: true }],
      })
        .sort({ rating: -1 })
        .limit(20);
      
      return res.json({ products, personalized: false });
    }
    
    // Get top 3 categories
    const topCategories = behavior.categoryViews
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((c) => c.category);
    
    // Get viewed product IDs to exclude
    const viewedProductIds = behavior.productViews.map((p) => p.product);
    
    // Fetch personalized recommendations
    const products = await Product.find({
      category: { $in: topCategories },
      _id: { $nin: viewedProductIds },
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);
    
    res.json({ products, personalized: true, categories: topCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  trackSearch,
  trackCategoryView,
  trackProductView,
  trackFilter,
  getUserAnalytics,
  getPersonalizedFeed,
};
