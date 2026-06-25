import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon, Wrench, Zap, Sparkles, Wind, Hammer,
  Clock, Star, ShieldCheck, CheckCircle, ArrowRight, Play,
  User, ThumbsUp, Calendar, LayoutGrid, ChevronDown,
  Facebook, Instagram, MessageCircle, Mail, Phone, MapPin,
  ArrowUpRight, Award, Smile, ShieldAlert
} from 'lucide-react';

export default function Home() {
  const [heroError, setHeroError] = useState(false);
  const [footerLogoError, setFooterLogoError] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { icon: <User size={22} className="text-indigo-600" />, number: '500+', label: 'Verified Professionals' },
    { icon: <ThumbsUp size={22} className="text-emerald-600" />, number: '10K+', label: 'Happy Customers' },
    { icon: <Star size={22} className="text-amber-500 fill-amber-500" />, number: '4.8★', label: 'Average Rating' },
  ];

  const features = [
    {
      icon: <ShieldCheck size={28} className="text-indigo-600" />,
      bg: 'bg-indigo-100/60 text-indigo-700 border-indigo-200/50',
      title: 'Verified Experts',
      description: 'Every professional undergoes strict background and skill checks.',
    },
    {
      icon: <Clock size={28} className="text-emerald-600" />,
      bg: 'bg-emerald-100/60 text-emerald-700 border-emerald-200/50',
      title: 'Instant Booking',
      description: 'Book home services in under two minutes with guaranteed schedules.',
    },
    {
      icon: <Award size={28} className="text-amber-500" />,
      bg: 'bg-amber-100/60 text-amber-700 border-amber-200/50',
      title: 'Satisfaction Promised',
      description: 'Our top priority is your happiness, backed by premium support.',
    },
  ];

  const services = [
    { name: 'Home Cleaning', price: '₹500 - 800', icon: <HomeIcon size={28} className="text-indigo-600" />, bg: 'from-indigo-500/10 to-indigo-600/5 border-indigo-100' },
    { name: 'Plumbing Services', price: '₹600 - 1,000', icon: <Wrench size={28} className="text-sky-600" />, bg: 'from-sky-500/10 to-sky-600/5 border-sky-100' },
    { name: 'Electrical Works', price: '₹600 - 1,000', icon: <Zap size={28} className="text-amber-500 fill-amber-500/20" />, bg: 'from-amber-500/10 to-amber-600/5 border-amber-100' },
    { name: 'Beauty & Grooming', price: '₹1,000 - 1,500', icon: <Sparkles size={28} className="text-pink-500" />, bg: 'from-pink-500/10 to-pink-600/5 border-pink-100' },
    { name: 'AC Servicing', price: '₹800 - 1,200', icon: <Wind size={28} className="text-teal-500" />, bg: 'from-teal-500/10 to-teal-600/5 border-teal-100' },
    { name: 'Carpentry', price: '₹800 - 1,500', icon: <Hammer size={28} className="text-orange-500" />, bg: 'from-orange-500/10 to-orange-600/5 border-orange-100' },
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-8 pb-20 md:py-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        {/* Glowing Ambient Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse pointer-events-none"></div>
        <div className="absolute top-12 right-1/4 w-[400px] h-[400px] bg-sky-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-indigo-50/85 backdrop-blur-md border border-indigo-100/80 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-default mx-auto lg:mx-0">
                <CheckCircle size={16} className="text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs md:text-sm font-semibold text-indigo-900 tracking-wide">Trusted Home Services, On Demand</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-gray-900 leading-[1.05]">
                Professional services <br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                  at your doorstep
                </span>
              </h1>

              <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Book premium, vetted service professionals in Chhindwara. From deep cleaning to expert repairs, enjoy flat-rate transparent pricing and guaranteed satisfaction.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35"
                >
                  <span>Explore Services</span>
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#how-it-works"
                  className="group w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white/80 hover:bg-white backdrop-blur border border-gray-200/80 hover:border-indigo-600/50 text-gray-800 font-bold px-7 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                    <Play size={14} className="text-indigo-600 fill-indigo-600 group-hover:text-white group-hover:fill-white transition-colors duration-300 ml-0.5" />
                  </span>
                  <span className="text-gray-700 group-hover:text-indigo-700 transition-colors">How It Works</span>
                </a>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-6 pt-10 max-w-lg mx-auto lg:mx-0 border-t border-gray-100">
                {stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-center lg:justify-start space-x-2">
                      {stat.icon}
                      <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{stat.number}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image/Illustration Column */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Asymmetric Gradient Frame behind the photo */}
              <div className="absolute -right-4 -bottom-4 w-full h-full bg-gradient-to-tr from-indigo-500 via-blue-500 to-purple-600 rounded-[2.5rem] transform rotate-1 opacity-10"></div>
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[90%] h-[95%] bg-gradient-to-br from-indigo-100 to-sky-100 rounded-[2.5rem] -z-10 transform -rotate-2"></div>
              
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white group hover:scale-[1.01] transition-transform duration-500">
                {heroError ? (
                  <div className="w-full h-[480px] bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-800 flex items-center justify-center text-white">
                    <div className="text-center px-6 space-y-4">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur">
                        <Wrench size={38} className="text-indigo-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-extrabold">Professional Services</p>
                        <p className="text-sm text-indigo-200">Ghar Pahuch Seva Chhindwara</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src="/hero.png"
                    alt="Professional service worker"
                    className="w-full h-[480px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={() => setHeroError(true)}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute bottom-8 -left-6 bg-white/90 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-xl flex items-center space-x-3.5 transform hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shadow-inner">
                  <ShieldCheck size={24} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900 text-sm tracking-tight">100% Certified</p>
                  <p className="text-[11px] text-gray-500 font-semibold">Background Verified</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ===================== TRUST/FEATURES ===================== */}
      <section id="about" className="relative -mt-10 z-20 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.05)] border border-gray-100/60 p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-gray-100">
            {features.map((feature, idx) => (
              <div key={idx} className="group flex items-start space-x-5 px-0 md:px-6 py-2 md:py-0">
                <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${feature.bg} shadow-sm group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== POPULAR SERVICES ===================== */}
      <section id="services" className="py-20 md:py-28 relative">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs md:text-sm font-extrabold text-indigo-600 tracking-widest uppercase">Our Service Catalog</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Popular Services</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed font-normal">
              Select a category to browse local verified experts and secure immediate booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, idx) => (
              <Link
                to="/services"
                key={idx}
                className="group bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-indigo-200 p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex flex-col h-full justify-between space-y-8">
                  <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.bg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      {service.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 text-gray-400 shadow-inner">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{service.name}</h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs text-gray-400 font-medium">Starts from</span>
                      <span className="text-2xl font-black text-indigo-600 tracking-tight">{service.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2.5 bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-800 font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow transition-all duration-300"
            >
              <LayoutGrid size={18} className="text-gray-500" />
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CTA BANNER ===================== */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-[#0f1c34] rounded-3xl px-8 md:px-16 py-12 md:py-16 shadow-2xl">
            {/* Background patterns */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="shrink-0 w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md">
                  <Calendar size={28} className="text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Ready to get started?</h2>
                  <p className="text-gray-400 text-sm md:text-base font-normal max-w-xl">
                    Onboard as a customer to schedule services, track professionals, or join us as a provider to grow your business in Chhindwara.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Link
                  to="/services"
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20"
                >
                  <span>Book a Service</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/professional"
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
                >
                  <span>Join as Professional</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="bg-gray-50/70 py-20 md:py-28 relative border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs md:text-sm font-extrabold text-indigo-600 tracking-widest uppercase">Our Commitment</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Why Choose Us?</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
              We bring trust, transparency, and top-tier professionalism to the local services sector in Chhindwara.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Verified Experts', value: '500+', desc: 'Thorough background & identity checks.', icon: '🛡️', color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Happy Customers', value: '10K+', desc: 'Highly rated home services completed.', icon: '😊', color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Dedicated Support', value: '24/7', desc: 'Real-time booking and resolution assistance.', icon: '💬', color: 'text-sky-600 bg-sky-50' },
              { label: 'Average Rating', value: '4.8★', desc: 'Consistently high customer feedback scores.', icon: '⭐', color: 'text-amber-500 bg-amber-50' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-gray-100/80 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl mx-auto mb-6 shadow-sm`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-gray-900 tracking-tight mb-2">{stat.value}</p>
                <p className="font-bold text-gray-800 text-sm mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500 font-normal leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs md:text-sm font-extrabold text-indigo-600 tracking-widest uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">What Our Customers Say</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
              Read honest experiences from families and professionals using our marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'Homeowner, Chhindwara',
                text: 'Finding a reliable plumber used to take hours. On Ghar Pahuch Seva, I booked a verified professional in minutes. The work was clean and affordable.',
                rating: 5,
                avatar: 'PS'
              },
              {
                name: 'Rajesh Patel',
                role: 'Business Owner, Ward No. 12',
                text: 'Excellent electrical service for our shop. The technician was certified, wore a proper ID, and solved our complex wiring issue efficiently.',
                rating: 5,
                avatar: 'RP'
              },
              {
                name: 'Meera Gupta',
                role: 'Resident, Parasia Road',
                text: 'The deep home cleaning service was outstanding. The team arrived fully equipped, worked professionally, and left the house spotless. Absolute value for money.',
                rating: 5,
                avatar: 'MG'
              },
            ].map((review, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic text-sm leading-relaxed">"{review.text}"</p>
                </div>
                
                <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm tracking-tight">{review.name}</p>
                    <p className="text-[11px] text-gray-500 font-semibold">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FAQS ===================== */}
      <section className="bg-gray-50/70 py-20 md:py-28 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs md:text-sm font-extrabold text-indigo-600 tracking-widest uppercase">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
              Find quick answers to common operational questions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How do I book a service on the platform?',
                a: 'Simply click "Book a Service", choose a category, pick your preferred date and time, fill in your address, and complete the secure payment. A verified local expert will be assigned to your job.',
              },
              {
                q: 'Are the service professionals background verified?',
                a: 'Absolutely. Every service professional undergoes background screening and government ID (Aadhar/PAN) checks before they are verified and allowed to accept bookings.',
              },
              {
                q: 'What if I am not satisfied with the service?',
                a: 'Customer satisfaction is our promise. If the service quality does not meet standard expectations, contact our support team within 24 hours to coordinate a resolution or refund.',
              },
              {
                q: 'How are payments and cancellations handled?',
                a: 'Payments are securely processed online via Razorpay (UPI, Cards, NetBanking). You can cancel your booking directly from your customer dashboard. Refund processing conforms to our transparent cancellation policy.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-100/80 rounded-2xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.005)] transition-all duration-300">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={activeFaq === idx}
                >
                  <span className="font-extrabold text-gray-900 text-sm md:text-base tracking-tight">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-indigo-600 shrink-0 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    activeFaq === idx ? 'max-h-40 border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-xs md:text-sm text-gray-600 leading-relaxed font-normal bg-gray-50/30">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 mb-3 font-normal">Still have unanswered questions?</p>
            <Link
              to="/help"
              className="inline-flex items-center space-x-1.5 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              <span>View All Support FAQs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== SAFE & SECURE BADGES ===================== */}
      <section className="py-20 md:py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs md:text-sm font-extrabold text-indigo-600 tracking-widest uppercase">Security</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">Safe &amp; Secure</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed">
              Your security, privacy, and peace of mind are built into every step of our platform.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🔒', title: 'Vetted Providers', desc: 'Thorough identity checks' },
              { icon: '💳', title: 'Secure Payments', desc: 'Razorpay encrypted checkout' },
              { icon: '💬', title: 'Verified Ratings', desc: 'Reviews from real bookings' },
              { icon: '🛡️', title: 'Service Insurance', desc: 'Protection for your home' },
            ].map((badge, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
                  {badge.icon}
                </div>
                <p className="font-extrabold text-gray-900 text-sm tracking-tight">{badge.title}</p>
                <p className="text-xs text-gray-500 font-medium">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer id="contact" className="bg-[#0b1220] text-white pt-20 pb-8 scroll-mt-24 relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            
            {/* Brand column */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5">
                {footerLogoError ? (
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <HomeIcon size={24} className="text-white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1 shrink-0">
                    <img
                      src="/logo.png"
                      alt="Ghar Pahuch Seva"
                      className="w-full h-full object-contain"
                      onError={() => setFooterLogoError(true)}
                    />
                  </div>
                )}
                <span className="font-extrabold text-xl tracking-tight">Ghar Pahuch Seva</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Connecting skilled local professionals with household customers in Chhindwara. Premium quality home services, guaranteed.
              </p>
              <div className="flex space-x-3.5 pt-2">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300">
                  <Facebook size={18} />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-extrabold text-base tracking-tight border-b border-gray-800 pb-2.5">Quick Links</h4>
              <ul className="space-y-3.5 text-sm text-gray-400 font-medium">
                <li><Link to="/" className="hover:text-white transition-colors duration-200">Home Page</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors duration-200">Services Catalog</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors duration-200">About Our Company</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors duration-200">How Platform Works</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors duration-200">User Login</Link></li>
              </ul>
            </div>

            {/* Customers Area */}
            <div className="space-y-6">
              <h4 className="font-extrabold text-base tracking-tight border-b border-gray-800 pb-2.5">For Customers</h4>
              <ul className="space-y-3.5 text-sm text-gray-400 font-medium">
                <li><Link to="/services" className="hover:text-white transition-colors duration-200">Schedule Service</Link></li>
                <li><a href="mailto:support@gharpahuchseva.com?subject=Help Request" className="hover:text-white transition-colors duration-200">Help &amp; Support</a></li>
                <li><Link to="/help" className="hover:text-white transition-colors duration-200">FAQs &amp; Guidelines</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <h4 className="font-extrabold text-base tracking-tight border-b border-gray-800 pb-2.5">Contact Us</h4>
              <ul className="space-y-4 text-sm text-gray-400 font-medium">
                <li>
                  <a href="mailto:info@gharpahuchseva.com" className="flex items-center space-x-3.5 hover:text-indigo-400 transition-colors duration-200 group">
                    <Mail size={18} className="text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span>info@gharpahuchseva.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919999999999" className="flex items-center space-x-3.5 hover:text-indigo-400 transition-colors duration-200 group">
                    <Phone size={18} className="text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span>+91-9999-9999-99</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.google.com/maps/search/Chhindwara,+Madhya+Pradesh" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3.5 hover:text-indigo-400 transition-colors duration-200 group">
                    <MapPin size={18} className="text-indigo-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span>Chhindwara, MP, India</span>
                  </a>
                </li>
              </ul>
            </div>
            
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs font-semibold gap-4">
            <p>&copy; 2026 Ghar Pahuch Seva. All rights reserved.</p>
            <p className="font-normal text-[11px] text-gray-600">Designed for modern on-demand hyperlocal marketplaces.</p>
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
