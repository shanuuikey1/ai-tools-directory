import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, TrendingUp, ArrowRight } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Target size={28} className="text-blue-600" />,
      title: 'Our Mission',
      description: 'Connect trusted service professionals with customers in Chhindwara, making quality home services accessible to everyone.',
    },
    {
      icon: <Users size={28} className="text-blue-600" />,
      title: 'Our Team',
      description: 'Built by tech experts and local business leaders with deep roots in Chhindwara community.',
    },
    {
      icon: <Award size={28} className="text-blue-600" />,
      title: 'Our Promise',
      description: 'Every service provider is verified. Every booking is guaranteed. Your satisfaction is our priority.',
    },
    {
      icon: <TrendingUp size={28} className="text-blue-600" />,
      title: 'Growth',
      description: 'From 100+ verified professionals to becoming Chhindwara\'s #1 trusted services platform.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">Ghar Pahuch Seva</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trusted home services at your doorstep. We're building the future of local services in Chhindwara.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why We Exist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Ghar Pahuch Seva was born from a simple idea: finding a trusted service provider shouldn't be a hassle. Three entrepreneurs from Chhindwara saw a gap in the local services market and decided to build something better.
            </p>
            <p>
              What started as connecting a handful of service providers with customers has grown into a trusted platform serving hundreds of homes across Chhindwara. Every professional on our platform is verified. Every booking is protected. That's our guarantee.
            </p>
            <p>
              Today, we're proud to be Chhindwara's fastest-growing trusted services platform, helping plumbers, electricians, cleaners, beauticians, and other professionals build sustainable livelihoods while delivering exceptional service to our customers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to experience the difference?</h2>
          <p className="text-gray-600 mb-8">Join thousands of satisfied customers in Chhindwara.</p>
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            <span>Explore Services</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
