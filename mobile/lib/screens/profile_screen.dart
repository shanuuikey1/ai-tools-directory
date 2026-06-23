import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../api_service.dart';
import '../app_state.dart';
import '../theme.dart';
import 'auth_screen.dart';
import 'server_settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final user = state.user;

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: AppColors.heroGradient,
              borderRadius:
                  BorderRadius.vertical(bottom: Radius.circular(32)),
            ),
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
            child: SafeArea(
              bottom: false,
              child: Column(
                children: [
                  const Align(
                    alignment: Alignment.centerLeft,
                    child: Text('Profile',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w800)),
                  ),
                  const SizedBox(height: 20),
                  CircleAvatar(
                    radius: 42,
                    backgroundColor: Colors.white,
                    child: Text(
                      user == null
                          ? '?'
                          : user.name.isNotEmpty
                              ? user.name[0].toUpperCase()
                              : 'U',
                      style: const TextStyle(
                          fontSize: 34,
                          fontWeight: FontWeight.w800,
                          color: AppColors.primary),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(user?.name ?? 'Guest user',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 19,
                          fontWeight: FontWeight.w800)),
                  if (user != null) ...[
                    const SizedBox(height: 4),
                    Text(user.email,
                        style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.85))),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (user == null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: ElevatedButton(
                onPressed: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const AuthScreen())),
                child: const Text('Login / Sign up'),
              ),
            ),
          const SizedBox(height: 10),
          _tile(Icons.location_on_outlined, 'Saved Addresses'),
          _tile(Icons.payment_rounded, 'Payment Methods'),
          _tile(Icons.local_offer_outlined, 'Offers & Coupons'),
          _tile(
            Icons.dns_rounded,
            state.isOnline ? 'Server (connected)' : 'Server Settings',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ServerSettingsScreen()),
            ),
          ),
          _tile(Icons.headset_mic_rounded, 'Help & Support'),
          _tile(Icons.info_outline_rounded, 'About Us'),
          if (user != null) ...[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: OutlinedButton.icon(
                onPressed: () => state.logout(),
                icon: const Icon(Icons.logout_rounded, color: AppColors.textDark),
                label: const Text('Logout',
                    style: TextStyle(color: AppColors.textDark)),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(52),
                  side: const BorderSide(color: Color(0xFFE4E7F0)),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: TextButton.icon(
                onPressed: () => _confirmDelete(context, state),
                icon: const Icon(Icons.delete_outline_rounded,
                    color: AppColors.danger, size: 20),
                label: const Text('Delete my account',
                    style: TextStyle(color: AppColors.danger)),
              ),
            ),
          ],
          const SizedBox(height: 20),
          const Center(
            child: Text('Ghar Pahuch Seva v1.0.0',
                style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
          ),
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, AppState state) async {
    final controller = TextEditingController();
    final online = state.isOnline;

    await showDialog<void>(
      context: context,
      builder: (dialogContext) {
        bool busy = false;
        String? error;
        return StatefulBuilder(
          builder: (context, setState) {
            Future<void> doDelete() async {
              if (online && controller.text.isEmpty) {
                setState(() => error = 'Please enter your password to confirm.');
                return;
              }
              setState(() {
                busy = true;
                error = null;
              });
              try {
                await state.deleteAccount(password: controller.text);
                if (dialogContext.mounted) Navigator.pop(dialogContext);
              } on ApiException catch (e) {
                setState(() {
                  busy = false;
                  error = e.message;
                });
              } catch (_) {
                setState(() {
                  busy = false;
                  error = 'Could not delete your account. Please try again.';
                });
              }
            }

            return AlertDialog(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18)),
              title: const Text('Delete your account?'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'This permanently deletes your account and personal data. '
                    'Records we are legally required to keep (such as paid '
                    'transactions for tax) are anonymised, not removed. This '
                    'cannot be undone.',
                    style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                  ),
                  if (online) ...[
                    const SizedBox(height: 16),
                    TextField(
                      controller: controller,
                      obscureText: true,
                      enabled: !busy,
                      decoration: const InputDecoration(
                        labelText: 'Confirm your password',
                      ),
                    ),
                  ],
                  if (error != null) ...[
                    const SizedBox(height: 10),
                    Text(error!,
                        style: const TextStyle(
                            color: AppColors.danger, fontSize: 13)),
                  ],
                ],
              ),
              actions: [
                TextButton(
                  onPressed: busy ? null : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: busy ? null : doDelete,
                  style: FilledButton.styleFrom(
                      backgroundColor: AppColors.danger),
                  child: Text(busy ? 'Deleting…' : 'Delete'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _tile(IconData icon, String label, {VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 10),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: ListTile(
          onTap: onTap,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.primary, size: 20),
          ),
          title: Text(label,
              style: const TextStyle(fontWeight: FontWeight.w600)),
          trailing: const Icon(Icons.chevron_right_rounded,
              color: AppColors.textMuted),
        ),
      ),
    );
  }
}
