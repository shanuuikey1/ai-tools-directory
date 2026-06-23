import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigate to a Home-page section from anywhere, then smooth-scroll to it.
  const goToSection = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`relative font-medium transition-colors duration-200 py-1 ${
        isActive(to)
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {label}
      {isActive(to) && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            {logoError ? (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Home size={22} className="text-white" />
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="Ghar Pahuch Seva"
                className="w-10 h-10 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <span className="font-bold text-xl text-blue-600">Ghar Pahuch Seva</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLink('/', 'Home')}

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                <span>Services</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 top-full pt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <Link to="/services" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">All Services</Link>
                  <Link to="/services" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Home Cleaning</Link>
                  <Link to="/services" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Plumbing &amp; Electrical</Link>
                  <Link to="/services" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Beauty &amp; AC Repair</Link>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">About Us</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">How It Works</Link>

            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                <span>More</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <Link to="/help" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Help & Support</Link>
                  <a href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Contact Us</a>
                  <hr className="my-2" />
                  <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Become a Professional</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side auth */}
          <div className="hidden md:flex items-center space-x-5">
            {user ? (
              <>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                    <User size={20} />
                    <span>{user.firstName || user.email}</span>
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute right-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      <Link to="/profile" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">Profile</Link>
                      <Link to="/bookings" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Bookings</Link>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            <Link to="/" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/services" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Services</Link>
            <Link to="/about" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">About Us</Link>
            <Link to="/how-it-works" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">How It Works</Link>
            <Link to="/help" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Help & Support</Link>
            <a href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Contact</a>
            <button className="block w-full text-left py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 border-t border-gray-100 mt-2 pt-3">Become a Professional</button>
            {user ? (
              <>
                <Link to="/bookings" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">My Bookings</Link>
                <Link to="/profile" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="block py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
