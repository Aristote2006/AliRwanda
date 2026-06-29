import { useState, useEffect } from 'react'
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../services/api'
import { toast } from 'react-toastify'
import DashboardSidebar from '../../components/customer/DashboardSidebar'
import DashboardNavbar from '../../components/customer/DashboardNavbar'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const SavedAddresses = () => {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [formData, setFormData] = useState({
    label: 'Home',
    customLabel: '',
    phone: '',
    whatsapp: '',
    country: 'Rwanda',
    district: '',
    sector: '',
    cell: '',
    village: '',
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const data = await getAddresses(user.token)
      setAddresses(data)
    } catch (error) {
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address)
      setFormData({
        label: address.label,
        customLabel: address.customLabel || '',
        phone: address.phone,
        whatsapp: address.whatsapp || '',
        country: address.country,
        district: address.district,
        sector: address.sector,
        cell: address.cell,
        village: address.village,
        isDefault: address.isDefault,
      })
    } else {
      setEditingAddress(null)
      setFormData({
        label: 'Home',
        customLabel: '',
        phone: '',
        whatsapp: '',
        country: 'Rwanda',
        district: '',
        sector: '',
        cell: '',
        village: '',
        isDefault: false,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAddress(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, formData, user.token)
        toast.success('Address updated successfully')
      } else {
        await createAddress(formData, user.token)
        toast.success('Address added successfully')
      }
      handleCloseModal()
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id, user.token)
        toast.success('Address deleted successfully')
        fetchAddresses()
      } catch (error) {
        toast.error('Failed to delete address')
      }
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id, user.token)
      toast.success('Default address updated')
      fetchAddresses()
    } catch (error) {
      toast.error('Failed to set default address')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-white">
                Saved Addresses
              </h1>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="card p-12 text-center">
                <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No saved addresses
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Add your first address to make checkout faster
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`card p-6 relative ${
                      address.isDefault
                        ? 'border-2 border-secondary'
                        : 'border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {address.isDefault && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                          Default
                        </span>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FiMapPin className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-semibold text-primary dark:text-white">
                          {address.label}
                          {address.customLabel && ` - ${address.customLabel}`}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
                      <p><strong>Phone:</strong> {address.phone}</p>
                      {address.whatsapp && <p><strong>WhatsApp:</strong> {address.whatsapp}</p>}
                      <p><strong>Country:</strong> {address.country}</p>
                      <p><strong>District:</strong> {address.district}</p>
                      <p><strong>Sector:</strong> {address.sector}</p>
                      <p><strong>Cell:</strong> {address.cell}</p>
                      <p><strong>Village:</strong> {address.village}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(address)}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className="flex items-center space-x-1 px-3 py-2 text-sm text-secondary hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Set Default</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary dark:text-white">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <select
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="University">University</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {formData.label === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Label
                    </label>
                    <input
                      type="text"
                      name="customLabel"
                      value={formData.customLabel}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Parents' House"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+250 7XX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+250 7XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Gasabo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sector *
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Kinyinya"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cell *
                  </label>
                  <input
                    type="text"
                    name="cell"
                    value={formData.cell}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Kinyinya"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Kinyinya Village"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      className="w-4 h-4 text-secondary rounded focus:ring-secondary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Set as default address
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FiCheck className="w-5 h-5" />
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedAddresses
