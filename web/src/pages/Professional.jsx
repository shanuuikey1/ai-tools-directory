import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { professionalsAPI } from '../services/api';
import { CheckCircle, ArrowRight, Briefcase, TrendingUp, Users, Shield, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Professional() {
  const { t } = useLanguage();
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
        await professionalsAPI.apply({
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

  const benefitsData = [
    {
      icon: <TrendingUp size={32} className="text-blue-600" />,
      titleKey: 'professional.benefitGrowth',
      descKey: 'professional.benefitGrowthDesc',
    },
    {
      icon: <Users size={32} className="text-blue-600" />,
      titleKey: 'professional.benefitBookings',
      descKey: 'professional.benefitBookingsDesc',
    },
    {
      icon: <Shield size={32} className="text-blue-600" />,
      titleKey: 'professional.benefitPayments',
      descKey: 'professional.benefitPaymentsDesc',
    },
    {
      icon: <Briefcase size={32} className="text-blue-600" />,
      titleKey: 'professional.benefitTools',
      descKey: 'professional.benefitToolsDesc',
    },
  ];

  const requirementsKeys = [
    'professional.validGovId',
    'professional.age18',
    'professional.backgroundVerification',
    'professional.professionalExperience',
    'professional.reliablePhone',
  ];

  const stepsData = [
    { number: '1', titleKey: 'professional.step1Title', descKey: 'professional.step1Desc' },
    { number: '2', titleKey: 'professional.step2Title', descKey: 'professional.step2Desc' },
    { number: '3', titleKey: 'professional.step3Title', descKey: 'professional.step3Desc' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('professional.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('professional.subtitle')}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{t('professional.whyJoin')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsData.map((benefit, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-center">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(benefit.titleKey)}</h3>
                <p className="text-gray-600">{t(benefit.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{t('professional.gettingStarted')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepsData.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{t(step.titleKey)}</h3>
                  <p className="text-gray-600">{t(step.descKey)}</p>
                </div>
                {idx < stepsData.length - 1 && (
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
            <h2 className="text-3xl font-bold mb-6">{t('professional.earnCommission')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold">₹500</p>
                <p className="text-blue-100">{t('professional.servicePrice')}</p>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight size={32} className="text-blue-200" />
              </div>
              <div>
                <p className="text-4xl font-bold text-green-300">₹375</p>
                <p className="text-blue-100">{t('professional.youKeep')}</p>
              </div>
            </div>
            <p className="text-blue-100 mt-8">{t('professional.platformFeeNote')}</p>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('professional.requirements')}</h2>
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <ul className="space-y-4">
              {requirementsKeys.map((key, idx) => (
                <li key={idx} className="flex items-center space-x-4">
                  <CheckCircle size={24} className="text-green-600 shrink-0" />
                  <span className="text-gray-700 font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t('professional.joinNow')}</h2>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {/* Success Message */}
            {success && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">{t('professional.success')}</h3>
                <p className="text-green-700 mb-4">
                  {t('professional.successMessage')}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  {t('professional.submitAnother')}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('professional.basicInfo')}</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.fullName')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('professional.fullNamePlaceholder')}
                      maxLength="100"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('professional.emailPlaceholder')}
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.phoneNumber')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('professional.phoneNumberPlaceholder')}
                      pattern="[\d+\s\-()]{10,}"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('professional.serviceDetails')}</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.serviceType')}</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    >
                      <option value="">{t('professional.selectService')}</option>
                      <option value="plumbing">{t('professional.plumbing')}</option>
                      <option value="electrical">{t('professional.electrical')}</option>
                      <option value="cleaning">{t('professional.cleaning')}</option>
                      <option value="carpentry">{t('professional.carpentry')}</option>
                      <option value="beauty">{t('professional.beauty')}</option>
                      <option value="ac-repair">{t('professional.acRepair')}</option>
                      <option value="other">{t('professional.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.yearsExperience')}</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder={t('professional.yearsPlaceholder')}
                      min="0"
                      max="99"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('professional.basePrice')}</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder={t('professional.basePricePlaceholder')}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {formStep === 3 && (
                <div className="text-center py-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('professional.reviewInfo')}</h3>
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('professional.nameLabel')}</strong> {formData.name}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('professional.emailLabel')}</strong> {formData.email}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('professional.phoneLabel')}</strong> {formData.phone}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('professional.serviceLabel')}</strong> {formData.service}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>{t('professional.experienceLabel')}</strong> {formData.experience} {t('professional.yearsUnit')}</p>
                    <p className="text-sm text-gray-600"><strong>{t('professional.basePriceLabel')}</strong> ₹{formData.price}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('professional.verificationNote')}
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
                    {t('professional.back')}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={18} className="animate-spin" />}
                  {loading ? t('professional.submitting') : (formStep === 3 ? t('professional.submit') : t('professional.next'))}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            {t('professional.alreadyPro')} <Link to="/login" className="text-blue-600 hover:underline font-semibold">{t('professional.loginHere')}</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('professional.readyToGrow')}</h2>
          <p className="text-blue-100 mb-8">{t('professional.readyToGrowDesc')}</p>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold"
          >
            {t('professional.startApplication')}
          </button>
        </div>
      </section>
    </div>
  );
}
