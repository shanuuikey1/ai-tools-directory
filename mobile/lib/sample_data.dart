import 'package:flutter/material.dart';
import 'models.dart';

/// Categories shown on the home screen.
const List<ServiceCategory> kCategories = [
  ServiceCategory('Cleaning', Icons.cleaning_services_rounded, Color(0xFF4F46E5)),
  ServiceCategory('Plumbing', Icons.plumbing_rounded, Color(0xFF0EA5E9)),
  ServiceCategory('Electrical', Icons.electrical_services_rounded, Color(0xFFF59E0B)),
  ServiceCategory('Beauty', Icons.spa_rounded, Color(0xFFEC4899)),
  ServiceCategory('AC Repair', Icons.ac_unit_rounded, Color(0xFF06B6D4)),
  ServiceCategory('Carpentry', Icons.handyman_rounded, Color(0xFF8B5CF6)),
  ServiceCategory('Painting', Icons.format_paint_rounded, Color(0xFF14B8A6)),
  ServiceCategory('Pest Control', Icons.pest_control_rounded, Color(0xFFEF4444)),
];

/// Sample catalogue so the app is fully usable offline / on first launch.
const List<ServiceItem> kServices = [
  ServiceItem(
    id: 's1',
    name: 'Home Deep Cleaning',
    category: 'Cleaning',
    description:
        'Top-to-bottom deep cleaning of your home including kitchen, bathrooms, floors and dusting by trained professionals with eco-friendly products.',
    basePrice: 799,
    rating: 4.8,
    reviews: 1240,
    durationMins: 180,
    icon: Icons.cleaning_services_rounded,
    color: Color(0xFF4F46E5),
  ),
  ServiceItem(
    id: 's2',
    name: 'Bathroom Cleaning',
    category: 'Cleaning',
    description:
        'Intensive scrubbing and sanitisation of tiles, fittings and floor to remove stains and germs.',
    basePrice: 499,
    rating: 4.7,
    reviews: 860,
    durationMins: 90,
    icon: Icons.bathtub_rounded,
    color: Color(0xFF4F46E5),
  ),
  ServiceItem(
    id: 's3',
    name: 'Tap & Pipe Repair',
    category: 'Plumbing',
    description:
        'Fix leaking taps, broken pipes and low water pressure. Includes inspection and minor parts.',
    basePrice: 299,
    rating: 4.6,
    reviews: 540,
    durationMins: 60,
    icon: Icons.plumbing_rounded,
    color: Color(0xFF0EA5E9),
  ),
  ServiceItem(
    id: 's4',
    name: 'Wiring & Switch Fix',
    category: 'Electrical',
    description:
        'Certified electrician for switches, sockets, wiring faults and fan/light installation.',
    basePrice: 349,
    rating: 4.7,
    reviews: 690,
    durationMins: 60,
    icon: Icons.electrical_services_rounded,
    color: Color(0xFFF59E0B),
  ),
  ServiceItem(
    id: 's5',
    name: 'Salon for Women',
    category: 'Beauty',
    description:
        'Premium at-home salon — facial, waxing, threading and more with hygienic single-use kits.',
    basePrice: 1199,
    rating: 4.9,
    reviews: 2100,
    durationMins: 120,
    icon: Icons.spa_rounded,
    color: Color(0xFFEC4899),
  ),
  ServiceItem(
    id: 's6',
    name: "Men's Grooming",
    category: 'Beauty',
    description:
        'Haircut, beard styling and head massage by expert stylists in the comfort of your home.',
    basePrice: 399,
    rating: 4.7,
    reviews: 980,
    durationMins: 60,
    icon: Icons.content_cut_rounded,
    color: Color(0xFFEC4899),
  ),
  ServiceItem(
    id: 's7',
    name: 'AC Service & Repair',
    category: 'AC Repair',
    description:
        'Complete AC servicing — deep jet cleaning, gas check and cooling diagnostics.',
    basePrice: 599,
    rating: 4.8,
    reviews: 1450,
    durationMins: 90,
    icon: Icons.ac_unit_rounded,
    color: Color(0xFF06B6D4),
  ),
  ServiceItem(
    id: 's8',
    name: 'Furniture Repair',
    category: 'Carpentry',
    description:
        'Repair doors, drawers, hinges and furniture. Skilled carpenter with tools included.',
    basePrice: 449,
    rating: 4.6,
    reviews: 420,
    durationMins: 75,
    icon: Icons.handyman_rounded,
    color: Color(0xFF8B5CF6),
  ),
  ServiceItem(
    id: 's9',
    name: 'Wall Painting',
    category: 'Painting',
    description:
        'Fresh interior wall painting with premium emulsion. Free colour consultation included.',
    basePrice: 1999,
    rating: 4.8,
    reviews: 360,
    durationMins: 240,
    icon: Icons.format_paint_rounded,
    color: Color(0xFF14B8A6),
  ),
  ServiceItem(
    id: 's10',
    name: 'General Pest Control',
    category: 'Pest Control',
    description:
        'Safe and odourless treatment for cockroaches, ants and other household pests.',
    basePrice: 899,
    rating: 4.7,
    reviews: 510,
    durationMins: 90,
    icon: Icons.pest_control_rounded,
    color: Color(0xFFEF4444),
  ),
];

List<ServiceItem> servicesByCategory(String category) =>
    kServices.where((s) => s.category == category).toList();

List<ServiceItem> get popularServices =>
    (kServices.toList()..sort((a, b) => b.reviews.compareTo(a.reviews)))
        .take(6)
        .toList();
