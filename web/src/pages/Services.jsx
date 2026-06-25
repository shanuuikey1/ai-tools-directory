import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { Wrench, AlertCircle, Loader, Search, X } from 'lucide-react';
import { SkeletonCard } from '../components/Skeleton';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [servicesRes, categoriesRes] = await Promise.all([
        servicesAPI.getAll(),
        servicesAPI.getCategories(),
      ]);
      setServices(servicesRes.data.services || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (err) {
      setError(t('services.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Debounced search + filter
  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      (s.description && s.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <>
      <SEO
        title="All Services"
        description="Browse and book from our wide range of professional home services in Chhindwara — cleaning, plumbing, electrical, beauty, AC repair, and more."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('services.title')}</h1>
            <p className="text-gray-600">{t('services.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3" role="alert">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('services.searchPlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search services"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`px-6 py-2 rounded-lg transition ${
                    selectedCategory === ''
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {t('services.allServices')}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-6 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-600 underline ml-2"
                  >
                    {t('services.clearFilters')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.id}`}
                  className="card cursor-pointer transform hover:scale-105 transition"
                  aria-label={`Book ${service.name} for ₹${service.base_price}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">{service.category}</p>
                    </div>
                    <Wrench className="text-blue-600 flex-shrink-0" size={24} aria-hidden="true" />
                  </div>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{t('services.startingFrom')}</p>
                      <p className="text-2xl font-bold text-blue-600">₹{service.base_price}</p>
                    </div>
                    <span className="text-blue-600 font-semibold hover:text-blue-700">{t('services.bookNow')}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-12">
              <Wrench size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t('services.noServices')}</p>
              <p className="text-gray-500 text-sm mt-1">{t('services.noServicesHint')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
