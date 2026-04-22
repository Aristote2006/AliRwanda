import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi'
import ProductCard from '../components/products/ProductCard'
import { getProduct, getRelatedProducts } from '../services/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { toast } from 'react-toastify'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, related] = await Promise.all([
          getProduct(id),
          getRelatedProducts(id),
        ])
        setProduct(productData)
        setRelatedProducts(related)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : [product.image]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-secondary">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/shop" className="text-gray-600 dark:text-gray-300 hover:text-secondary">
          Shop
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-primary dark:text-white">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="card overflow-hidden mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card overflow-hidden border-2 ${
                    selectedImage === index ? 'border-secondary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-primary dark:text-white mb-4">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          <p className="text-4xl font-bold text-secondary mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Category:</h3>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-secondary hover:text-orange-600"
            >
              {product.category}
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Availability:</h3>
            <p
              className={
                product.countInStock > 0
                  ? 'text-accent font-semibold'
                  : 'text-red-500 font-semibold'
              }
            >
              {product.countInStock > 0
                ? `In Stock (${product.countInStock} available)`
                : 'Out of Stock'}
            </p>
          </div>

          {/* Quantity */}
          {product.countInStock > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity:</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.countInStock, quantity + 1))
                  }
                  className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="btn-outline p-3">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="section-title">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
