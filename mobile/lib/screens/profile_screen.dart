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
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(state.tr('profile.title'),
                        style: const TextStyle(
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
                  Text(user?.name ?? state.tr('profile.guest'),
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
                child: Text(state.tr('profile.login')),
              ),
            ),
          const SizedBox(height: 10),
          _tile(Icons.location_on_outlined, state.tr('profile.savedAddresses')),
          _tile(Icons.payment_rounded, state.tr('profile.paymentMethods')),
          _tile(Icons.local_offer_outlined, state.tr('profile.offers')),
          _tile(
            Icons.language_rounded,
            state.tr('profile.language'),
            trailingText: state.lang == 'hi'
                ? state.tr('language.hindi')
                : state.tr('language.english'),
            onTap: () => _showLanguagePicker(context, state),
          ),
          _tile(
            Icons.dns_rounded,
            state.isOnline
                ? '${state.tr('profile.serverSettings')} (${state.tr('profile.onlineMode')})'
                : state.tr('profile.serverSettings'),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ServerSettingsScreen()),
            ),
          ),
          _tile(Icons.headset_mic_rounded, state.tr('profile.help')),
          _tile(Icons.info_outline_rounded, state.tr('profile.about')),
          if (user != null) ...[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: OutlinedButton.icon(
                onPressed: () => state.logout(),
                icon: const Icon(Icons.logout_rounded, color: AppColors.textDark),
                label: Text(state.tr('profile.logout'),
                    style: const TextStyle(color: AppColors.textDark)),
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
                label: Text(state.tr('profile.deleteAccount'),
                    style: const TextStyle(color: AppColors.danger)),
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

  Widget _tile(IconData icon, String label,
      {VoidCallback? onTap, String? trailingText}) {
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
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (trailingText != null)
                Text(trailingText,
                    style: const TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        fontSize: 13)),
              if (onTap != null)
                const Icon(Icons.chevron_right_rounded,
                    color: AppColors.textMuted),
            ],
          ),
        ),
      ),
    );
  }

  /// Bottom sheet to switch the app language. Persisted via [AppState].
  Future<void> _showLanguagePicker(BuildContext context, AppState state) async {
    await showModalBottomSheet<void>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (sheetContext) {
        Widget option(String code, String label) {
          final selected = state.lang == code;
          return ListTile(
            onTap: () async {
              await state.setLanguage(code);
              if (sheetContext.mounted) Navigator.pop(sheetContext);
            },
            leading: Icon(
              selected
                  ? Icons.radio_button_checked_rounded
                  : Icons.radio_button_unchecked_rounded,
              color: selected ? AppColors.primary : AppColors.textMuted,
            ),
            title: Text(label,
                style: TextStyle(
                    fontWeight:
                        selected ? FontWeight.w800 : FontWeight.w600)),
          );
        }

        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(state.tr('language.label'),
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.w800)),
                  ),
                ),
                option('en', state.tr('language.english')),
                option('hi', state.tr('language.hindi')),
              ],
            ),
          ),
        );
      },
    );
  }
}
