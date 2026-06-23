import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { AlertCircle, Loader, Calendar, Clock, MapPin, Star } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingBookingId, setRatingBookingId] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, feedback: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRateBooking = async (bookingId) => {
    try {
      await bookingsAPI.rateBooking(bookingId, ratingData);
      setRatingBookingId(null);
      setRatingData({ rating: 5, feedback: '' });
      fetchBookings();
      alert('Thank you for your rating!');
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'accepted':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'cancelled':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✓';
      case 'completed':
        return '✓✓';
      case 'cancelled':
        return '✗';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Track and manage your service bookings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Booking Info */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.Service?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Booking #{booking.id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar size={18} className="text-gray-400" />
                        <span className="text-gray-700">{new Date(booking.service_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock size={18} className="text-gray-400" />
                        <span className="text-gray-700">{booking.service_time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="text-gray-700">{booking.service_address}</span>
                      </div>
                    </div>

                    {/* Provider Info */}
                    {booking.ServiceProvider && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-1">Service Provider:</p>
                        <p className="font-semibold text-gray-900">{booking.ServiceProvider.name}</p>
                        <p className="text-sm text-gray-600">{booking.ServiceProvider.phone}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star size={16} className="text-yellow-400" />
                          <span className="text-sm font-medium">{booking.ServiceProvider.rating} / 5</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">Amount Paid</p>
                        <p className="text-3xl font-bold text-blue-600">
                          ₹{booking.service_price}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">All-inclusive · No hidden charges</p>
                      </div>

                      {/* Rating Section */}
                      {booking.status === 'completed' && !booking.customer_rating && (
                        <div className="mb-4">
                          {ratingBookingId === booking.id ? (
                            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                              <h4 className="font-semibold text-gray-900">Rate This Service</h4>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Rating
                                </label>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() =>
                                        setRatingData({ ...ratingData, rating: star })
                                      }
                                      className={`text-2xl ${
                                        star <= ratingData.rating
                                          ? 'text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Feedback (Optional)
                                </label>
                                <textarea
                                  value={ratingData.feedback}
                                  onChange={(e) =>
                                    setRatingData({ ...ratingData, feedback: e.target.value })
                                  }
                                  placeholder="Share your experience..."
                                  className="input-field resize-none"
                                  rows="2"
                                />
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleRateBooking(booking.id)}
                                  className="flex-1 btn-primary"
                                >
                                  Submit Rating
                                </button>
                                <button
                                  onClick={() => setRatingBookingId(null)}
                                  className="flex-1 btn-secondary"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRatingBookingId(booking.id)}
                              className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                            >
                              Rate Service
                            </button>
                          )}
                        </div>
                      )}

                      {booking.customer_rating && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-green-700 mb-1">✓ You rated this service</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < booking.customer_rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                          {booking.customer_feedback && (
                            <p className="text-sm text-gray-700 mt-2">
                              "{booking.customer_feedback}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                      <p
                        className={`font-semibold ${
                          booking.payment_status === 'completed'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {booking.payment_status === 'completed' ? '✓ Paid' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No bookings yet</p>
            <a
              href="/services"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Browse services to make your first booking →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
