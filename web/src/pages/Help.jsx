import React, { useState } from 'react';
import SEO from '../components/SEO';
import { Mail, Phone, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '../validation/schemas';
import { useLanguage } from '../context/LanguageContext';

export default function Help() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    // In a real app, send to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Help & Support"
        description="Get help with Ghar Pahuch Seva. Contact us via email, phone, or WhatsApp for support in Chhindwara."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('help.title')}</h1>
            <p className="text-lg text-gray-500">{t('help.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a href="mailto:info@gharpahuchseva.com" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{t('help.emailUs')}</h3>
              <p className="text-sm text-gray-600">info@gharpahuchseva.com</p>
            </a>
            <a href="tel:+919999999999" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition text-center">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{t('help.callUs')}</h3>
              <p className="text-sm text-gray-600">+91-9999-9999-99</p>
            </a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 transition text-center">
              <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">{t('help.whatsapp')}</h3>
              <p className="text-sm text-gray-600">{t('help.chatWithUs')}</p>
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('help.sendMessage')}</h2>
            {submitted ? (
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle size={24} aria-hidden="true" />
                <p className="font-semibold">{t('help.thankYou')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('help.nameLabel')}</label>
                  <input id="name" {...register('name')} className={`input-field ${errors.name ? 'border-red-300' : ''}`} placeholder={t('help.namePlaceholder')} />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('help.emailLabel')}</label>
                  <input id="email" type="email" {...register('email')} className={`input-field ${errors.email ? 'border-red-300' : ''}`} placeholder="your@email.com" />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('help.messageLabel')}</label>
                  <textarea id="message" {...register('message')} rows="4" className={`input-field resize-none ${errors.message ? 'border-red-300' : ''}`} placeholder={t('help.messagePlaceholder')} />
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50">
                  {isSubmitting ? t('help.sending') : t('help.sendButton')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
