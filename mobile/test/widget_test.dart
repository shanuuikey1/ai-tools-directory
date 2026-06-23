import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:ghar_pahuch_seva/app_state.dart';
import 'package:ghar_pahuch_seva/main.dart';

void main() {
  testWidgets('App boots and shows splash branding', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const GharPahuchSevaApp(),
      ),
    );
    expect(find.text('Ghar Pahuch Seva'), findsOneWidget);
  });
}
