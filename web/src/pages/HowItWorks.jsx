import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Search, Calendar, Star, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search size={28} className="text-blue-600" aria-hidden="true" />,
      title: '1. Find a Service',
      description: 'Browse our categories — cleaning, plumbing, electrical, beauty, AC repair, and more. Filter by your needs and budget.',
    },
    {
      icon: <Calendar size={28} className="text-blue-600" aria-hidden="true" />,
      title: '2. Book Online',
      description: 'Choose your preferred date and time. Enter your address and confirm your booking in under 2 minutes.',
    },
    {
      icon: <ShieldCheck size={28} className="text-blue-600" aria-hidden="true" />,
      title: '3. Verified Professional Arrives',
      description: 'A background-verified expert arrives at your doorstep with all the necessary tools and equipment.',
    },
    {
      icon: <Star size={28} className="text-blue-600" aria-hidden="true" />,
      title: '4. Pay & Rate',
      description: 'Pay securely online after the service is complete. Rate your experience to help other customers choose wisely.',
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
            <h1 className="text-4xl font-bold text-gray-900 mb-3">How It Works</h1>
            <p className="text-lg text-gray-500">Book a service in 4 simple steps</p>
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
              <span>Get Started Now</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
