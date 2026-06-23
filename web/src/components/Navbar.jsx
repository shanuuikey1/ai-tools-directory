import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Wrench, Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white text-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
              <Home size={24} className="text-white" />
            </div>
            <span className="text-gray-900">Ghar Pahuch Seva</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center space-x-1">
                <span>Services</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                <Link to="/services" className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">Services</Link>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">Browse All</a>
              </div>
            </div>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              About Us
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              How It Works
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
              Contact
            </a>

            {user ? (
              <div className="flex items-center space-x-4 pl-8 border-l border-gray-200">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                    <User size={20} />
                    <span>{user.firstName || user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">Profile</Link>
                    <Link to="/bookings" className="block px-4 py-2 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600">Bookings</Link>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 pl-8 border-l border-gray-200">
                <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold">
                  Sign Up
                </Link>
              </div>
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
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
            <Link to="/" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
              Home
            </Link>
            <Link to="/services" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
              Services
            </Link>
            <a href="#" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
              About Us
            </a>
            <a href="#" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
              How It Works
            </a>
            <a href="#" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
              Contact
            </a>
            {user ? (
              <>
                <Link to="/bookings" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
                  Bookings
                </Link>
                <Link to="/profile" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-4 hover:bg-indigo-50 rounded text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
