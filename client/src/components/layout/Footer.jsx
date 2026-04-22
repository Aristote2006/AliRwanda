import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Ali<span className="text-secondary">Rwanda</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted online shopping destination in Rwanda. Quality products, fast delivery, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <FiTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <FiInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-secondary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-secondary transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 mt-1 text-secondary" />
                <span className="text-gray-300">Kigali, Rwanda</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-secondary" />
                <span className="text-gray-300">+250 788 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-secondary" />
                <span className="text-gray-300">support@alirwanda.rw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} AliRwanda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
