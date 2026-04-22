import { Link } from 'react-router-dom'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Link to={`/product/${product._id}`} className="card overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {product.countInStock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {product.isTrending && (
          <div className="absolute top-3 left-3 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
            Trending
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-primary dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">
            {product.rating} ({product.numReviews})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-secondary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="btn-primary py-2 px-4 text-sm flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
