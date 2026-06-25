import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../models.dart';
import '../theme.dart';
import 'auth_screen.dart';

class ServiceDetailScreen extends StatelessWidget {
  final ServiceItem service;
  const ServiceDetailScreen({super.key, required this.service});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240,
            pinned: true,
            backgroundColor: service.color,
            foregroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      service.color,
                      Color.lerp(service.color, Colors.black, 0.25)!,
                    ],
                  ),
                ),
                child: Center(
                  child: Icon(service.icon,
                      size: 110,
                      color: Colors.white.withValues(alpha: 0.9)),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      _Pill(
                        icon: Icons.star_rounded,
                        text: '${service.rating}',
                        color: AppColors.warning,
                      ),
                      const SizedBox(width: 10),
                      _Pill(
                        icon: Icons.reviews_rounded,
                        text: '${service.reviews} reviews',
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 10),
                      _Pill(
                        icon: Icons.schedule_rounded,
                        text: '${service.durationMins} min',
                        color: AppColors.accent,
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text(service.name,
                      style: const TextStyle(
                          fontSize: 24, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 6),
                  Text(service.category,
                      style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 18),
                  const Text('About this service',
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Text(service.description,
                      style: const TextStyle(
                          height: 1.6, color: AppColors.textMuted)),
                  const SizedBox(height: 22),
                  const Text("What's included",
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 12),
                  ..._includes.map((t) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded,
                                color: AppColors.success, size: 20),
                            const SizedBox(width: 10),
                            Text(t),
                          ],
                        ),
                      )),
                  const SizedBox(height: 90),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: _BookBar(service: service),
    );
  }

  static const _includes = [
    'Verified, trained professional',
    'All tools & materials included',
    '30-day service warranty',
    'Free reschedule up to 2 hours before',
  ];
}

class _Pill extends StatelessWidget {
  final IconData icon;
  final String text;
  final Color color;
  const _Pill({required this.icon, required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 15),
          const SizedBox(width: 4),
          Text(text,
              style: TextStyle(
                  color: color, fontWeight: FontWeight.w700, fontSize: 12)),
        ],
      ),
    );
  }
}

class _BookBar extends StatelessWidget {
  final ServiceItem service;
  const _BookBar({required this.service});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('Total price',
                  style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
              Text('₹${service.basePrice}',
                  style: const TextStyle(
                      fontSize: 22, fontWeight: FontWeight.w800)),
            ],
          ),
          const SizedBox(width: 18),
          Expanded(
            child: ElevatedButton(
              onPressed: () => _startBooking(context),
              child: const Text('Book Now'),
            ),
          ),
        ],
      ),
    );
  }

  void _startBooking(BuildContext context) {
    final state = context.read<AppState>();
    if (!state.isLoggedIn) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const AuthScreen()),
      );
      return;
    }
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _BookingSheet(service: service),
    );
  }
}

class _BookingSheet extends StatefulWidget {
  final ServiceItem service;
  const _BookingSheet({required this.service});

  @override
  State<_BookingSheet> createState() => _BookingSheetState();
}

class _BookingSheetState extends State<_BookingSheet> {
  DateTime _date = DateTime.now().add(const Duration(days: 1));
  TimeOfDay _time = const TimeOfDay(hour: 10, minute: 0);
  final _addressController = TextEditingController();
  bool _loading = false;

  @override
  void dispose() {
    _addressController.dispose();
    super.dispose();
  }

  List<DateTime> _getNext7Days() {
    final today = DateTime.now();
    return List.generate(7, (i) => today.add(Duration(days: i)));
  }

  TimeOfDay _parseSlot(String slot) {
    final parts = slot.split(':');
    return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _date,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked != null) setState(() => _date = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(context: context, initialTime: _time);
    if (picked != null) setState(() => _time = picked);
  }

  Future<void> _confirm() async {
    if (_addressController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your address')),
      );
      return;
    }

    setState(() => _loading = true);

    try {
      final dt = DateTime(
        _date.year,
        _date.month,
        _date.day,
        _time.hour,
        _time.minute,
      );

      // Perform checkout including payments creation and verification
      await context.read<AppState>().checkoutBooking(
            service: widget.service,
            dateTime: dt,
            address: _addressController.text.trim(),
          );

      if (!mounted) return;
      Navigator.pop(context); // close sheet

      showDialog(
        context: context,
        builder: (_) => _SuccessDialog(service: widget.service),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Checkout failed: ${e.toString()}'),
          backgroundColor: AppColors.danger,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Widget _buildDateSlider() {
    final days = _getNext7Days();
    return SizedBox(
      height: 85,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: days.length + 1,
        itemBuilder: (context, index) {
          if (index == days.length) {
            // Custom Date Picker Button at the end
            return Padding(
              padding: const EdgeInsets.only(right: 4),
              child: InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: 70,
                  margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE4E7F0)),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.calendar_month_rounded, color: AppColors.primary, size: 24),
                      SizedBox(height: 4),
                      Text('Other', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                ),
              ),
            );
          }

          final day = days[index];
          final isSelected = DateUtils.isSameDay(_date, day);
          final dayName = DateFormat('EEE').format(day);
          final dayNum = DateFormat('d').format(day);
          final monthName = DateFormat('MMM').format(day);

          return InkWell(
            onTap: () => setState(() => _date = day),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: 70,
              margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [AppColors.primary, AppColors.accent],
                      )
                    : null,
                color: isSelected ? null : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: isSelected ? null : Border.all(color: const Color(0xFFE4E7F0)),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.25),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        )
                      ]
                    : null,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(dayName,
                      style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: isSelected ? Colors.white.withValues(alpha: 0.8) : AppColors.textMuted)),
                  const SizedBox(height: 2),
                  Text(dayNum,
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? Colors.white : AppColors.textDark)),
                  const SizedBox(height: 2),
                  Text(monthName,
                      style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: isSelected ? Colors.white.withValues(alpha: 0.8) : AppColors.textMuted)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimeGrid() {
    final slots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        ...slots.map((slot) {
          final slotTime = _parseSlot(slot);
          final isSelected = _time.hour == slotTime.hour && _time.minute == slotTime.minute;
          
          // Format for display (e.g. 10:00 AM)
          final tempDt = DateTime(2026, 1, 1, slotTime.hour, slotTime.minute);
          final displayLabel = DateFormat('hh:mm a').format(tempDt);

          return InkWell(
            onTap: () => setState(() => _time = slotTime),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary.withValues(alpha: 0.1) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? AppColors.primary : const Color(0xFFE4E7F0),
                  width: isSelected ? 1.5 : 1,
                ),
              ),
              child: Text(
                displayLabel,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: isSelected ? AppColors.primary : AppColors.textDark,
                ),
              ),
            ),
          );
        }),
        // Custom selector chip
        InkWell(
          onTap: _pickTime,
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE4E7F0)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.more_time_rounded, size: 14, color: AppColors.primary),
                const SizedBox(width: 4),
                Text(
                  'Other',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        padding: const EdgeInsets.all(22),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0E3ED),
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 18),
            const Text('Schedule your service',
                style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800)),
            const SizedBox(height: 18),
            const Text('Select Date',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            const SizedBox(height: 8),
            _buildDateSlider(),
            const SizedBox(height: 18),
            const Text('Select Time Slot',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            const SizedBox(height: 8),
            _buildTimeGrid(),
            const SizedBox(height: 18),
            const Text('Service Address',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
            const SizedBox(height: 8),
            TextField(
              controller: _addressController,
              maxLines: 2,
              enabled: !_loading,
              decoration: const InputDecoration(
                hintText: 'Enter your full address',
                prefixIcon: Icon(Icons.location_on_outlined),
              ),
            ),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.bg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: [
                  _row('Service', widget.service.name),
                  const SizedBox(height: 8),
                  _row('Price', '₹${widget.service.basePrice}'),
                  const Divider(height: 22),
                  _row('Total payable', '₹${widget.service.basePrice}',
                      bold: true),
                ],
              ),
            ),
            const SizedBox(height: 18),
            _loading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 8),
                      child: CircularProgressIndicator(),
                    ),
                  )
                : ElevatedButton(
                    onPressed: _confirm,
                    child: const Text('Confirm & Pay Now'),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _row(String l, String r, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(l,
            style: TextStyle(
                color: bold ? AppColors.textDark : AppColors.textMuted,
                fontWeight: bold ? FontWeight.w700 : FontWeight.w500)),
        Text(r,
            style: TextStyle(
                fontWeight: bold ? FontWeight.w800 : FontWeight.w600,
                color: bold ? AppColors.primary : AppColors.textDark)),
      ],
    );
  }
}


class _SuccessDialog extends StatelessWidget {
  final ServiceItem service;
  const _SuccessDialog({required this.service});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      child: Padding(
        padding: const EdgeInsets.all(26),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_rounded,
                  color: AppColors.success, size: 44),
            ),
            const SizedBox(height: 18),
            const Text('Booking Confirmed!',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
            const SizedBox(height: 8),
            Text(
              'Your ${service.name} is booked. A professional will reach out to confirm shortly.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textMuted, height: 1.5),
            ),
            const SizedBox(height: 22),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // dialog
                Navigator.pop(context); // detail -> back home
              },
              child: const Text('Done'),
            ),
          ],
        ),
      ),
    );
  }
}
