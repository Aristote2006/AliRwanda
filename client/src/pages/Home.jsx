import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiMail } from 'react-icons/fi'
import ProductCard from '../components/products/ProductCard'
import { getFeaturedProducts, getTrendingProducts } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, trending] = await Promise.all([
          getFeaturedProducts(),
          getTrendingProducts(),
        ])
        setFeaturedProducts(featured)
        setTrendingProducts(trending)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', count: 120 },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', count: 85 },
    { name: 'Home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', count: 64 },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013c?w=400', count: 42 },
    { name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', count: 56 },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', count: 38 },
  ]

  const testimonials = [
    {
      name: 'Jean Pierre',
      role: 'Regular Customer',
      content: 'AliRwanda has transformed my shopping experience. Fast delivery and quality products!',
      rating: 5,
    },
    {
      name: 'Marie Claire',
      role: 'Verified Buyer',
      content: 'Amazing customer service and great product selection. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emmanuel',
      role: 'Tech Enthusiast',
      content: 'Best electronics store in Rwanda. Competitive prices and authentic products.',
      rating: 5,
    },
  ]

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      alert('Thank you for subscribing!')
      setEmail('')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Shop Smart, <br />
                <span className="text-secondary">Live Better</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Discover amazing products at unbeatable prices. Rwanda's premier online shopping destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="btn-primary text-center">
                  Shop Now
                </Link>
                <Link to="/shop" className="btn-outline text-center">
                  View Categories
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                alt="Shopping"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name}`}
                className="card group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-gray-200 text-sm">{category.count} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title mb-0">Featured Products</h2>
            <Link to="/shop" className="text-secondary hover:text-orange-600 font-semibold flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title mb-0">Trending Now</h2>
            <Link to="/shop" className="text-secondary hover:text-orange-600 font-semibold flex items-center space-x-2">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-primary dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive deals and new arrivals
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <button type="submit" className="btn-primary">
                <FiMail className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
