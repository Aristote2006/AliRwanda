import mongoose from 'mongoose';

const userBehaviorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    searchQueries: [
      {
        query: String,
        timestamp: { type: Date, default: Date.now },
        resultsCount: Number,
      },
    ],
    categoryViews: [
      {
        category: String,
        count: { type: Number, default: 0 },
        lastViewed: { type: Date, default: Date.now },
      },
    ],
    productViews: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        count: { type: Number, default: 0 },
        lastViewed: { type: Date, default: Date.now },
      },
    ],
    filters: [
      {
        filterType: String, // e.g., 'price', 'rating', 'category'
        filterValue: String,
        count: { type: Number, default: 0 },
        lastUsed: { type: Date, default: Date.now },
      },
    ],
    purchases: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        category: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    preferences: {
      favoriteCategories: [String],
      priceRange: {
        min: Number,
        max: Number,
      },
      averageRating: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userBehaviorSchema.index({ user: 1 });

export default mongoose.model('UserBehavior', userBehaviorSchema);
