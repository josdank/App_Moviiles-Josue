import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 800;
    final app = context.watch<AppState>();

    final categories = const [
      ('Hamburguesas', Icons.lunch_dining),
      ('Pollo', Icons.set_meal),
      ('Acompañantes', Icons.restaurant),
      ('Bebidas', Icons.local_drink),
    ];

    Widget grid() {
      final cross = isDesktop ? 4 : 2;
      return GridView.count( // GridView
        crossAxisCount: cross,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        children: [
          for (final c in categories)
            _CategoryCard(
              label: c.$1,
              icon: c.$2,
              onTap: () {
                context.read<AppState>().setCategoryFilter(c.$1);
                Navigator.pushNamed(context, '/menu');
              },
            ),
        ],
      );
    }

    return Scaffold( // Scaffold
      appBar: AppBar( // AppBar
        title: const Text('Comidad Rápida'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () => Navigator.pushNamed(context, '/cart'),
          ),
        ],
      ),
      drawer: isDesktop ? null : Drawer( // Drawer
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.redAccent),
              child: Align( // Align
                alignment: Alignment.bottomLeft,
                child: Text('Menú', style: TextStyle(color: Colors.white, fontSize: 20)),
              ),
            ),
            for (final c in categories)
              ListTile(
                leading: Icon(c.$2),
                title: Text(c.$1),
                onTap: () {
                  Navigator.pop(context);
                  context.read<AppState>().setCategoryFilter(c.$1);
                  Navigator.pushNamed(context, '/menu');
                },
              ),
          ],
        ),
      ),
      body: Padding( // Padding
        padding: const EdgeInsets.all(16),
        child: Column( // Column
          children: [
            _PopularBanner(
              showPopular: app.showPopular,
              onToggle: (v) => context.read<AppState>().togglePopular(v),
            ),
            const SizedBox(height: 12), // SizedBox
            Expanded(child: grid()), // Expanded
          ],
        ),
      ),
    );
  }
}

class _PopularBanner extends StatelessWidget {
  final bool showPopular;
  final ValueChanged<bool> onToggle;

  const _PopularBanner({required this.showPopular, required this.onToggle});

  @override
  Widget build(BuildContext context) {
    return Stack( // Stack (un solo badge arriba)
      children: [
        Container( // Container
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
          ),
          child: Row( // Row
            children: [
              const Icon(Icons.trending_up, color: Colors.pink),
              const SizedBox(width: 8),
              const Expanded(child: Text('Popular')),
              Switch( // Switch
                value: showPopular,
                onChanged: onToggle,
              ),
            ],
          ),
        ),
        Positioned(
          right: 12,
          top: -4,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.secondaryContainer,
              borderRadius: BorderRadius.circular(999),
            ),
            child: const Text('Destacado', style: TextStyle(fontSize: 12)),
          ),
        ),
      ],
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _CategoryCard({required this.label, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container( // Container
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 6)],
        ),
        padding: const EdgeInsets.all(16),
        child: Column( // Column
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
