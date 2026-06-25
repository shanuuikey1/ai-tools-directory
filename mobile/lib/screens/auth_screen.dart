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
    final state = context.read<AppState>();
    if (_email.text.trim().isEmpty || _password.text.trim().isEmpty) {
      _snack(state.tr('auth.fillEmailPassword'));
      return;
    }
    if (!_isLogin && _name.text.trim().isEmpty) {
      _snack(state.tr('auth.enterName'));
      return;
    }

    setState(() => _busy = true);
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
      _snack(
          _isLogin
              ? state.tr('auth.welcomeSnack')
              : state.tr('auth.createdSnack'),
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
    final state = context.watch<AppState>();
    final online = state.isOnline;
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
            Text(
                _isLogin
                    ? state.tr('auth.loginTitle')
                    : state.tr('auth.registerTitle'),
                style: const TextStyle(
                    fontSize: 26, fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text(
              _isLogin
                  ? state.tr('auth.loginSubtitle')
                  : state.tr('auth.registerSubtitle'),
              style: const TextStyle(color: AppColors.textMuted),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(online ? Icons.cloud_done_rounded : Icons.cloud_off_rounded,
                    size: 15, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Text(online ? state.tr('auth.connected') : state.tr('auth.offline'),
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textMuted)),
              ],
            ),
            const SizedBox(height: 22),
            if (!_isLogin) ...[
              _label(state.tr('auth.name')),
              TextField(
                controller: _name,
                decoration: InputDecoration(
                  hintText: state.tr('auth.namePlaceholder'),
                  prefixIcon: const Icon(Icons.person_outline_rounded),
                ),
              ),
              const SizedBox(height: 16),
            ],
            _label(state.tr('auth.email')),
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
              _label(state.tr('auth.phone')),
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
            _label(state.tr('auth.password')),
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
                  : Text(_isLogin
                      ? state.tr('auth.login')
                      : state.tr('auth.register')),
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
                              ? '${state.tr('auth.noAccount')} '
                              : '${state.tr('auth.haveAccount')} '),
                      TextSpan(
                        text: _isLogin
                            ? state.tr('auth.signUp')
                            : state.tr('auth.logIn'),
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
