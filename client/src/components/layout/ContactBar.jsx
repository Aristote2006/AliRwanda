import { FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi'

const ContactBar = () => {
  // ===== CONTACT INFORMATION CONFIGURATION =====
  // Update these values with your actual contact details
  const CONTACT_INFO = {
    phone1: '+250 784 227 283',
    phone2: '+250 795 425 354',
    whatsapp: '+250 784 227 283',
    email: 'alirwanda@gmail.com',
  }

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-2.5 gap-2">
          
          {/* Left Side - Contact Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Phone Numbers */}
            <div className="flex items-center gap-3">
              <a 
                href={`tel:${CONTACT_INFO.phone1}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary transition-colors duration-200 group"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/20 dark:group-hover:bg-secondary/30 transition-colors">
                  <FiPhone className="w-3 h-3 text-secondary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">{CONTACT_INFO.phone1}</span>
              </a>
              <a 
                href={`tel:${CONTACT_INFO.phone2}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary transition-colors duration-200 group"
              >
                <span className="text-sm font-medium hidden lg:inline">{CONTACT_INFO.phone2}</span>
              </a>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

            {/* WhatsApp */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500 transition-colors duration-200 group"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30 transition-colors">
                <FiMessageCircle className="w-3 h-3 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">WhatsApp: {CONTACT_INFO.whatsapp}</span>
            </a>
          </div>

          {/* Right Side - Email */}
          <div className="flex items-center gap-4">
            <a 
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary transition-colors duration-200 group"
            >
              <div className="w-6 h-6 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/20 dark:group-hover:bg-secondary/30 transition-colors">
                <FiMail className="w-3 h-3 text-secondary" />
              </div>
              <span className="text-sm font-medium hidden md:inline">{CONTACT_INFO.email}</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactBar
