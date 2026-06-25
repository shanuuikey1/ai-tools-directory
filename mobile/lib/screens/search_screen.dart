import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../app_state.dart';
import '../models.dart';
import '../sample_data.dart';
import '../theme.dart';
import '../widgets/service_list_tile.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final List<ServiceItem> results = _query.isEmpty
        ? kServices
        : kServices
            .where((s) =>
                s.name.toLowerCase().contains(_query.toLowerCase()) ||
                s.category.toLowerCase().contains(_query.toLowerCase()))
            .toList();

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: 16),
          child: TextField(
            autofocus: true,
            onChanged: (v) => setState(() => _query = v),
            decoration: InputDecoration(
              hintText: state.tr('search.hint'),
              prefixIcon: const Icon(Icons.search_rounded),
            ),
          ),
        ),
      ),
      body: results.isEmpty
          ? Center(
              child: Text(state.tr('search.noResults'),
                  style: const TextStyle(color: AppColors.textMuted)),
            )
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
              itemCount: results.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (_, i) => ServiceListTile(service: results[i]),
            ),
    );
  }
}
