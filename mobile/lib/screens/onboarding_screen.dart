import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../theme.dart';
import 'main_shell.dart';

class _Slide {
  final IconData icon;
  final String titleKey;
  final String subtitleKey;
  const _Slide(this.icon, this.titleKey, this.subtitleKey);
}

const _slides = [
  _Slide(Icons.touch_app_rounded, 'onboarding.title1', 'onboarding.desc1'),
  _Slide(Icons.verified_user_rounded, 'onboarding.title2', 'onboarding.desc2'),
  _Slide(Icons.payments_rounded, 'onboarding.title3', 'onboarding.desc3'),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  void _finish() {
    context.read<AppState>().completeOnboarding();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const MainShell()),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isLast = _page == _slides.length - 1;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: _finish,
                child: Text(state.tr('onboarding.skip'),
                    style: const TextStyle(color: AppColors.textMuted)),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                onPageChanged: (i) => setState(() => _page = i),
                itemCount: _slides.length,
                itemBuilder: (_, i) {
                  final s = _slides[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 180,
                          height: 180,
                          decoration: BoxDecoration(
                            gradient: AppColors.heroGradient,
                            borderRadius: BorderRadius.circular(48),
                            boxShadow: softShadow,
                          ),
                          child: Icon(s.icon, size: 84, color: Colors.white),
                        ),
                        const SizedBox(height: 48),
                        Text(
                          state.tr(s.titleKey),
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 26, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          state.tr(s.subtitleKey),
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 15,
                              height: 1.5,
                              color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _slides.length,
                (i) => AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _page == i ? 22 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _page == i ? AppColors.primary : const Color(0xFFD7DAE6),
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: ElevatedButton(
                onPressed: () {
                  if (isLast) {
                    _finish();
                  } else {
                    _controller.nextPage(
                      duration: const Duration(milliseconds: 350),
                      curve: Curves.easeOut,
                    );
                  }
                },
                child: Text(isLast
                    ? state.tr('onboarding.getStarted')
                    : state.tr('common.next')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
