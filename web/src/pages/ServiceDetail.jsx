import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { servicesAPI, bookingsAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AlertCircle, Loader, MapPin, Calendar, Clock } from 'lucide-react';
import { bookingSchema } from '../validation/schemas';
import SEO from '../components/SEO';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { t } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const razorpayScriptRef = useRef(null);
  const customDateRef = useRef(null);
  const customTimeRef = useRef(null);

  const [customHour, setCustomHour] = useState('10');
  const [customMinute, setCustomMinute] = useState('00');
  const [customAmPm, setCustomAmPm] = useState('AM');
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      providerId: 1,
      serviceDate: '',
      serviceTime: '',
      serviceAddress: '',
    },
  });

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push({
        fullDate: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  };

  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minStr} ${ampm}`;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDisplayDateShort = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleCustomTimeChange = (h, m, ampm) => {
    setCustomHour(h);
    setCustomMinute(m);
    setCustomAmPm(ampm);
    
    let hour = parseInt(h);
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    const time24 = `${hour.toString().padStart(2, '0')}:${m}`;
    setValue('serviceTime', time24);
    trigger('serviceTime');
  };

  const handleCustomTimeClick = () => {
    setShowCustomTimePicker(true);
    const presetSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    const isCustom = watchTime && !presetSlots.includes(watchTime);
    if (isCustom) {
      const [hour24, min] = watchTime.split(':');
      let hour = parseInt(hour24);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      setCustomHour(displayHour.toString().padStart(2, '0'));
      setCustomMinute(min);
      setCustomAmPm(ampm);
    } else {
      handleCustomTimeChange('10', '00', 'AM');
    }
  };

  const watchDate = watch('serviceDate');
  const watchTime = watch('serviceTime');
  const watchAddress = watch('serviceAddress');

  useEffect(() => {
    fetchService();
  }, [id]);

  useEffect(() => {
    return () => {
      if (razorpayScriptRef.current && document.body.contains(razorpayScriptRef.current)) {
        document.body.removeChild(razorpayScriptRef.current);
      }
    };
  }, []);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(id);
      setService(response.data.service);
    } catch (err) {
      setError(t('serviceDetail.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitBooking = async (data) => {
    setError('');

    if (!token) {
      navigate('/login');
      return;
    }

    setBookingStep(2);
  };

  const handlePayment = async () => {
    try {
      setBookingLoading(true);

      const bookingResponse = await bookingsAPI.create({
        providerId: watch('providerId'),
        serviceId: service.id,
        serviceDate: watchDate,
        serviceTime: watchTime,
        serviceAddress: watchAddress,
        servicePrice: service.base_price,
      });

      const booking = bookingResponse.data.booking;

      const orderResponse = await paymentsAPI.createOrder({
        bookingId: booking.id,
        amount: service.base_price,
      });

      if (orderResponse.data.isMock || orderResponse.data.key === 'sandbox_key') {
        try {
          await paymentsAPI.verifyPayment({
            bookingId: booking.id,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpayOrderId: orderResponse.data.orderId,
            razorpaySignature: 'mock_signature',
          });
          alert(t('serviceDetail.bookingConfirmedSandbox'));
          navigate('/bookings');
        } catch (err) {
          setError(err.response?.data?.message || t('serviceDetail.paymentVerifyFailedSandbox'));
        } finally {
          setBookingLoading(false);
        }
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.id = 'razorpay-checkout-script';
      razorpayScriptRef.current = script;
      document.body.appendChild(script);

      script.onerror = () => {
        setError(t('serviceDetail.gatewayLoadFailed'));
        setBookingLoading(false);
      };

      script.onload = () => {
        if (typeof window.Razorpay === 'undefined') {
          setError(t('serviceDetail.sdkLoadFailed'));
          setBookingLoading(false);
          return;
        }
        const options = {
          key: orderResponse.data.key,
          amount: Math.round(service.base_price * 100),
          currency: 'INR',
          name: 'Ghar Pahuch Seva',
          description: service.name,
          order_id: orderResponse.data.orderId,
          handler: async (response) => {
            try {
              await paymentsAPI.verifyPayment({
                bookingId: booking.id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              alert(t('serviceDetail.bookingConfirmed'));
              navigate('/bookings');
            } catch (err) {
              setError(t('serviceDetail.paymentVerifyFailed'));
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
      setError(err.response?.data?.message || t('serviceDetail.bookingFailed'));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size={40} className="text-blue-600 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600 text-lg">{t('serviceDetail.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={service.name} description={service.description || `Book ${service.name} in Chhindwara starting from ₹${service.base_price}`} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
              onClick={() => navigate('/services')}
              className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
              aria-label="Back to services list"
            >
              {t('serviceDetail.backToServices')}
            </button>
            <h1 className="text-4xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600 mt-2">{service.category}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3" role="alert" aria-live="polite">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  ₹{service.base_price}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description || t('serviceDetail.defaultDesc', { name: service.name })}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-blue-600" aria-hidden="true" />
                    <span className="text-gray-700">{t('serviceDetail.flexibleTiming')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-blue-600" aria-hidden="true" />
                    <span className="text-gray-700">{t('serviceDetail.atYourLocation')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle size={20} className="text-blue-600" aria-hidden="true" />
                    <span className="text-gray-700">{t('serviceDetail.verifiedPro')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                {bookingStep === 1 ? (
                  <>
                    <h3 className="text-2xl font-bold mb-6">{t('serviceDetail.bookThisService')}</h3>
                    <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-6" noValidate>
                      {/* Hide scrollbar styles */}
                      <style>{`
                        .scrollbar-none::-webkit-scrollbar { display: none; }
                        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
                      `}</style>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Calendar size={14} className="text-indigo-605" />
                          {t('serviceDetail.selectDate')}
                        </label>
                        <input type="hidden" {...register('serviceDate')} />
                        
                        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                          {getNext7Days().map((day) => {
                            const isSelected = watchDate === day.fullDate;
                            return (
                              <button
                                key={day.fullDate}
                                type="button"
                                onClick={() => {
                                  setValue('serviceDate', day.fullDate);
                                  trigger('serviceDate');
                                }}
                                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-3 rounded-xl border transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/20 scale-105 font-bold'
                                    : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100/60'
                                }`}
                              >
                                <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">{day.dayName}</span>
                                <span className="text-lg font-black mt-0.5 leading-none">{day.dayNum}</span>
                                <span className="text-[8px] font-bold mt-1 opacity-85 uppercase">{day.monthName}</span>
                              </button>
                            );
                          })}

                          {/* Custom date picker trigger */}
                          {(() => {
                            const next7Days = getNext7Days();
                            const isCustomDateSelected = watchDate && !next7Days.some(day => day.fullDate === watchDate);
                            return (
                              <>
                                <button
                                  type="button"
                                  onClick={() => customDateRef.current && customDateRef.current.showPicker()}
                                  className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 rounded-xl border transition-all duration-200 ${
                                    isCustomDateSelected
                                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/20 scale-105 font-bold'
                                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100/60'
                                  }`}
                                >
                                  {isCustomDateSelected ? (
                                    <>
                                      <span className="text-[9px] uppercase font-bold tracking-wider opacity-85">{t('serviceDetail.custom')}</span>
                                      <span className="text-sm font-black mt-0.5 leading-none">{formatDisplayDateShort(watchDate)}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Calendar size={14} className="text-gray-500 mx-auto" />
                                      <span className="text-[8px] font-bold mt-1.5 uppercase opacity-80">{t('serviceDetail.more')}</span>
                                    </>
                                  )}
                                </button>
                                <input
                                  ref={customDateRef}
                                  type="date"
                                  min={new Date().toISOString().split('T')[0]}
                                  className="opacity-0 absolute w-0 h-0 pointer-events-none"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      setValue('serviceDate', e.target.value);
                                      trigger('serviceDate');
                                    }
                                  }}
                                />
                              </>
                            );
                          })()}
                        </div>
                        {errors.serviceDate && <p id="date-error" className="mt-1.5 text-xs font-semibold text-red-600">{errors.serviceDate.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <Clock size={14} className="text-indigo-605" />
                          {t('serviceDetail.selectTime')}
                        </label>
                        <input type="hidden" {...register('serviceTime')} />
                        
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { value: '08:00', label: '08:00 AM' },
                            { value: '10:00', label: '10:00 AM' },
                            { value: '12:00', label: '12:00 PM' },
                            { value: '14:00', label: '02:00 PM' },
                            { value: '16:00', label: '04:00 PM' },
                            { value: '18:00', label: '06:00 PM' },
                          ].map((slot) => {
                            const isSelected = watchTime === slot.value && !showCustomTimePicker;
                            return (
                              <button
                                key={slot.value}
                                type="button"
                                onClick={() => {
                                  setShowCustomTimePicker(false);
                                  setValue('serviceTime', slot.value);
                                  trigger('serviceTime');
                                }}
                                className={`py-3 rounded-xl border text-center transition-all duration-200 font-black text-xs ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/20 scale-[1.02]'
                                    : 'bg-slate-50 border-gray-200 text-gray-700 hover:bg-slate-100/60'
                                }`}
                              >
                                {slot.label}
                              </button>
                            );
                          })}

                          {/* Custom time picker button */}
                          <button
                            type="button"
                            onClick={handleCustomTimeClick}
                            className={`py-3 rounded-xl border text-center transition-all duration-200 font-black text-xs flex items-center justify-center gap-1 ${
                              showCustomTimePicker
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent shadow-md shadow-indigo-600/20 scale-[1.02]'
                                : 'bg-slate-50 border-gray-200 text-gray-650 hover:bg-slate-100/60'
                            }`}
                          >
                            <Clock size={12} className={showCustomTimePicker ? 'text-white' : 'text-gray-500'} />
                            <span>{t('serviceDetail.customTime')}</span>
                          </button>
                        </div>

                        {/* Custom Time Selector Dropdown Menus (Highly polished & site-matching) */}
                        {showCustomTimePicker && (
                          <div className="mt-3 p-3.5 bg-slate-50 border border-gray-200 rounded-2xl flex items-center gap-2 animate-fade-in">
                            <div className="flex-1">
                              <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">{t('serviceDetail.hour')}</label>
                              <select
                                value={customHour}
                                onChange={(e) => handleCustomTimeChange(e.target.value, customMinute, customAmPm)}
                                className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                              >
                                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                            <span className="text-gray-300 font-black pt-4">:</span>
                            <div className="flex-1">
                              <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">{t('serviceDetail.minute')}</label>
                              <select
                                value={customMinute}
                                onChange={(e) => handleCustomTimeChange(customHour, e.target.value, customAmPm)}
                                className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                              >
                                {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="block text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">{t('serviceDetail.period')}</label>
                              <select
                                value={customAmPm}
                                onChange={(e) => handleCustomTimeChange(customHour, customMinute, e.target.value)}
                                className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
                              >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                        )}
                        {errors.serviceTime && <p id="time-error" className="mt-1.5 text-xs font-semibold text-red-600">{errors.serviceTime.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="serviceAddress" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('serviceDetail.serviceAddress')}
                        </label>
                        <textarea
                          id="serviceAddress"
                          {...register('serviceAddress')}
                          placeholder={t('serviceDetail.addressPlaceholder')}
                          rows="3"
                          className={`input-field resize-none ${errors.serviceAddress ? 'border-red-300 focus:ring-red-500' : ''}`}
                          aria-invalid={errors.serviceAddress ? 'true' : 'false'}
                          aria-describedby={errors.serviceAddress ? 'address-error' : undefined}
                        />
                        {errors.serviceAddress && <p id="address-error" className="mt-1 text-sm text-red-600">{errors.serviceAddress.message}</p>}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>{t('serviceDetail.totalAmount')}</span>
                          <span className="text-blue-600">₹{service.base_price}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{t('serviceDetail.allInclusive')}</p>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary mt-6 disabled:opacity-50"
                        aria-label="Proceed to payment"
                      >
                        {t('serviceDetail.proceedToPayment')}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6">{t('serviceDetail.confirmBooking')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold mb-3">{t('serviceDetail.bookingDetails')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">{t('serviceDetail.serviceLabel')}</span><span className="font-medium">{service.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">{t('serviceDetail.dateLabel')}</span><span className="font-medium">{formatDisplayDate(watchDate)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">{t('serviceDetail.timeLabel')}</span><span className="font-medium">{formatDisplayTime(watchTime)}</span></div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">{t('serviceDetail.totalAmount')}</span>
                        <span className="text-2xl font-bold text-blue-600">₹{service.base_price}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={bookingLoading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading ? t('serviceDetail.processing') : t('serviceDetail.payNow')}
                    </button>
                    <button
                      onClick={() => setBookingStep(1)}
                      disabled={bookingLoading}
                      className="w-full btn-secondary mt-2"
                    >
                      {t('serviceDetail.back')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
