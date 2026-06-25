import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        isActive(to) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
      aria-current={isActive(to) ? 'page' : undefined}
    >
      {label}
      {isActive(to) && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-gray-100/60 sticky top-0 z-50 shadow-[0_2px_15px_rgba(0,0,0,0.015)]" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5" aria-label="Ghar Pahuch Seva home">
            {logoError ? (
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Home size={26} className="text-white" aria-hidden="true" />
              </div>
            ) : (
              <img
                src="/logo.png"
                alt="Ghar Pahuch Seva"
                className="w-14 h-14 object-contain"
                onError={() => setLogoError(true)}
              />
            )}
            <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Ghar Pahuch Seva</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLink('/', t('nav.home'))}

            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="Services menu"
              >
                <span>{t('nav.services')}</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
              </button>
              <div className="absolute left-0 top-full pt-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <Link to="/services" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.allServices')}</Link>
                  <Link to="/services?category=Cleaning" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.homeCleaning')}</Link>
                  <Link to="/services?category=Plumbing" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.plumbing')}</Link>
                  <Link to="/services?category=Electrical" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.electrical')}</Link>
                  <Link to="/services?category=Beauty" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.beauty')}</Link>
                  <Link to="/services?category=AC%20Repair" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.acRepair')}</Link>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">{t('nav.about')}</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">{t('nav.howItWorks')}</Link>

            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded="false"
                aria-label="More options menu"
              >
                <span>{t('nav.more')}</span>
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
              </button>
              <div className="absolute left-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                  <Link to="/help" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.help')}</Link>
                  <a href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.contact')}</a>
                  <hr className="my-2" />
                  <Link to="/professional" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.becomePro')}</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side auth */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={toggleLang}
              className="flex items-center space-x-1.5 text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-200 border border-gray-200 hover:border-blue-300 rounded-lg px-3 py-1.5"
              aria-label={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              title={t('nav.language')}
            >
              <Globe size={16} aria-hidden="true" />
              <span>{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>
            {user ? (
              <>
                <div className="relative group">
                  <button
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-label={`User menu for ${user.firstName || user.email}`}
                  >
                    <User size={20} aria-hidden="true" />
                    <span>{user.firstName || user.email}</span>
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
                  </button>
                  <div className="absolute right-0 top-full pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                      <Link to="/profile" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.profile')}</Link>
                      <Link to="/bookings" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">{t('nav.myBookings')}</Link>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  aria-label="Log out of your account"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200" aria-label="Log in to your account">
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                  aria-label="Create a new account"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-900"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            <button
              onClick={() => { toggleLang(); }}
              className="flex items-center space-x-2 w-full text-left py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 font-semibold"
              aria-label={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            >
              <Globe size={18} aria-hidden="true" />
              <span>{lang === 'en' ? 'हिंदी में देखें' : 'View in English'}</span>
            </button>
            <Link to="/" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.home')}</Link>
            <Link to="/services" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.services')}</Link>
            <Link to="/about" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.about')}</Link>
            <Link to="/how-it-works" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.howItWorks')}</Link>
            <Link to="/help" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.help')}</Link>
            <a href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.contactShort')}</a>
            <button onClick={() => { setIsOpen(false); navigate('/professional'); }} className="block w-full text-left py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 border-t border-gray-100 mt-2 pt-3">{t('nav.becomePro')}</button>
            {user ? (
              <>
                <Link to="/bookings" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.myBookings')}</Link>
                <Link to="/profile" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.profile')}</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2.5 px-4 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600">{t('nav.login')}</Link>
                <Link to="/register" className="block py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-semibold">{t('nav.signup')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
