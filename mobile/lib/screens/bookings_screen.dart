import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';

class BookingsScreen extends StatelessWidget {
  const BookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final bookings = state.bookings;
    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Text(state.tr('bookings.title'),
                  style: const TextStyle(
                      fontSize: 26, fontWeight: FontWeight.w800)),
            ),
            Expanded(
              child: bookings.isEmpty
                  ? const _EmptyBookings()
                  : ListView.separated(
                      padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                      itemCount: bookings.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 14),
                      itemBuilder: (_, i) =>
                          _BookingCard(booking: bookings[i]),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyBookings extends StatelessWidget {
  const _EmptyBookings();
  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 110,
            height: 110,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.receipt_long_rounded,
                size: 52, color: AppColors.primary),
          ),
          const SizedBox(height: 20),
          Text(state.tr('bookings.empty'),
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Text(state.tr('bookings.emptyHint'),
              style: const TextStyle(color: AppColors.textMuted)),
        ],
      ),
    );
  }
}

class _BookingCard extends StatelessWidget {
  final Booking booking;
  const _BookingCard({required this.booking});

  Color get _statusColor {
    switch (booking.status) {
      case BookingStatus.confirmed:
        return AppColors.primary;
      case BookingStatus.completed:
        return AppColors.success;
      case BookingStatus.cancelled:
        return AppColors.danger;
      case BookingStatus.pending:
        return AppColors.warning;
    }
  }

  String _statusKey() {
    switch (booking.status) {
      case BookingStatus.confirmed:
        return 'bookings.statusConfirmed';
      case BookingStatus.completed:
        return 'bookings.statusCompleted';
      case BookingStatus.cancelled:
        return 'bookings.statusCancelled';
      case BookingStatus.pending:
        return 'bookings.statusPending';
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final s = booking.service;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: softShadow,
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: s.color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(s.icon, color: s.color, size: 28),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(s.name,
                        style: const TextStyle(
                            fontSize: 15, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Text(
                      DateFormat('EEE, d MMM • h:mm a')
                          .format(booking.dateTime),
                      style: const TextStyle(
                          fontSize: 12.5, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(state.tr(_statusKey()),
                    style: TextStyle(
                        color: _statusColor,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const Divider(height: 24),
          Row(
            children: [
              const Icon(Icons.location_on_outlined,
                  size: 16, color: AppColors.textMuted),
              const SizedBox(width: 6),
              Expanded(
                child: Text(booking.address,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                        fontSize: 12.5, color: AppColors.textMuted)),
              ),
              Text('₹${booking.total}',
                  style: const TextStyle(
                      fontWeight: FontWeight.w800,
                      color: AppColors.primary,
                      fontSize: 16)),
            ],
          ),
          if (booking.status == BookingStatus.confirmed) ...[
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () =>
                        context.read<AppState>().cancelBooking(booking.id),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.danger,
                      minimumSize: const Size.fromHeight(44),
                      side: const BorderSide(color: Color(0xFFF3C7C7)),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(state.tr('common.cancel')),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _rate(context),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(44),
                    ),
                    child: Text(state.tr('bookings.markDone')),
                  ),
                ),
              ],
            ),
          ],
          if (booking.status == BookingStatus.completed &&
              booking.rating != null) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                Text(state.tr('bookings.youRated'),
                    style: const TextStyle(
                        fontSize: 12.5, color: AppColors.textMuted)),
                ...List.generate(
                  5,
                  (i) => Icon(
                    i < booking.rating! ? Icons.star_rounded : Icons.star_border_rounded,
                    size: 18,
                    color: AppColors.warning,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  void _rate(BuildContext context) {
    int rating = 5;
    final state = context.read<AppState>();
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSt) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: Text(state.tr('bookings.rateTitle')),
          content: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              5,
              (i) => IconButton(
                onPressed: () => setSt(() => rating = i + 1),
                icon: Icon(
                  i < rating ? Icons.star_rounded : Icons.star_border_rounded,
                  color: AppColors.warning,
                  size: 34,
                ),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                context.read<AppState>().rateBooking(booking.id, rating);
                Navigator.pop(ctx);
              },
              child: Text(state.tr('bookings.submit')),
            ),
          ],
        ),
      ),
    );
  }
}
