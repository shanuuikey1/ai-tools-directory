import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Privacy() {
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
            <span>{t('privacy.backToHome')}</span>
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.02)] space-y-4">
          <div className="inline-flex items-center space-x-2.5 bg-indigo-50 text-indigo-700 px-4.5 py-2 rounded-2xl border border-indigo-100/50">
            <ShieldCheck size={18} />
            <span className="text-xs md:text-sm font-extrabold tracking-wide">{t('privacy.legalDoc')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
            {t('privacy.title')}
          </h1>
          <p className="text-gray-500 text-sm font-semibold">
            Ghar Pahuch Seva &bull; {t('privacy.lastUpdated')}
          </p>
        </div>

        {/* Content Panel */}
        <main className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.015)] prose prose-indigo max-w-none space-y-8">
          <p className="text-base text-gray-600 leading-relaxed font-medium border-b border-gray-50 pb-6">
            {t('privacy.intro')}
          </p>

          {/* Section 1 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">1.</span>
              <span>{t('privacy.section1')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              To operate the marketplace and facilitate bookings, we collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li><strong>Account Details:</strong> Personal identifiers including your name, email address, phone number, and hashed password.</li>
              <li><strong>Booking Details:</strong> Service address, date/time, and particulars of the services you schedule.</li>
              <li><strong>Payment Information:</strong> Handled securely by our PCI-compliant processing partner (**Razorpay**). We do not store credit card numbers or bank credentials on our servers.</li>
              <li><strong>Service Provider Details:</strong> For independent workers—name, contact information, service category specialties, and bank/UPI details used exclusively for payouts.</li>
              <li><strong>Usage Data:</strong> Basic diagnostic metadata (device type, operating system, app interactions) to support platform security and troubleshooting.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">2.</span>
              <span>{t('privacy.section2')}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li>To provision, maintain, and manage your account and bookings.</li>
              <li>To connect customers with assigned Service Professionals to execute jobs.</li>
              <li>To process secure payments and settle professional earnings.</li>
              <li>To deliver customer support and send critical booking updates.</li>
              <li>To enhance platform usability, diagnose technical bugs, and mitigate fraud.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">3.</span>
              <span>{t('privacy.section3')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We only share your information to the extent strictly required to deliver the Service:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li>With the **assigned Service Professional** (sharing your name, service address, and contact number so they can travel to your location and perform the scheduled job).</li>
              <li>With our **integrated payment gateway** (Razorpay) to authorize transactions.</li>
              <li>When **legally mandated** by law enforcement, judicial decrees, or to safeguard our users' safety and platform security.</li>
            </ul>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We **do not sell** your personal information or share it with third parties for marketing purposes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">4.</span>
              <span>{t('privacy.section4')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We retain your personal data only for as long as your account is active, or as necessary to fulfill bookings and comply with financial auditing regulations. You may request account deletion at any time (see Section 6).
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">5.</span>
              <span>{t('privacy.section5')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We protect your data by hashing passwords using robust algorithms (bcrypt) and encrypting all traffic in transit via SSL. While no digital system is completely immune, we apply industry-standard measures to prevent unauthorized access or disclosure.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">6.</span>
              <span>{t('privacy.section6')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              In compliance with the **Digital Personal Data Protection Act, 2023**, you possess the following rights:
            </p>
            <ul className="list-decimal pl-5 space-y-2.5 text-sm md:text-base text-gray-600 font-normal">
              <li><strong>Right to Access &amp; Correction:</strong> You can review and update your profile details directly in the application at any time.</li>
              <li><strong>Right to Erasure (Account Deletion):</strong> You can request full deletion of your personal data. This can be initiated by emailing us or using the "Delete My Account" option under profile settings. We will delete or anonymize your data within 30 days, except for transaction ledgers we are legally required to retain for tax and corporate audit purposes.</li>
              <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent for data processing. Note that withdrawing consent will prevent us from providing services to you.</li>
              <li><strong>Grievance Redressal:</strong> You can file a formal complaint regarding data processing with our Grievance Officer (contact details in Section 9). We will respond to grievances within legal timelines.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">7.</span>
              <span>{t('privacy.section7')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              Our marketplace is not directed to individuals under the age of 18. We do not knowingly collect personal data from minors; all bookings must be initiated by adults.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">8.</span>
              <span>{t('privacy.section8')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              We may revise this Privacy Policy periodically. We will post any updates on this page and revise the "Last updated" date accordingly.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-3.5 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
              <span className="text-indigo-600 font-black">9.</span>
              <span>{t('privacy.section9')}</span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-normal">
              In accordance with the **Digital Personal Data Protection Act, 2023** and the **Information Technology Act, 2000**, the contact details of our designated Grievance Officer are:
            </p>
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 text-sm md:text-base text-gray-600 space-y-2">
              <p className="font-extrabold text-gray-800">{t('privacy.grievanceOfficerTitle')}</p>
              <p className="flex items-center space-x-2">
                <Mail size={16} className="text-indigo-500" />
                <a href="mailto:shanuuikey1@gmail.com" className="text-indigo-600 hover:text-indigo-700 font-semibold">{t('privacy.grievanceEmail')}</a>
              </p>
              <p>{t('privacy.grievanceAddress')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-amber-50/60 border border-amber-100 rounded-2xl p-5 text-xs text-amber-800 font-medium">
            <ShieldAlert size={20} className="shrink-0 text-amber-600" />
            <p>
              {t('privacy.privacyDisclaimer')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
