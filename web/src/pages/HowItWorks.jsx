import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Calendar, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    {
      icon: <Search size={28} className="text-blue-600" aria-hidden="true" />,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
    },
    {
      icon: <Calendar size={28} className="text-blue-600" aria-hidden="true" />,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
    },
    {
      icon: <ShieldCheck size={28} className="text-blue-600" aria-hidden="true" />,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
    },
    {
      icon: <Star size={28} className="text-blue-600" aria-hidden="true" />,
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
    },
  ];

  return (
    <>
      <SEO
        title="How It Works"
        description="Learn how to book home services in Chhindwara in 4 simple steps with Ghar Pahuch Seva."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{t('howItWorks.title')}</h1>
            <p className="text-lg text-gray-500">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex items-start space-x-5">
                <div className="shrink-0 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
              <span>{t('howItWorks.getStarted')}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
