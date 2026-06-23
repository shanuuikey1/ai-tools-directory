import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Wrench, Zap, Sparkles, Wind, Hammer, Clock, Star, CheckCircle, ArrowRight, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Home() {
  const stats = [
    { number: '500+', label: 'Verified Professionals' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '4.8+', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: <CheckCircle size={40} className="text-indigo-600" />,
      title: 'Verified Professionals',
      description: 'All service providers are background verified and skilled.',
    },
    {
      icon: <Clock size={40} className="text-indigo-600" />,
      title: 'Fast Booking',
      description: 'Book services in minutes, get done on schedule.',
    },
    {
      icon: <Star size={40} className="text-indigo-600" />,
      title: 'Quality Assured',
      description: 'Rated and reviewed by real customers.',
    },
  ];

  const services = [
    {
      name: 'Home Cleaning',
      price: '₹500 - 800',
      icon: <Home size={40} className="text-indigo-600" />
    },
    {
      name: 'Plumbing',
      price: '₹600 - 1,000',
      icon: <Wrench size={40} className="text-indigo-600" />
    },
    {
      name: 'Electrical',
      price: '₹600 - 1,000',
      icon: <Zap size={40} className="text-indigo-600" />
    },
    {
      name: 'Beauty Services',
      price: '₹1,000 - 1,500',
      icon: <Sparkles size={40} className="text-indigo-600" />
    },
    {
      name: 'AC Service',
      price: '₹800 - 1,200',
      icon: <Wind size={40} className="text-indigo-600" />
    },
    {
      name: 'Carpentry',
      price: '₹800 - 1,500',
      icon: <Hammer size={40} className="text-indigo-600" />
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-indigo-600">
                <CheckCircle size={20} />
                <span className="text-sm font-semibold">Trusted Services, Right at Your Doorstep</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Professional Services <span className="text-indigo-600">at Your Doorstep</span>
              </h1>

              <p className="text-lg text-gray-600">
                Book trusted service providers in Chhindwara. From cleaning to repairs, we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center space-x-2 bg-indigo-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Explore Services</span>
                  <ArrowRight size={20} />
                </Link>
                <button className="inline-flex items-center justify-center space-x-2 border-2 border-indigo-600 text-indigo-600 font-semibold px-8 py-4 rounded-lg hover:bg-indigo-50 transition-all duration-300">
                  <span>How It Works</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</p>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-3xl transform rotate-3"></div>
                <div className="relative bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-2xl">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl h-80 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Wrench size={80} className="mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-semibold">Professional Service</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 bg-white rounded-full px-4 py-3 shadow-lg flex items-center space-x-2">
                    <CheckCircle size={24} className="text-green-500" />
                    <span className="font-semibold text-gray-900">Background Verified<br/><span className="text-xs text-gray-600">Trusted & Experienced</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px]"
              >
                <div className="inline-flex p-4 bg-indigo-100 rounded-full group-hover:bg-indigo-600 transition-colors duration-300">
                  <div className="group-hover:text-white transition-colors duration-300">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-lg text-gray-600">Explore our most requested services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services.map((service, idx) => (
              <Link
                to="/services"
                key={idx}
                className="group bg-white border-2 border-gray-100 p-8 rounded-2xl hover:border-indigo-600 transition-all duration-300 cursor-pointer hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                    <ArrowRight size={20} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Starting from</p>
                <p className="text-2xl font-bold text-indigo-600 mb-6">{service.price}</p>
                <span className="text-indigo-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                  Book Now <ArrowRight size={16} className="ml-2" />
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center border-2 border-indigo-600 text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-all duration-300"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex-1 mb-8 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to get started?</h2>
              <p className="text-xl text-indigo-100">
                Browse thousands of verified service providers and book today
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-white text-indigo-600 font-semibold px-10 py-4 rounded-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <span>Browse All Services</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home size={28} className="text-indigo-600" />
                <h3 className="text-xl font-bold">Ghar Pahuch Seva</h3>
              </div>
              <p className="text-gray-400">
                Professional services at your doorstep in Chhindwara.
              </p>
              <div className="flex space-x-4 mt-6">
                <Facebook size={20} className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                <Instagram size={20} className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
                <MessageCircle size={20} className="text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-indigo-600 transition-colors">Home</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-indigo-600 transition-colors">Services</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">For Customers</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Book a Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Help & Support</a></li>
                <li><Link to="/terms.html" className="text-gray-400 hover:text-indigo-600 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/privacy.html" className="text-gray-400 hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center space-x-2">
                  <span>📧 info@ghar-pahuch-seva.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📱 +91-9999-9999-99</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍 Chhindwara, Madhya Pradesh</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Ghar Pahuch Seva. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
