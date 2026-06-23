import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, ArrowRight, Briefcase, TrendingUp, Users, Shield, Loader } from 'lucide-react';

export default function Professional() {
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    experience: '',
    price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formStep < 3) {
      setFormStep(formStep + 1);
    } else {
      // Submit to backend
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.post(`${apiUrl}/professionals/apply`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          experience: parseInt(formData.experience),
          price: parseFloat(formData.price),
        });

        setSuccess(true);
        setFormStep(1);
        setFormData({ name: '', email: '', phone: '', service: '', experience: '', price: '' });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit application');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const benefits = [
    {
      icon: <TrendingUp size={32} className="text-blue-600" />,
      title: 'Grow Your Business',
      description: 'Access thousands of verified customers in Chhindwara',
    },
    {
      icon: <Users size={32} className="text-blue-600" />,
      title: 'More Bookings',
      description: 'Get consistent service requests from our platform',
    },
    {
      icon: <Shield size={32} className="text-blue-600" />,
      title: 'Secure Payments',
      description: 'Guaranteed payment for every completed service',
    },
    {
      icon: <Briefcase size={32} className="text-blue-600" />,
      title: 'Professional Tools',
      description: 'Manage bookings, ratings, and earnings easily',
    },
  ];

  const requirements = [
    'Valid government ID',
    'Age 18 or above',
    'Background verification clearance',
    'Professional experience in your field',
    'Reliable phone for customer contact',
  ];

  const steps = [
    { number: '1', title: 'Sign Up', description: 'Complete your profile with basic details' },
    { number: '2', title: 'Verification', description: 'We verify your background (24-48 hours)' },
    { number: '3', title: 'Go Live', description: 'Start receiving bookings and earn money' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Grow Your Service <span className="text-blue-600">Business</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join 500+ service professionals earning ₹15,000 - ₹50,000+ per month on Ghar Pahuch Seva
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Join Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Getting Started is Easy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Info */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Earn 75% Commission</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold">₹500</p>
                <p className="text-blue-100">Service Price</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight size={32} className="text-blue-200" />
              </div>
              <div>
                <p className="text-4xl font-bold text-green-300">₹375</p>
                <p className="text-blue-100">You Keep</p>
              </div>
            </div>
            <p className="text-blue-100 mt-8">25% platform fee • Instant payment • No hidden charges</p>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Requirements</h2>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <ul className="space-y-4">
              {requirements.map((req, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  <CheckCircle size={24} className="text-green-600 shrink-0" />
                  <span className="text-gray-700 font-medium">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Join Now</h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {/* Success Message */}
            {success && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">Application Submitted!</h3>
                <p className="text-green-700 mb-4">
                  Thank you for applying. We will verify your profile and contact you within 24-48 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Submit Another Application
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}

            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      formStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 w-12 transition-all ${
                        formStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1 */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 999 999 9999"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Service Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select a service</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="cleaning">Home Cleaning</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="beauty">Beauty Services</option>
                      <option value="ac-repair">AC Repair</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {formStep === 3 && (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Review Your Information</h3>
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <p className="text-sm text-gray-600 mb-2"><strong>Name:</strong> {formData.name}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Email:</strong> {formData.email}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Phone:</strong> {formData.phone}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Service:</strong> {formData.service}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Experience:</strong> {formData.experience} years</p>
                    <p className="text-sm text-gray-600"><strong>Base Price:</strong> ₹{formData.price}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Your profile will be verified within 24-48 hours. You'll receive an email confirmation.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                {formStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep - 1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={18} className="animate-spin" />}
                  {loading ? 'Submitting...' : (formStep === 3 ? 'Submit Application' : 'Next')}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already a professional? <Link to="/login" className="text-blue-600 hover:underline font-semibold">Log in here</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-blue-100 mb-8">Join thousands of service professionals earning steady income on Ghar Pahuch Seva.</p>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold"
          >
            Start Your Application Now
          </button>
        </div>
      </section>
    </div>
  );
}
