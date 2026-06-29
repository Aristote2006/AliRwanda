import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    const products = wishlist.map(item => item.product);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId,
    });

    if (wishlistItem) {
      res.json({ message: 'Product removed from wishlist' });
    } else {
      res.status(404).json({ message: 'Product not in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkInWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    res.json({ inWishlist: !!wishlistItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user._id });
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
  clearWishlist,
};
