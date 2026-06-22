import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isLogin = true;
  bool _busy = false;
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _password = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _phone.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_email.text.trim().isEmpty || _password.text.trim().isEmpty) {
      _snack('Please fill email and password');
      return;
    }
    if (!_isLogin && _name.text.trim().isEmpty) {
      _snack('Please enter your name');
      return;
    }

    setState(() => _busy = true);
    final state = context.read<AppState>();
    try {
      if (_isLogin) {
        await state.login(
          email: _email.text.trim(),
          password: _password.text.trim(),
        );
      } else {
        await state.register(
          name: _name.text.trim(),
          email: _email.text.trim(),
          phone: _phone.text.trim(),
          password: _password.text.trim(),
        );
      }
      if (!mounted) return;
      Navigator.pop(context);
      _snack(_isLogin ? 'Welcome back!' : 'Account created!',
          color: AppColors.success);
    } catch (e) {
      if (!mounted) return;
      _snack(e.toString(), color: AppColors.danger);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _snack(String msg, {Color? color}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    final online = context.watch<AppState>().isOnline;
    return Scaffold(
      appBar: AppBar(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                gradient: AppColors.heroGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(Icons.home_repair_service_rounded,
                  color: Colors.white, size: 38),
            ),
            const SizedBox(height: 22),
            Text(_isLogin ? 'Welcome back' : 'Create account',
                style: const TextStyle(
                    fontSize: 26, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text(
              _isLogin
                  ? 'Login to book trusted home services'
                  : 'Sign up to get started in minutes',
              style: const TextStyle(color: AppColors.textMuted),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(online ? Icons.cloud_done_rounded : Icons.cloud_off_rounded,
                    size: 15, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Text(online ? 'Connected to server' : 'Offline mode',
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textMuted)),
              ],
            ),
            const SizedBox(height: 22),
            if (!_isLogin) ...[
              _label('Full name'),
              TextField(
                controller: _name,
                decoration: const InputDecoration(
                  hintText: 'John Doe',
                  prefixIcon: Icon(Icons.person_outline_rounded),
                ),
              ),
              const SizedBox(height: 16),
            ],
            _label('Email'),
            TextField(
              controller: _email,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                hintText: 'you@example.com',
                prefixIcon: Icon(Icons.mail_outline_rounded),
              ),
            ),
            const SizedBox(height: 16),
            if (!_isLogin) ...[
              _label('Phone'),
              TextField(
                controller: _phone,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  hintText: '9999999999',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
              ),
              const SizedBox(height: 16),
            ],
            _label('Password'),
            TextField(
              controller: _password,
              obscureText: true,
              decoration: const InputDecoration(
                hintText: '••••••••',
                prefixIcon: Icon(Icons.lock_outline_rounded),
              ),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              onPressed: _busy ? null : _submit,
              child: _busy
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                          strokeWidth: 2.4, color: Colors.white),
                    )
                  : Text(_isLogin ? 'Login' : 'Create Account'),
            ),
            const SizedBox(height: 18),
            Center(
              child: GestureDetector(
                onTap: _busy
                    ? null
                    : () => setState(() => _isLogin = !_isLogin),
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(color: AppColors.textMuted),
                    children: [
                      TextSpan(
                          text: _isLogin
                              ? "Don't have an account? "
                              : 'Already have an account? '),
                      TextSpan(
                        text: _isLogin ? 'Sign up' : 'Login',
                        style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _label(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 8, left: 4),
        child: Text(t,
            style: const TextStyle(
                fontWeight: FontWeight.w600, fontSize: 13.5)),
      );
}
