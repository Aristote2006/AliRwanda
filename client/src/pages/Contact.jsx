import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    toast.success('Message sent successfully! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
          Contact <span className="text-secondary">Us</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Reach out to us and we'll respond as soon as we can.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Get in Touch</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMapPin className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary dark:text-white mb-1">Address</h3>
                <p className="text-gray-600 dark:text-gray-300">Kigali, Rwanda</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPhone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary dark:text-white mb-1">Phone</h3>
                <p className="text-gray-600 dark:text-gray-300">+250 784 227 283</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMail className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary dark:text-white mb-1">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">alirwandaofficial@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-primary dark:text-white mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-primary dark:text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/alirwandaofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/alirwandaofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/alirwandaofficial/?__pwa=1#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field"
                required
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="input-field"
                required
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <FiSend className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-primary dark:text-white mb-2">How long does delivery take?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Delivery typically takes 5-6 hours within Kigali, 1-2 hours in Rubavu, and 6+ hours for other areas in Rwanda. Time varies based on traffic, weather conditions and available branch store in different areas.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-primary dark:text-white mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept mobile money (MTN, Airtel), bank transfers, and cash on delivery for eligible orders.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-primary dark:text-white mb-2">Can I return or exchange products?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we offer returns and exchanges within 2 days of purchase. The product must be in its original condition.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-primary dark:text-white mb-2">How can I track my order?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Once your order is shipped, you'll receive a tracking number via email and SMS to monitor your delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
