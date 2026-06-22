import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { Wrench, AlertCircle, Loader } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Services
          </h1>
          <p className="text-gray-600">
            Browse and book from our wide range of professional services
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-6 py-2 rounded-lg transition ${
                  selectedCategory === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                All Services
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card cursor-pointer transform hover:scale-105 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {service.category}
                    </p>
                  </div>
                  <Wrench className="text-blue-600 flex-shrink-0" size={24} />
                </div>

                {service.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{service.base_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-600 font-semibold hover:text-blue-700">
                      Book Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wrench size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No services found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
