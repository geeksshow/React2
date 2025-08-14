import { Link } from 'react-router-dom';
import { Leaf, Truck, Shield, Users, TrendingUp, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';

const Home = () => {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Organic Products",
      description: "Premium quality organic agricultural products sourced directly from trusted farmers."
    },
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service to get fresh products to your doorstep."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Quality Assured",
      description: "All products undergo strict quality checks to ensure the best standards."
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Farmer Support",
      description: "Supporting local farmers with fair pricing and sustainable practices."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Market Growth",
      description: "Growing market presence with innovative agricultural solutions."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-600" />,
      title: "Global Reach",
      description: "Expanding our reach to serve customers worldwide with quality products."
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "1000+", label: "Products Available" },
    { number: "50+", label: "Partner Farmers" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-white py-20 lg:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/logo.jpg" 
            alt="Agricultural background"
            className="w-full h-full object-cover opacity-10"
            onError={(e) => {
              // Fallback to a gradient if image fails to load
              e.target.style.display = 'none';
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-green-600">RAW Agro</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl lg:max-w-none">
                Your trusted partner for premium agricultural products. Discover fresh, organic, and sustainable solutions for all your farming needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" className="btn-primary text-lg px-8 py-3">
                  Explore Products
                </Link>
                <button className="btn-secondary text-lg px-8 py-3">
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://healthybuddha.in/image/catalog/Recentblogs/blogs/fresh-vegetables-food.jpg" 
                  alt="Fresh agricultural products"
                  className="w-full h-80 lg:h-96 object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                  }}
                />
                {/* Image overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
              
              {/* Floating quality badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-4 py-2 shadow-lg">
                <div className="text-sm font-semibold">100% Organic</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 z-0"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-300 rounded-full opacity-20 z-0"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-100 rounded-full opacity-30 z-0"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RAW Agro?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              We're committed to providing the highest quality agricultural products while supporting sustainable farming practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300 group">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-4 group-hover:bg-green-200 transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-green-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of satisfied customers who trust RAW Agro for their agricultural needs.
          </p>
          <Link to="/products" className="btn-primary text-lg px-8 py-3">
            Browse Our Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold text-green-400">RAW Agro</span>
              </div>
              <p className="text-gray-300">
                Your trusted partner for premium agricultural products and sustainable farming solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">Home</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-green-400 transition-colors">Products</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@rawagro.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Agro Street, Farm City</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-300 mb-4">
                Stay updated with our latest products and farming tips.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm font-semibold">in</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 RAW Agro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
