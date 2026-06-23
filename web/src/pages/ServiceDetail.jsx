import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI, bookingsAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader, MapPin, Calendar, Clock } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    providerId: 1, // Default provider (in real app, select provider)
    serviceDate: '',
    serviceTime: '',
    serviceAddress: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Form, 2: Payment

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(id);
      setService(response.data.service);
    } catch (err) {
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!bookingData.serviceDate || !bookingData.serviceTime || !bookingData.serviceAddress) {
      setError('Please fill in all fields');
      return;
    }

    setBookingStep(2);
  };

  const handlePayment = async () => {
    try {
      setBookingLoading(true);

      // Create booking
      const bookingResponse = await bookingsAPI.create({
        providerId: bookingData.providerId,
        serviceId: service.id,
        serviceDate: bookingData.serviceDate,
        serviceTime: bookingData.serviceTime,
        serviceAddress: bookingData.serviceAddress,
        servicePrice: service.base_price,
      });

      const booking = bookingResponse.data.booking;

      // Create Razorpay order
      const orderResponse = await paymentsAPI.createOrder({
        bookingId: booking.id,
        amount: service.base_price,
      });

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: orderResponse.data.key,
          amount: Math.round(service.base_price * 100),
          currency: 'INR',
          name: 'Ghar Pahuch Seva',
          description: service.name,
          order_id: orderResponse.data.orderId,
          handler: async (response) => {
            try {
              // Verify payment
              await paymentsAPI.verifyPayment({
                bookingId: booking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });

              // Success
              alert('Booking confirmed! You will receive updates via SMS and email.');
              navigate('/bookings');
            } catch (err) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: user?.firstName || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/services')}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            ← Back to Services
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{service.name}</h1>
          <p className="text-gray-600 mt-2">{service.category}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Info */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                ₹{service.base_price}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description || 'Professional ' + service.name + ' service by verified providers'}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-blue-600" />
                  <span className="text-gray-700">Flexible timing available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="text-gray-700">Service at your location</span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle size={20} className="text-blue-600" />
                  <span className="text-gray-700">Verified & professional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              {bookingStep === 1 ? (
                <>
                  <h3 className="text-2xl font-bold mb-6">Book This Service</h3>
                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    {/* Service Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Date
                      </label>
                      <input
                        type="date"
                        name="serviceDate"
                        value={bookingData.serviceDate}
                        onChange={handleBookingChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Service Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Time
                      </label>
                      <input
                        type="time"
                        name="serviceTime"
                        value={bookingData.serviceTime}
                        onChange={handleBookingChange}
                        className="input-field"
                        required
                      />
                    </div>

                    {/* Service Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Address
                      </label>
                      <textarea
                        name="serviceAddress"
                        value={bookingData.serviceAddress}
                        onChange={handleBookingChange}
                        placeholder="Enter your complete address"
                        rows="3"
                        className="input-field resize-none"
                        required
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Service Price</span>
                        <span className="font-semibold">₹{service.base_price}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Platform Fee (25%)</span>
                        <span className="font-semibold">₹{(service.base_price * 0.25).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total Amount</span>
                        <span className="text-blue-600">₹{service.base_price}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full btn-primary mt-6"
                    >
                      Proceed to Payment
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-6">Confirm Booking</h3>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Booking Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{bookingData.serviceDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{bookingData.serviceTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-right max-w-xs">
                          {bookingData.serviceAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{service.base_price}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={bookingLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Processing...' : 'Pay Now with Razorpay'}
                  </button>

                  {/* Back Button */}
                  <button
                    onClick={() => setBookingStep(1)}
                    disabled={bookingLoading}
                    className="w-full btn-secondary mt-2"
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
