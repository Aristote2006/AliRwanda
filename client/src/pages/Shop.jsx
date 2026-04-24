import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import ProductCard from '../components/products/ProductCard'
import { getProducts, trackSearch, trackCategoryView, trackFilter } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [rating, setRating] = useState('')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty']

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {
          page,
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          rating: rating || undefined,
          sort,
        }
        
        const data = await getProducts(params)
        setProducts(data.products)
        setTotalPages(data.pages)
        
        // Track user behavior
        if (user) {
          if (search) {
            trackSearch({ query: search, resultsCount: data.products.length }, user.token).catch(() => {})
          }
          if (category !== 'All') {
            trackCategoryView({ category }, user.token).catch(() => {})
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, category, search, minPrice, maxPrice, rating, sort, user])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchParams({ search })
  }

  const handleFilterChange = (filterType, value) => {
    setPage(1)
    
    // Track filter usage
    if (user && value) {
      trackFilter({ filterType, filterValue: value }, user.token).catch(() => {})
    }
    
    switch (filterType) {
      case 'category':
        setCategory(value)
        setSearchParams({ category: value !== 'All' ? value : undefined })
        break
      case 'minPrice':
        setMinPrice(value)
        break
      case 'maxPrice':
        setMaxPrice(value)
        break
      case 'rating':
        setRating(value)
        break
      case 'sort':
        setSort(value)
        break
      default:
        break
    }
  }

  const clearFilters = () => {
    setCategory('All')
    setMinPrice('')
    setMaxPrice('')
    setRating('')
    setSort('newest')
    setSearch('')
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary dark:text-white mb-4">Shop</h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field"
          />
        </form>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <FiFilter />
              <span>Filters</span>
            </button>
            <button onClick={clearFilters} className="text-secondary hover:text-orange-600 font-semibold">
              Clear All
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="input-field py-2"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="hidden md:flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 sticky top-20">
              <h3 className="text-xl font-bold text-primary dark:text-white mb-4">Filters</h3>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => handleFilterChange('category', cat)}
                        className="text-secondary focus:ring-secondary"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Minimum Rating</h4>
                <select
                  value={rating}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">No products found</p>
              <button onClick={clearFilters} className="btn-primary mt-4">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Showing {products.length} products
              </p>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded ${
                        page === i + 1
                          ? 'bg-secondary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
