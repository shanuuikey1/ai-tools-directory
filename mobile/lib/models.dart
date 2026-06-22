import 'package:flutter/material.dart';

/// A bookable service offered on the platform.
class ServiceItem {
  final String id;
  final String name;
  final String category;
  final String description;
  final int basePrice;
  final double rating;
  final int reviews;
  final int durationMins;
  final IconData icon;
  final Color color;

  const ServiceItem({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.basePrice,
    required this.rating,
    required this.reviews,
    required this.durationMins,
    required this.icon,
    required this.color,
  });
}

/// A service category (Cleaning, Plumbing, etc).
class ServiceCategory {
  final String name;
  final IconData icon;
  final Color color;
  const ServiceCategory(this.name, this.icon, this.color);
}

enum BookingStatus { pending, confirmed, completed, cancelled }

extension BookingStatusX on BookingStatus {
  String get label {
    switch (this) {
      case BookingStatus.pending:
        return 'Pending';
      case BookingStatus.confirmed:
        return 'Confirmed';
      case BookingStatus.completed:
        return 'Completed';
      case BookingStatus.cancelled:
        return 'Cancelled';
    }
  }
}

/// A booking created by the user.
class Booking {
  final String id;
  final ServiceItem service;
  final DateTime dateTime;
  final String address;
  BookingStatus status;
  int? rating;

  Booking({
    required this.id,
    required this.service,
    required this.dateTime,
    required this.address,
    this.status = BookingStatus.confirmed,
    this.rating,
  });

  int get total => service.basePrice;
  int get commission => (service.basePrice * 0.25).round();
}

/// Logged-in user (stored locally for the demo build).
class AppUser {
  final String name;
  final String email;
  final String phone;
  const AppUser({required this.name, required this.email, required this.phone});
}
