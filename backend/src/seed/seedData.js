// ============================================================
//  EDIT THIS FILE — your real Chhindwara workers & services.
// ============================================================
// After editing, run:  npm run seed         (from the backend/ folder)
// Re-running is safe: existing rows are updated, not duplicated.
//
// Categories must be one of (these match the app's UI):
//   Cleaning, Plumbing, Electrical, Beauty,
//   AC Repair, Carpentry, Painting, Pest Control
//
// Commission is handled per-booking automatically (25% platform / 75%
// provider), so you only set the customer-facing `base_price` here.
// ------------------------------------------------------------

// Every seeded worker gets this login password. Tell each worker to
// change it after first login. CHANGE THIS before seeding real data.
const DEFAULT_PROVIDER_PASSWORD = 'urban@2026';

// ---- YOUR SERVICE WORKERS -----------------------------------
const providers = [
  {
    name: 'Ramesh Kumar',
    email: 'ramesh.plumber@example.com',
    phone: '9000000001',
    bio: '8+ years experience in plumbing and pipe fitting.',
    city: 'Chhindwara',
    pincode: '480001',
    service_categories: ['Plumbing'],
    bank_account: '',        // fill for payouts
    ifsc_code: '',
    verification_status: 'verified',
  },
  {
    name: 'Suresh Vishwakarma',
    email: 'suresh.electric@example.com',
    phone: '9000000002',
    bio: 'Certified electrician — wiring, switches, fan/light installs.',
    city: 'Chhindwara',
    pincode: '480001',
    service_categories: ['Electrical', 'AC Repair'],
    bank_account: '',
    ifsc_code: '',
    verification_status: 'verified',
  },
  {
    name: 'Anita Devi',
    email: 'anita.beauty@example.com',
    phone: '9000000003',
    bio: 'At-home salon services with hygienic single-use kits.',
    city: 'Chhindwara',
    pincode: '480001',
    service_categories: ['Beauty'],
    bank_account: '',
    ifsc_code: '',
    verification_status: 'verified',
  },
  {
    name: 'Deep Clean Team',
    email: 'cleaning.team@example.com',
    phone: '9000000004',
    bio: 'Trained crew for deep home and bathroom cleaning.',
    city: 'Chhindwara',
    pincode: '480001',
    service_categories: ['Cleaning', 'Pest Control'],
    bank_account: '',
    ifsc_code: '',
    verification_status: 'verified',
  },
];

// ---- YOUR SERVICES (the catalogue customers book) -----------
const services = [
  {
    name: 'Home Deep Cleaning',
    category: 'Cleaning',
    base_price: 1499,
    description:
      'Top-to-bottom deep cleaning of your home — kitchen, bathrooms, floors and dusting by trained professionals.',
  },
  {
    name: 'Bathroom Cleaning',
    category: 'Cleaning',
    base_price: 499,
    description:
      'Intensive scrubbing and sanitisation of tiles, fittings and floor to remove stains and germs.',
  },
  {
    name: 'Tap & Pipe Repair',
    category: 'Plumbing',
    base_price: 299,
    description:
      'Fix leaking taps, broken pipes and low water pressure. Includes inspection and minor parts.',
  },
  {
    name: 'Wiring & Switch Fix',
    category: 'Electrical',
    base_price: 349,
    description:
      'Certified electrician for switches, sockets, wiring faults and fan/light installation.',
  },
  {
    name: 'Salon for Women',
    category: 'Beauty',
    base_price: 799,
    description:
      'Premium at-home salon — facial, waxing, threading and more with hygienic single-use kits.',
  },
  {
    name: 'AC Service & Repair',
    category: 'AC Repair',
    base_price: 599,
    description:
      'Cooling check, gas top-up assessment, filter cleaning and general AC servicing.',
  },
  {
    name: 'General Pest Control',
    category: 'Pest Control',
    base_price: 899,
    description:
      'Safe treatment for cockroaches, ants and common household pests.',
  },
];

module.exports = { providers, services, DEFAULT_PROVIDER_PASSWORD };
