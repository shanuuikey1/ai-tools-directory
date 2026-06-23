import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon, Wrench, Zap, Sparkles, Wind, Hammer,
  Clock, Star, ShieldCheck, CheckCircle, ArrowRight, Play,
  User, ThumbsUp, Calendar, LayoutGrid,
  Facebook, Instagram, MessageCircle, Mail, Phone, MapPin,
} from 'lucide-react';

export default function Home() {
  const [heroError, setHeroError] = useState(false);

  const stats = [
    { icon: <User size={20} className="text-blue-600" />, number: '500+', label: 'Verified Professionals' },
    { icon: <ThumbsUp size={20} className="text-blue-600" />, number: '10K+', label: 'Happy Customers' },
    { icon: <Star size={20} className="text-yellow-400 fill-yellow-400" />, number: '4.8★', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: <ShieldCheck size={26} className="text-blue-600" />,
      bg: 'bg-blue-100',
      title: 'Verified Professionals',
      description: 'All service providers are background verified and skilled.',
    },
    {
      icon: <Clock size={26} className="text-green-500" />,
      bg: 'bg-green-100',
      title: 'Fast Booking',
      description: 'Book services in minutes, get done on schedule.',
    },
    {
      icon: <Star size={26} className="text-yellow-500 fill-yellow-500" />,
      bg: 'bg-yellow-100',
      title: 'Quality Assured',
      description: 'Rated and reviewed by real customers.',
    },
  ];

  const services = [
    { name: 'Home Cleaning', price: '₹500 - 800', icon: <HomeIcon size={26} className="text-blue-600" />, bg: 'bg-blue-100' },
    { name: 'Plumbing', price: '₹600 - 1,000', icon: <Wrench size={26} className="text-blue-500" />, bg: 'bg-blue-100' },
    { name: 'Electrical', price: '₹600 - 1,000', icon: <Zap size={26} className="text-yellow-500 fill-yellow-500" />, bg: 'bg-yellow-100' },
    { name: 'Beauty Services', price: '₹1,000 - 1,500', icon: <Sparkles size={26} className="text-pink-500" />, bg: 'bg-pink-100' },
    { name: 'AC Service', price: '₹800 - 1,200', icon: <Wind size={26} className="text-teal-500" />, bg: 'bg-teal-100' },
    { name: 'Carpentry', price: '₹800 - 1,500', icon: <Hammer size={26} className="text-orange-500" />, bg: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-blue-100">
                <CheckCircle size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Trusted Services, Right at Your Doorstep</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1]">
                Professional Services <span className="text-blue-600">at Your Doorstep</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Book trusted service providers in Chhindwara. From cleaning to repairs, we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/20 hover:shadow-xl"
                >
                  <span>Explore Services</span>
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#how-it-works"
                  className="group inline-flex items-center justify-center space-x-3 text-gray-800 font-semibold px-2 py-3.5 transition-colors hover:text-blue-600"
                >
                  <span className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <Play size={18} className="text-blue-600 fill-blue-600 group-hover:text-white group-hover:fill-white transition-colors duration-300 ml-0.5" />
                  </span>
                  <span>How It Works</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg">
                {stats.map((stat, idx) => (
                  <div key={idx} className="animate-fade-up" style={{ animationDelay: `${0.15 + idx * 0.1}s` }}>
                    <div className="flex items-center space-x-2">
                      {stat.icon}
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative hidden lg:block animate-fade-in">
              {/* decorative blue shape */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem]"></div>
              <div className="absolute right-10 top-6 w-24 h-24 opacity-20"
                   style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '14px 14px' }}></div>

              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white">
                {heroError ? (
                  <div className="w-full h-[460px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white">
                    <div className="text-center px-6">
                      <Wrench size={72} className="mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-semibold">Add your hero photo</p>
                      <p className="text-sm opacity-75 mt-1">Drop an image at <code>web/public/hero.png</code></p>
                    </div>
                  </div>
                ) : (
                  <img
                    src="/hero.png"
                    alt="Professional service worker"
                    className="w-full h-[460px] object-cover"
                    onError={() => setHeroError(true)}
                  />
                )}
              </div>

              {/* floating verified badge */}
              <div className="absolute bottom-6 right-6 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center space-x-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">Background Verified</p>
                  <p className="text-xs text-gray-500">Trusted &amp; Experienced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="about" className="relative -mt-8 z-10 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-100">
            {features.map((feature, idx) => (
              <div key={idx} className="group flex items-start space-x-4 px-0 md:px-8 py-4 md:py-0">
                <div className={`shrink-0 w-14 h-14 ${feature.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR SERVICES ===================== */}
      <section id="services" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Popular Services</h2>
            <p className="text-lg text-gray-500">Explore our most requested services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {services.map((service, idx) => (
              <Link
                to="/services"
                key={idx}
                className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`shrink-0 w-14 h-14 ${service.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Starting from</p>
                    <p className="text-xl font-bold text-gray-900">{service.price}</p>
                    <span className="mt-3 inline-flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                      Book Now <ArrowRight size={15} className="ml-1.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              <LayoutGrid size={18} />
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 md:px-12 py-10 md:py-12">
            <div className="absolute right-0 bottom-0 w-40 h-40 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '18px 18px' }}></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-5 text-white">
                <div className="shrink-0 w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
                  <Calendar size={30} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Ready to get started?</h2>
                  <p className="text-blue-100">Browse thousands of verified service providers and book today</p>
                </div>
              </div>
              <Link
                to="/services"
                className="shrink-0 inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold px-7 py-3.5 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <span>Browse All Services</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer id="contact" className="bg-[#0f1c34] text-white pt-16 pb-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <HomeIcon size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg">Ghar Pahuch Seva</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional services at your doorstep in Chhindwara.
              </p>
              <div className="flex space-x-3 mt-5">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Facebook size={17} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <Instagram size={17} />
                </a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300 cursor-pointer">
                  <MessageCircle size={17} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* For Customers */}
            <div>
              <h4 className="font-semibold mb-5">For Customers</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Book a Service</Link></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="mailto:info@gharpahuchseva.com?subject=Support Request" className="text-gray-400 hover:text-white transition-colors">Help &amp; Support</a></li>
                <li><a href="/terms.html" target="_blank" className="text-gray-400 hover:text-white transition-colors">Terms &amp; Conditions</a></li>
                <li><a href="/privacy.html" target="_blank" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-5">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="mailto:info@gharpahuchseva.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300 group">
                    <Mail size={17} className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors">info@gharpahuchseva.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919999999999" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300 group">
                    <Phone size={17} className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors">+91-9999-9999-99</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.google.com/maps/search/Chhindwara,+Madhya+Pradesh" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300 group">
                    <MapPin size={17} className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:text-blue-400 transition-colors">Chhindwara, Madhya Pradesh</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Ghar Pahuch Seva. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-up { animation: fadeUp 0.7s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}
