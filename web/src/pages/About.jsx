import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Home, Wrench, ShieldCheck, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Ghar Pahuch Seva — Chhindwara's trusted platform for booking verified home service professionals."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{t('about.title')}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {t('about.intro')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <Home className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{t('about.localTitle')}</h3>
                <p className="text-sm text-gray-600">{t('about.localDesc')}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl text-center">
                <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{t('about.verifiedTitle')}</h3>
                <p className="text-sm text-gray-600">{t('about.verifiedDesc')}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl text-center">
                <Wrench className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{t('about.qualityTitle')}</h3>
                <p className="text-sm text-gray-600">{t('about.qualityDesc')}</p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.missionTitle')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t('about.missionDesc')}
              </p>
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Phone size={18} aria-hidden="true" />
                <span>{t('about.bookAService')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
