import mongoose from 'mongoose';

const wishlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to ensure user can only have a product in wishlist once
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
