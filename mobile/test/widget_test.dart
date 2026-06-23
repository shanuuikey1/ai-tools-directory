import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:urban_services/app_state.dart';
import 'package:urban_services/main.dart';

void main() {
  testWidgets('App boots and shows splash branding', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AppState(),
        child: const UrbanServicesApp(),
      ),
    );
    expect(find.text('Ghar Pahuch Seva'), findsOneWidget);
  });
}
