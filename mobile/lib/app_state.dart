import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'models.dart';

/// App-wide state: auth + bookings, persisted locally with SharedPreferences.
class AppState extends ChangeNotifier {
  AppUser? _user;
  final List<Booking> _bookings = [];
  bool _seenOnboarding = false;

  AppUser? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get seenOnboarding => _seenOnboarding;
  List<Booking> get bookings => List.unmodifiable(_bookings.reversed);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _seenOnboarding = prefs.getBool('seenOnboarding') ?? false;
    final name = prefs.getString('user_name');
    if (name != null) {
      _user = AppUser(
        name: name,
        email: prefs.getString('user_email') ?? '',
        phone: prefs.getString('user_phone') ?? '',
      );
    }
    notifyListeners();
  }

  Future<void> completeOnboarding() async {
    _seenOnboarding = true;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('seenOnboarding', true);
    notifyListeners();
  }

  Future<void> login({
    required String name,
    required String email,
    required String phone,
  }) async {
    _user = AppUser(name: name, email: email, phone: phone);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_name', name);
    await prefs.setString('user_email', email);
    await prefs.setString('user_phone', phone);
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_name');
    await prefs.remove('user_email');
    await prefs.remove('user_phone');
    notifyListeners();
  }

  void addBooking(Booking booking) {
    _bookings.add(booking);
    notifyListeners();
  }

  void rateBooking(String id, int rating) {
    final b = _bookings.firstWhere((b) => b.id == id);
    b.rating = rating;
    b.status = BookingStatus.completed;
    notifyListeners();
  }

  void cancelBooking(String id) {
    final b = _bookings.firstWhere((b) => b.id == id);
    b.status = BookingStatus.cancelled;
    notifyListeners();
  }
}
