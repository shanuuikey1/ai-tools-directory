import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import 'models.dart';

/// App-wide state: auth + bookings.
///
/// Uses the backend API when [ApiConfig] is configured, otherwise falls back
/// to local/offline mode so the app is always usable.
class AppState extends ChangeNotifier {
  AppUser? _user;
  String? _token;
  final List<Booking> _bookings = [];
  bool _seenOnboarding = false;

  AppUser? get user => _user;
  String? get token => _token;
  bool get isLoggedIn => _user != null;
  bool get seenOnboarding => _seenOnboarding;
  bool get isOnline => ApiConfig.isConfigured;
  List<Booking> get bookings => List.unmodifiable(_bookings.reversed);

  Future<void> load() async {
    await ApiConfig.load();
    final prefs = await SharedPreferences.getInstance();
    _seenOnboarding = prefs.getBool('seenOnboarding') ?? false;
    _token = prefs.getString('user_token');
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

  Future<void> _persistUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_name', _user!.name);
    await prefs.setString('user_email', _user!.email);
    await prefs.setString('user_phone', _user!.phone);
    if (_token != null) await prefs.setString('user_token', _token!);
  }

  /// Sign up. Hits the backend when configured; otherwise stores locally.
  /// Throws [ApiException] with a readable message on backend errors.
  Future<void> register({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    if (ApiConfig.isConfigured) {
      final res = await ApiService.registerCustomer(
          name: name, email: email, phone: phone, password: password);
      _token = res['token'] as String?;
    }
    _user = AppUser(name: name, email: email, phone: phone);
    await _persistUser();
    notifyListeners();
  }

  /// Log in. Hits the backend when configured; otherwise stores locally.
  Future<void> login({
    required String email,
    required String password,
    String? fallbackName,
  }) async {
    if (ApiConfig.isConfigured) {
      final res =
          await ApiService.loginCustomer(email: email, password: password);
      _token = res['token'] as String?;
      final u = res['user'] as Map<String, dynamic>?;
      final first = u?['firstName']?.toString() ?? '';
      final last = u?['lastName']?.toString() ?? '';
      final name = ('$first $last').trim();
      _user = AppUser(
        name: name.isEmpty ? (fallbackName ?? email.split('@').first) : name,
        email: u?['email']?.toString() ?? email,
        phone: u?['phone']?.toString() ?? '',
      );
    } else {
      _user = AppUser(
        name: fallbackName ?? email.split('@').first,
        email: email,
        phone: '',
      );
    }
    await _persistUser();
    notifyListeners();
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_name');
    await prefs.remove('user_email');
    await prefs.remove('user_phone');
    await prefs.remove('user_token');
    notifyListeners();
  }

  /// Add a booking locally and, when online, best-effort sync to the backend.
  Future<void> addBooking(Booking booking) async {
    _bookings.add(booking);
    notifyListeners();

    if (ApiConfig.isConfigured && _token != null) {
      try {
        final numericId =
            int.tryParse(booking.service.id.replaceAll(RegExp(r'\D'), '')) ?? 1;
        await ApiService.createBooking(
          token: _token!,
          providerId: 1,
          serviceId: numericId,
          date: DateFormat('yyyy-MM-dd').format(booking.dateTime),
          time: DateFormat('HH:mm').format(booking.dateTime),
          address: booking.address,
          price: booking.total,
        );
      } catch (_) {
        // Keep the local booking even if the backend sync fails.
      }
    }
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
