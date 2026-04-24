import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload, FiLink, FiImage } from 'react-icons/fi'
import { createProduct, createProductWithFiles, updateProduct, updateProductWithFiles, getProduct, getCategories } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditMode = !!id

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEditMode)
  const [categories, setCategories] = useState([])
  const [imageUploadMode, setImageUploadMode] = useState('url') // 'url' or 'file'
  const [selectedFiles, setSelectedFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    images: [],
    category: 'Electronics',
    rating: 0,
    numReviews: 0,
    countInStock: 0,
    isFeatured: false,
    isTrending: false,
  })

  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    fetchCategories()
    if (isEditMode) {
      fetchProduct()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const fetchProduct = async () => {
    try {
      setFetchLoading(true)
      const data = await getProduct(id)
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        image: data.image || '',
        images: data.images || [],
        category: data.category || 'Electronics',
        rating: data.rating || 0,
        numReviews: data.numReviews || 0,
        countInStock: data.countInStock || 0,
        isFeatured: data.isFeatured || false,
        isTrending: data.isTrending || false,
      })
    } catch (error) {
      toast.error('Failed to load product')
      navigate('/admin/products')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      })
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file size (5MB max)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`)
        return false
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(newFiles)
      
      // Create previews
      const previews = newFiles.map(file => URL.createObjectURL(file))
      setFilePreviews(previews)
      
      toast.success(`${validFiles.length} image(s) selected`)
    }
  }

  // Remove selected file
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = filePreviews.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setFilePreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    if (imageUploadMode === 'url' && !formData.image) {
      toast.error('Please provide a main image URL')
      return
    }

    if (imageUploadMode === 'file' && selectedFiles.length === 0 && !formData.image) {
      toast.error('Please select at least one image file or provide an image URL')
      return
    }

    setLoading(true)
    try {
      if (isEditMode) {
        // For edit mode, check if we have files to upload
        if (selectedFiles.length > 0) {
          const formDataToSend = new FormData()
          
          // Add all text fields
          Object.keys(formData).forEach(key => {
            if (key === 'images') {
              formDataToSend.append(key, JSON.stringify(formData[key]))
            } else if (key !== 'image') {
              formDataToSend.append(key, formData[key])
            }
          })
          
          // Add image URL if provided
          if (formData.image) {
            formDataToSend.append('image', formData.image)
          }
          
          // Add files
          selectedFiles.forEach(file => {
            formDataToSend.append('productImages', file)
          })
          
          await updateProductWithFiles(id, formDataToSend, user.token)
        } else {
          await updateProduct(id, formData, user.token)
        }
        toast.success('Product updated successfully')
      } else {
        // For create mode, check if we have files to upload
        if (selectedFiles.length > 0) {
          const formDataToSend = new FormData()
          
          // Add all text fields
          Object.keys(formData).forEach(key => {
            if (key === 'images') {
              formDataToSend.append(key, JSON.stringify(formData[key]))
            } else if (key !== 'image') {
              formDataToSend.append(key, formData[key])
            }
          })
          
          // Add image URL if provided
          if (formData.image) {
            formDataToSend.append('image', formData.image)
          }
          
          // Add files
          selectedFiles.forEach(file => {
            formDataToSend.append('productImages', file)
          })
          
          await createProductWithFiles(formDataToSend, user.token)
        } else {
          await createProduct(formData, user.token)
        }
        toast.success('Product created successfully')
      }
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-secondary mb-6"
      >
        <FiArrowLeft className="w-5 h-5" />
        <span>Back to Products</span>
      </button>

      <h1 className="text-4xl font-bold text-primary dark:text-white mb-8">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Images</h2>
          
          {/* Upload Mode Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              type="button"
              onClick={() => setImageUploadMode('url')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                imageUploadMode === 'url'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              <FiLink className="w-5 h-5" />
              <span className="font-medium">Use Image URL</span>
            </button>
            <button
              type="button"
              onClick={() => setImageUploadMode('file')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all ${
                imageUploadMode === 'file'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
              }`}
            >
              <FiUpload className="w-5 h-5" />
              <span className="font-medium">Upload from Device</span>
            </button>
          </div>

          {imageUploadMode === 'url' ? (
            /* URL Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        toast.error('Invalid image URL')
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Image URLs
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/image2.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* File Upload Mode */
            <div className="space-y-4">
              {/* Main Image - Optional URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg or leave empty to use first uploaded file"
                />
                {formData.image && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Product Images <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FiImage className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG, GIF, WEBP up to 5MB each
                    </p>
                  </label>
                </div>

                {/* File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Selected Images ({filePreviews.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {filePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Inventory & Ratings */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Inventory & Ratings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count in Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                name="numReviews"
                value={formData.numReviews}
                onChange={handleChange}
                min="0"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">
            Product Status
          </h2>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-secondary focus:ring-secondary rounded"
              />
              <div>
                <p className="font-semibold">Featured Product</p>
                <p className="text-sm text-gray-500">Show on homepage featured section</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleChange}
                className="w-5 h-5 text-secondary focus:ring-secondary rounded"
              />
              <div>
                <p className="font-semibold">Trending Product</p>
                <p className="text-sm text-gray-500">Show in trending products section</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}

export default ProductForm
