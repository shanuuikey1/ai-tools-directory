import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Phone, Briefcase, CheckCircle, ArrowRight, Clock, Shield, Star } from 'lucide-react';

export default function HowItWorks() {
  const customerSteps = [
    {
      icon: <Search size={32} className="text-blue-600" />,
      number: '1',
      title: 'Browse Services',
      description: 'Search for the service you need from our catalog of verified professionals.',
    },
    {
      icon: <Phone size={32} className="text-blue-600" />,
      number: '2',
      title: 'Connect',
      description: 'View provider profiles, ratings, and reviews. Choose the right fit for your needs.',
    },
    {
      icon: <Briefcase size={32} className="text-blue-600" />,
      number: '3',
      title: 'Book & Confirm',
      description: 'Select your date and time. Confirm the booking and receive instant confirmation.',
    },
    {
      icon: <CheckCircle size={32} className="text-blue-600" />,
      number: '4',
      title: 'Service Complete',
      description: 'Professional arrives on time. Service is completed. Rate and review the experience.',
    },
  ];

  const providerSteps = [
    {
      number: '1',
      title: 'Get Verified',
      description: 'Complete your profile and pass our background verification. Takes 24-48 hours.',
    },
    {
      number: '2',
      title: 'Set Your Services',
      description: 'List your services, pricing, and availability on the platform.',
    },
    {
      number: '3',
      title: 'Receive Bookings',
      description: 'Get real-time notifications for service requests from verified customers.',
    },
    {
      number: '4',
      title: 'Grow Your Business',
      description: 'Earn 75% commission on every booking. Build your reputation through ratings.',
    },
  ];

  const benefits = [
    { icon: <Shield size={24} />, label: 'Verified Professionals' },
    { icon: <Clock size={24} />, label: 'On-Time Service' },
    { icon: <Star size={24} />, label: 'Rated & Reviewed' },
    { icon: <CheckCircle size={24} />, label: 'Payment Secure' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            How <span className="text-blue-600">Ghar Pahuch Seva</span> Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, transparent, and secure. Book services in minutes or start earning as a professional.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Customers</h2>
            <p className="text-gray-600">Get trusted services in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customerSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white border-2 border-gray-100 p-8 rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-5xl font-bold text-gray-200">{step.number}</div>
                    <div className="bg-blue-50 p-4 rounded-xl">{step.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {idx < customerSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Providers */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">For Service Professionals</h2>
            <p className="text-gray-600">Grow your business with Ghar Pahuch Seva</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {providerSteps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 ml-18">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">Ready to grow your business?</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold">
              Join as a Professional
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Ghar Pahuch Seva?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <p className="font-semibold text-gray-900">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-blue-100 mb-8">Book your first service or join our professional network today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold"
            >
              <span>Book a Service</span>
              <ArrowRight size={20} />
            </Link>
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-300 font-semibold">
              Become a Professional
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
