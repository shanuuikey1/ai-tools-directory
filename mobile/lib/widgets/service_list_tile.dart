import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import '../screens/service_detail_screen.dart';

/// Reusable horizontal service card used in lists and search results.
class ServiceListTile extends StatelessWidget {
  final ServiceItem service;
  const ServiceListTile({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return InkWell(
      borderRadius: BorderRadius.circular(20),
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => ServiceDetailScreen(service: service)),
      ),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: softShadow,
        ),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: service.color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(service.icon, color: service.color, size: 30),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(service.name,
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded,
                          color: AppColors.warning, size: 16),
                      const SizedBox(width: 2),
                      Text('${service.rating} (${service.reviews})',
                          style: const TextStyle(
                              fontSize: 12.5, color: AppColors.textMuted)),
                    ],
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(state.tr('home.from'),
                    style: const TextStyle(
                        fontSize: 11, color: AppColors.textMuted)),
                Text('₹${service.basePrice}',
                    style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primary)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
