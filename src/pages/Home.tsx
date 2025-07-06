import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTshirt, FaPaintBrush, FaTruck, FaMedal, FaStar, FaChevronDown,
  FaUser, FaShoppingBag, FaPaintBrush as FaDesign, FaCog, FaSignOutAlt,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from 'react-icons/fa';

const Home: React.FC = () => {
  const [counters, setCounters] = useState({
    projects: 0,
    customers: 0,
    guarantee: 0,
    experts: 0
  });

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });

    const countersSection = document.querySelector('.counters');
    if (countersSection) {
      observer.observe(countersSection);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { projects: 125, customers: 200, guarantee: 199, experts: 99 };
    const duration = 2000;
    const steps = 60;
    const stepValue = Object.keys(targets).reduce((acc, key) => {
      acc[key] = targets[key as keyof typeof targets] / steps;
      return acc;
    }, {} as any);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setCounters({
        projects: Math.min(Math.round(stepValue.projects * currentStep), targets.projects),
        customers: Math.min(Math.round(stepValue.customers * currentStep), targets.customers),
        guarantee: Math.min(Math.round(stepValue.guarantee * currentStep), targets.guarantee),
        experts: Math.min(Math.round(stepValue.experts * currentStep), targets.experts)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Create Your Perfect T-Shirt Design</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Express yourself with our professional design tools. Choose from thousands of templates or create your own masterpiece!
          </p>
          <Link
            to="/design-studio"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <FaPaintBrush className="mr-2" />
            Start Designing
          </Link>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            Featured Designs
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full"></div>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
                title: "Vintage Style",
                description: "Classic retro design with modern twist"
              },
              {
                image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
                title: "Minimalist Art",
                description: "Clean and simple design for everyday wear"
              },
              {
                image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
                title: "Urban Street",
                description: "Bold and edgy streetwear design"
              }
            ].map((design, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{design.title}</h3>
                  <p className="text-gray-600 mb-4">{design.description}</p>
                  <Link
                    to="/design-studio"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Use This Design
                    <FaChevronDown className="ml-1 transform rotate-270" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div key="design" className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <FaPaintBrush className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professional Design Tools</h3>
              <p className="text-gray-600">Advanced canvas editor with unlimited possibilities</p>
            </div>
            <div key="templates" className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <FaTshirt className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Thousands of Templates</h3>
              <p className="text-gray-600">Choose from our extensive template library</p>
            </div>
            <div key="shipping" className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <FaTruck className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery to your doorstep</p>
            </div>
            <div key="quality" className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <FaMedal className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">High-quality materials and printing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 counters">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{counters.projects}+</div>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{counters.customers}+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{counters.guarantee}%</div>
              <p className="text-gray-600">Satisfaction Guarantee</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{counters.experts}+</div>
              <p className="text-gray-600">Design Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who trust our platform</p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Today
            <FaChevronDown className="ml-2 transform rotate-270" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">T-Shirt Designer</h3>
              <p className="text-gray-400">Create amazing custom t-shirt designs with our professional tools.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/design-studio" className="text-gray-400 hover:text-white">Design Studio</Link></li>
                <li><Link to="/templates" className="text-gray-400 hover:text-white">Templates</Link></li>
                <li><Link to="/gallery" className="text-gray-400 hover:text-white">Gallery</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaInstagram /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 T-Shirt Designer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 