import 'package:flutter/material.dart';

import '../api_service.dart';
import '../theme.dart';

class ServerSettingsScreen extends StatefulWidget {
  const ServerSettingsScreen({super.key});

  @override
  State<ServerSettingsScreen> createState() => _ServerSettingsScreenState();
}

class _ServerSettingsScreenState extends State<ServerSettingsScreen> {
  late final TextEditingController _url =
      TextEditingController(text: ApiConfig.baseUrl);
  bool _testing = false;
  String? _result;
  bool _ok = false;

  @override
  void dispose() {
    _url.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    await ApiConfig.setBaseUrl(_url.text);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text('Server URL saved'),
          backgroundColor: AppColors.success),
    );
    Navigator.pop(context);
  }

  Future<void> _test() async {
    await ApiConfig.setBaseUrl(_url.text);
    setState(() {
      _testing = true;
      _result = null;
    });
    final ok = ApiConfig.isConfigured ? await ApiService.health() : false;
    setState(() {
      _testing = false;
      _ok = ok;
      _result = ApiConfig.isConfigured
          ? (ok ? 'Connected successfully ✓' : 'Could not reach server')
          : 'Enter a URL first';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Server Settings',
            style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          const Text(
            'Connect the app to your backend',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 8),
          const Text(
            'Leave empty to use offline mode. When set, sign-up and login use '
            'your live API and accounts are stored in your database.',
            style: TextStyle(color: AppColors.textMuted, height: 1.5),
          ),
          const SizedBox(height: 20),
          const Text('API base URL',
              style:
                  TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5)),
          const SizedBox(height: 8),
          TextField(
            controller: _url,
            keyboardType: TextInputType.url,
            autocorrect: false,
            decoration: const InputDecoration(
              hintText: 'https://my-urban-api.herokuapp.com/api',
              prefixIcon: Icon(Icons.dns_rounded),
            ),
          ),
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: _testing ? null : _test,
            icon: _testing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2.2))
                : const Icon(Icons.wifi_tethering_rounded),
            label: const Text('Test connection'),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(50),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14)),
            ),
          ),
          if (_result != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(_ok ? Icons.check_circle_rounded : Icons.error_rounded,
                    color: _ok ? AppColors.success : AppColors.danger,
                    size: 18),
                const SizedBox(width: 6),
                Text(_result!,
                    style: TextStyle(
                        color: _ok ? AppColors.success : AppColors.danger,
                        fontWeight: FontWeight.w600)),
              ],
            ),
          ],
          const SizedBox(height: 24),
          ElevatedButton(onPressed: _save, child: const Text('Save')),
        ],
      ),
    );
  }
}
