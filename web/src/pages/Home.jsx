import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Wrench size={32} className="text-blue-600" />,
      title: 'Professional Services',
      description: 'Verified and experienced service providers',
    },
    {
      icon: <Clock size={32} className="text-blue-600" />,
      title: 'Fast Booking',
      description: 'Book services in minutes, get done on schedule',
    },
    {
      icon: <Star size={32} className="text-blue-600" />,
      title: 'Quality Assured',
      description: 'Rated and reviewed by real customers',
    },
  ];

  const services = [
    { name: 'Home Cleaning', price: '₹500-800' },
    { name: 'Plumbing', price: '₹600-1000' },
    { name: 'Electrical', price: '₹600-1000' },
    { name: 'Beauty Services', price: '₹1000-1500' },
    { name: 'AC Service', price: '₹800-1200' },
    { name: 'Carpentry', price: '₹800-1500' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                Professional Services at Your Doorstep
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Book trusted service providers in Chhindwara. From cleaning to repairs, we've got you covered.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
              >
                <span>Explore Services</span>
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-100 rounded-lg h-96 flex items-center justify-center">
                <Wrench size={150} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Ghar Pahuch Seva?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Services</h2>
          <p className="text-center text-gray-600 mb-12">Explore our most requested services</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <Wrench className="text-blue-600" size={24} />
                </div>
                <p className="text-gray-600 my-2">Starting from</p>
                <p className="text-2xl font-bold text-blue-600 mb-4">{service.price}</p>
                <Link
                  to="/services"
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center space-x-2"
                >
                  <span>Book Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Browse thousands of verified service providers and book today
          </p>
          <Link
            to="/services"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Browse All Services
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Ghar Pahuch Seva</h3>
              <p className="text-gray-400">
                Professional services at your doorstep in Chhindwara
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="text-gray-400 space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: info@urbanservices.com<br />
                Phone: +91-9999-9999-99
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Ghar Pahuch Seva. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
