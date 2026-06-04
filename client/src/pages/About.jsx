import { FiShoppingBag, FiTruck, FiHeadphones, FiShield } from 'react-icons/fi'

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
          About <span className="text-secondary">AliRwanda</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your trusted online shopping destination in Rwanda. We're committed to bringing you quality products, fast delivery, and exceptional customer service.
        </p>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              AliRwanda was founded with a simple mission: to make quality products accessible to everyone in Rwanda. We believe that shopping should be easy, affordable, and enjoyable.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Since our launch, we've grown from a small startup to become one of Rwanda's leading e-commerce platforms. Our success is built on trust, quality, and a deep understanding of our customers' needs.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We work directly with suppliers and manufacturers to ensure that every product meets our high standards. Our team is dedicated to providing you with the best shopping experience possible.
            </p>
          </div>
          <div className="card p-8 flex items-center justify-center">
            <img
              src="/assets/images/alirwanda.jpeg"
              alt="AliRwanda Logo"
              className="rounded-lg shadow-lg w-full h-80 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Quality Products</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We carefully select each product to ensure it meets our quality standards.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quick and reliable delivery across Rwanda to get your products to you faster.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeadphones className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Customer Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our dedicated team is always ready to help you with any questions or concerns.
            </p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShield className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">Secure Shopping</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your security and privacy are our top priorities. Shop with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="mb-16">
        <div className="card p-8 md:p-12 bg-gradient-to-r from-primary to-gray-800 text-white">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            To revolutionize e-commerce in Rwanda by providing a seamless, secure, and enjoyable shopping experience that empowers local businesses and connects customers with quality products from around the world.
          </p>
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            To become Rwanda's most trusted and preferred online shopping destination, known for our commitment to quality, innovation, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-primary dark:text-white mb-8 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-40 h-40 bg-gradient-to-br from-secondary to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="https://i.imgur.com/Sdp2LA2.png"
                alt="CEO"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'auto', imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-1">Aristote BUKOZI</h3>
            <p className="text-secondary font-medium mb-3">CEO & Founder</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Leading the vision and strategy of AliRwanda. Passionate about e-commerce innovation in Rwanda.
            </p>
          </div>

          <div className="card p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-40 h-40 bg-gradient-to-br from-secondary to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="https://i.imgur.com/MlA4j50.png"
                alt="Operations Manager"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'auto', imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-1">Samuel Mucyo</h3>
            <p className="text-secondary font-medium mb-3">COO & Founder</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Ensuring smooth operations and excellent customer service. Expert in logistics and supply chain management.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
