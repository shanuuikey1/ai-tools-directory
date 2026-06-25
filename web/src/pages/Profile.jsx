import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import SEO from '../components/SEO';

export default function Profile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>
        <SEO title="Profile" description="Your Ghar Pahuch Seva profile." />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">{t('profile.loginToView')}</p>
          </div>
        </div>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SEO title="My Profile" description="Manage your Ghar Pahuch Seva account profile and settings." />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('profile.title')}</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">{t('profile.customer')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500">{t('profile.email')}</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500">{t('profile.phone')}</p>
                  <p className="font-medium text-gray-900">{user.phone || t('profile.notProvided')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500">{t('profile.memberSince')}</p>
                  <p className="font-medium text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('profile.recently')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-100 transition"
              >
                {t('profile.logOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
