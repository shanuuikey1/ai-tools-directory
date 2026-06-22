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
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Wrench size={28} />
            <span>Urban Services</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-100">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/services" className="flex items-center space-x-1 hover:text-blue-100">
              <Wrench size={20} />
              <span>Services</span>
            </Link>

            {user ? (
              <>
                <Link to="/bookings" className="flex items-center space-x-1 hover:text-blue-100">
                  <Calendar size={20} />
                  <span>Bookings</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-1 hover:text-blue-100">
                    <User size={20} />
                    <span>{user.firstName || user.email}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-blue-100"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-100">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 px-4 hover:bg-blue-700 rounded">
              Home
            </Link>
            <Link to="/services" className="block py-2 px-4 hover:bg-blue-700 rounded">
              Services
            </Link>
            {user ? (
              <>
                <Link to="/bookings" className="block py-2 px-4 hover:bg-blue-700 rounded">
                  Bookings
                </Link>
                <Link to="/profile" className="block py-2 px-4 hover:bg-blue-700 rounded">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 hover:bg-blue-700 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-4 hover:bg-blue-700 rounded">
                  Login
                </Link>
                <Link to="/register" className="block py-2 px-4 hover:bg-blue-700 rounded">
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
