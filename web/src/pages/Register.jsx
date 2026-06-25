import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { registerSchema } from '../validation/schemas';
import SEO from '../components/SEO';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setError('');
    try {
      const response = await authAPI.registerCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      const { token, user } = response.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <SEO title="Sign Up" description="Create a Ghar Pahuch Seva account and book home services in Chhindwara." />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h1>
          <p className="text-center text-gray-600 mb-6">Join Ghar Pahuch Seva today</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3" role="alert" aria-live="polite">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}>
                  <User size={18} className="text-gray-400" aria-hidden="true" />
                  <input
                    id="firstName"
                    type="text"
                    {...register('firstName')}
                    placeholder="John"
                    className="flex-1 outline-none text-sm"
                    aria-invalid={errors.firstName ? 'true' : 'false'}
                    aria-describedby={errors.firstName ? 'firstname-error' : undefined}
                  />
                </div>
                {errors.firstName && <p id="firstname-error" className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}>
                  <User size={18} className="text-gray-400" aria-hidden="true" />
                  <input
                    id="lastName"
                    type="text"
                    {...register('lastName')}
                    placeholder="Doe"
                    className="flex-1 outline-none text-sm"
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                    aria-describedby={errors.lastName ? 'lastname-error' : undefined}
                  />
                </div>
                {errors.lastName && <p id="lastname-error" className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}>
                <Mail size={18} className="text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="your@email.com"
                  className="flex-1 outline-none text-sm"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'}`}>
                <Phone size={18} className="text-gray-400" aria-hidden="true" />
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="9999999999"
                  className="flex-1 outline-none text-sm"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
              </div>
              {errors.phone && <p id="phone-error" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}>
                <Lock size={18} className="text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className={`flex items-center space-x-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}>
                <Lock size={18} className="text-gray-400" aria-hidden="true" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p id="confirm-error" className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              aria-label={isSubmitting ? 'Creating your account, please wait' : 'Create a new account'}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
