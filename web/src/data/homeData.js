/**
 * Static content for the Home page.
 * Testimonials and FAQs don't have backend endpoints yet,
 * so we keep them here for easy editing and future API migration.
 */

export const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    text: 'Found a plumber within minutes. Professional, on-time, and excellent work. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Rajesh Patel',
    role: 'Business Owner',
    text: 'Great service for office maintenance. The electrician was knowledgeable and affordable.',
    rating: 5,
  },
  {
    name: 'Meera Gupta',
    role: 'Customer',
    text: 'Best experience booking home cleaning service. Easy app, verified professional, transparent pricing.',
    rating: 5,
  },
];

export const faqs = [
  {
    q: 'How do I book a service?',
    a: 'Browse services, select a professional, choose your date/time, and confirm. You\'ll get instant confirmation.',
  },
  {
    q: 'Are professionals verified?',
    a: 'Yes, every professional undergoes background verification before listing on our platform.',
  },
  {
    q: 'What if I\'m not satisfied?',
    a: 'We guarantee your satisfaction. Contact support within 24 hours for a refund or resolution.',
  },
  {
    q: 'How is payment handled?',
    a: 'Secure payment via card, UPI, or wallet. Money is held until service is complete.',
  },
];

export const stats = [
  { number: '500+', label: 'Verified Professionals' },
  { number: '10K+', label: 'Happy Customers' },
  { number: '4.8★', label: 'Average Rating' },
];

export const trustBadges = [
  { icon: '🔒', title: 'Verified Professionals', desc: 'Background verified' },
  { icon: '💳', title: 'Secure Payments', desc: 'Safe transactions' },
  { icon: '📱', title: 'Real Reviews', desc: 'Authentic feedback' },
  { icon: '🛡️', title: 'Guaranteed Service', desc: 'Satisfaction assured' },
];

export const features = [
  {
    icon: 'ShieldCheck',
    bg: 'bg-blue-100',
    title: 'Verified Professionals',
    description: 'Every professional is background-checked and verified before joining the platform.',
  },
  {
    icon: 'Clock',
    bg: 'bg-green-100',
    title: 'On-Time Service',
    description: 'Book in minutes and get reliable help exactly when you need it.',
  },
  {
    icon: 'Star',
    bg: 'bg-yellow-100',
    title: 'Top-Rated Quality',
    description: 'Trusted by thousands of happy customers with a 4.8-star average rating.',
  },
];
