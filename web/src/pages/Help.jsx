import React, { useState } from 'react';
import { ChevronDown, Mail, Phone, Clock, Shield, HelpCircle, MessageCircle } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How do I book a service?',
      a: 'Browse our services, select a professional based on ratings and availability, choose your preferred date and time, and confirm the booking. You\'ll receive instant confirmation and the professional will arrive at your doorstep.',
    },
    {
      q: 'Are the service professionals verified?',
      a: 'Yes. Every professional on Ghar Pahuch Seva undergoes thorough background verification before being listed on our platform. Your safety and security is our priority.',
    },
    {
      q: 'What if I\'m not satisfied with the service?',
      a: 'We guarantee your satisfaction. If you\'re not happy, contact our support team within 24 hours. We\'ll work with you and the professional to resolve the issue or provide a refund.',
    },
    {
      q: 'How is payment processed?',
      a: 'We use secure payment processing. Payment is held until the service is complete, and then transferred to the professional. You can pay online via card, UPI, or wallet.',
    },
    {
      q: 'Can I reschedule or cancel my booking?',
      a: 'Yes. Cancel up to 2 hours before the scheduled time for a full refund. Reschedule anytime based on professional availability.',
    },
    {
      q: 'How do I become a service professional?',
      a: 'Visit the "Join as Professional" page, complete your profile, pass our background verification (24-48 hours), and start receiving bookings. You\'ll earn 75% commission on every service.',
    },
    {
      q: 'What\'s the service fee?',
      a: 'Customers pay the service price quoted by the professional - no hidden charges. Professionals keep 75% of the service amount, with 25% going to Ghar Pahuch Seva for platform management.',
    },
    {
      q: 'Do you operate on weekends and holidays?',
      a: 'Yes. Many professionals offer weekend and holiday services. You can filter availability when browsing services. Contact support for specific holiday queries.',
    },
  ];

  const supports = [
    {
      icon: <Mail size={28} />,
      title: 'Email Support',
      description: 'info@gharpahuchseva.com',
      action: 'Send Email',
      href: 'mailto:info@gharpahuchseva.com',
    },
    {
      icon: <Phone size={28} />,
      title: 'Phone Support',
      description: '+91-9999-9999-99',
      action: 'Call Now',
      href: 'tel:+919999999999',
    },
    {
      icon: <MessageCircle size={28} />,
      title: 'WhatsApp Support',
      description: 'Quick responses via WhatsApp',
      action: 'Chat Now',
      href: 'https://wa.me/919999999999',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Help &amp; <span className="text-blue-600">Support</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help. Find answers to common questions or contact our support team.
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supports.map((support, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                  {support.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{support.title}</h3>
                <p className="text-gray-600 mb-6">{support.description}</p>
                <a
                  href={support.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
                >
                  {support.action}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-6 flex items-start justify-between hover:bg-gray-50 transition-colors duration-300"
                >
                  <span className="font-semibold text-gray-900 text-left">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-blue-600 transition-transform duration-300 ml-4 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-lg">
            <div className="flex items-start space-x-4">
              <Clock size={24} className="text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Our Response Time</h3>
                <p className="text-gray-600">
                  📧 Email: 24 hours | 📞 Phone: During business hours (9 AM - 6 PM) | 💬 WhatsApp: Within 1 hour
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
