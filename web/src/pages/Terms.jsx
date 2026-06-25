import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Terms() {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-white to-white py-16 md:py-24 relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-300/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-300/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>{t('terms.backToHome')}</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-4">
          <div className="inline-flex items-center space-x-2.5 bg-indigo-50 text-indigo-700 px-4.5 py-2 rounded-2xl border border-indigo-100/50">
            <ShieldCheck size={18} />
            <span className="text-xs md:text-sm font-extrabold tracking-wide">{t('terms.legalDoc')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            {t('terms.title')}
          </h1>
          <p className="text-gray-500 text-sm font-semibold">
            Ghar Pahuch Seva &bull; {t('terms.lastUpdated')}
          </p>
        </div>

        {/* Content Panel */}
        <main className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.015)] prose prose-indigo max-w-none space-y-8">
          <p className="text-base text-gray-600 leading-relaxed font-medium border-b border-gray-50 pb-6">
            {t('terms.intro')}
          </p>

          {/* Section 1 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">1.</span>
              <span>{t('terms.section1')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              Ghar Pahuch Seva operates as a digital marketplace that connects household customers with independent home-service professionals ("Service Professionals") in Chhindwara. We facilitate bookings and payments; the actual services are performed entirely by independent Service Professionals.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">2.</span>
              <span>{t('terms.section2')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              You must provide accurate, current, and complete information during registration and keep your password secure. You are fully responsible for any activity under your account. You must be at least 18 years of age to book services on this platform.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">3.</span>
              <span>{t('terms.section3')}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li>Prices displayed in the application are set centrally by the platform and are charged exactly as shown at the time of booking.</li>
              <li>Payments are processed securely online through our integrated payment partner, **Razorpay**.</li>
              <li>Ghar Pahuch Seva charges a flat platform commission (currently **25%**); the remaining **75%** is transferred to the Service Professional.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">4.</span>
              <span>{t('terms.section4')}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li>You may cancel a scheduled booking at no charge before it has been accepted by a Service Professional.</li>
              <li>For cancellations initiated after provider acceptance, or to report service-quality issues, contact our support team. Refunds are assessed on a case-by-case basis.</li>
              <li>If a Service Professional fails to arrive for a scheduled appointment, you are eligible for a full refund.</li>
              <li>All approved refunds are credited back to your original payment method via Razorpay, typically within **5–7 business days**.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">5.</span>
              <span>{t('terms.section5')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              If you are unsatisfied with a booking, please raise the issue with us through our formal grievance process:
            </p>
            <ul className="list-decimal pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li><strong>Step 1 — Report:</strong> Email support within **48 hours** of the service completion with your booking ID and a description of the issue.</li>
              <li><strong>Step 2 — Review:</strong> We will review the booking record, payment status, and ratings, and contact the Service Professional. We aim to respond within **3 business days**.</li>
              <li><strong>Step 3 — Resolution:</strong> Depending on the assessment, we may arrange a complimentary re-service, issue a partial or full refund, or suspend the Service Professional from the platform.</li>
              <li><strong>Governing Law:</strong> These Terms are governed by the laws of India. Any unresolved dispute is subject to the exclusive jurisdiction of the courts at **Chhindwara, Madhya Pradesh**.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">6.</span>
              <span>{t('terms.section6')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              You agree to provide a safe, respectful environment for Service Professionals, to use the platform lawfully, and not to misuse, defraud, or harass others. We reserve the right to suspend or terminate accounts that violate these guidelines.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">7.</span>
              <span>{t('terms.section7')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              Service Professionals are independent contractors, not employees, agents, or partners of Ghar Pahuch Seva. They are solely responsible for the quality, manner, and safety of the work they perform. While we verify basic identity and contact details, we do not guarantee outcomes.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">8.</span>
              <span>{t('terms.section8')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              The Service is provided "as is". To the extent permitted by law, Ghar Pahuch Seva is not liable for indirect or consequential damages arising from your use of the platform or the conduct of any user. Because we act as an intermediary, our total liability for any claim is capped at the platform commission received on the booking in question.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">9.</span>
              <span>{t('terms.section9')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We reserve the right to update these Terms from time to time. Continued use of the platform following any changes constitutes your acceptance of the revised terms.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-3.5 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">10.</span>
              <span>{t('terms.section10')}</span>
            </h2>
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 text-sm md:text-base text-gray-600 space-y-2">
              <p className="font-extrabold text-gray-800">{t('terms.supportTitle')}</p>
              <p className="flex items-center space-x-2">
                <Mail size={16} className="text-indigo-500" />
                <a href="mailto:shanuuikey1@gmail.com" className="text-indigo-600 hover:text-indigo-700 font-semibold">{t('terms.supportEmail')}</a>
              </p>
              <p>{t('terms.supportAddress')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-amber-50/60 border border-amber-100 rounded-2xl p-5 text-xs text-amber-800 font-medium">
            <ShieldAlert size={20} className="shrink-0 text-amber-600" />
            <p>
              {t('terms.legalDisclaimer')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
