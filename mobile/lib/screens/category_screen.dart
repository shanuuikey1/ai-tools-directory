import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../models.dart';
import '../sample_data.dart';
import '../theme.dart';
import '../widgets/service_list_tile.dart';

class CategoryScreen extends StatelessWidget {
  final ServiceCategory category;
  const CategoryScreen({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    final services = servicesByCategory(category.name);
    return Scaffold(
      appBar: AppBar(
        title: Text(context.watch<AppState>().tr(category.name),
            style: const TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: services.isEmpty
          ? const _Empty()
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
              itemCount: services.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (_, i) => ServiceListTile(service: services[i]),
            ),
    );
  }
}

class _Empty extends StatelessWidget {
  const _Empty();
  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.handyman_rounded,
                size: 56, color: AppColors.textMuted),
            const SizedBox(height: 16),
            Text(state.tr('category.comingSoon'),
                style: const TextStyle(color: AppColors.textMuted)),
          ],
        ),
      ),
    );
  }
}
