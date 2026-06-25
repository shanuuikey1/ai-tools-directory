import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// Holds the backend base URL. Empty => the app runs in offline/demo mode.
///
/// Point this at your deployed Node/Express API, e.g.
/// `https://my-urban-api.herokuapp.com/api`
class ApiConfig {
  static String baseUrl = '';

  static bool get isConfigured => baseUrl.trim().isNotEmpty;

  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    baseUrl = prefs.getString('api_base_url') ?? '';
  }

  static Future<void> setBaseUrl(String url) async {
    baseUrl = url.trim();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('api_base_url', baseUrl);
  }
}

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

/// Thin REST client for the Ghar Pahuch Seva backend.
class ApiService {
  static const _timeout = Duration(seconds: 15);

  static Uri _u(String path) => Uri.parse('${ApiConfig.baseUrl}$path');

  static Map<String, String> _headers([String? token]) => {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  static dynamic _decode(http.Response res) {
    final body = res.body.isEmpty ? {} : jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300) return body;
    final msg = (body is Map && body['message'] != null)
        ? body['message'].toString()
        : 'Request failed (${res.statusCode})';
    throw ApiException(msg);
  }

  /// Register a customer. Returns `{token, user}`.
  static Future<Map<String, dynamic>> registerCustomer({
    required String name,
    required String email,
    required String phone,
    required String password,
  }) async {
    final parts = name.trim().split(' ');
    final res = await http
        .post(_u('/auth/register-customer'),
            headers: _headers(),
            body: jsonEncode({
              'firstName': parts.first,
              'lastName': parts.length > 1 ? parts.sublist(1).join(' ') : '',
              'email': email,
              'phone': phone,
              'password': password,
            }))
        .timeout(_timeout);
    return _decode(res) as Map<String, dynamic>;
  }

  /// Log a customer in. Returns `{token, user}`.
  static Future<Map<String, dynamic>> loginCustomer({
    required String email,
    required String password,
  }) async {
    final res = await http
        .post(_u('/auth/login-customer'),
            headers: _headers(),
            body: jsonEncode({'email': email, 'password': password}))
        .timeout(_timeout);
    return _decode(res) as Map<String, dynamic>;
  }

  /// Create a booking on the backend. Returns the created booking details.
  static Future<Map<String, dynamic>> createBooking({
    required String token,
    required int providerId,
    required int serviceId,
    required String date,
    required String time,
    required String address,
    required double price,
  }) async {
    final res = await http
        .post(_u('/bookings'),
            headers: _headers(token),
            body: jsonEncode({
              'providerId': providerId,
              'serviceId': serviceId,
              'serviceDate': date,
              'serviceTime': time,
              'serviceAddress': address,
              'servicePrice': price,
            }))
        .timeout(_timeout);
    return _decode(res) as Map<String, dynamic>;
  }

  /// Create a Razorpay order on the backend.
  static Future<Map<String, dynamic>> createOrder({
    required String token,
    required int bookingId,
    required double amount,
  }) async {
    final res = await http
        .post(_u('/payments/create-order'),
            headers: _headers(token),
            body: jsonEncode({
              'bookingId': bookingId,
              'amount': amount,
            }))
        .timeout(_timeout);
    return _decode(res) as Map<String, dynamic>;
  }

  /// Verify a Razorpay payment on the backend.
  static Future<Map<String, dynamic>> verifyPayment({
    required String token,
    required int bookingId,
    required String paymentId,
    required String orderId,
    required String signature,
  }) async {
    final res = await http
        .post(_u('/payments/verify'),
            headers: _headers(token),
            body: jsonEncode({
              'bookingId': bookingId,
              'razorpayPaymentId': paymentId,
              'razorpayOrderId': orderId,
              'razorpaySignature': signature,
            }))
        .timeout(_timeout);
    return _decode(res) as Map<String, dynamic>;
  }

  /// Permanently delete the signed-in customer's account. Requires the
  /// account password for re-authentication.
  static Future<void> deleteAccount({
    required String token,
    required String password,
  }) async {
    final res = await http
        .delete(_u('/auth/delete-account'),
            headers: _headers(token),
            body: jsonEncode({'password': password}))
        .timeout(_timeout);
    _decode(res);
  }

  /// Simple health check used by the settings screen.
  static Future<bool> health() async {
    try {
      final res = await http.get(_u('/health')).timeout(_timeout);
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
