import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../models/product.dart';
import '../widgets/quantity_stepper.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 900;

    final products = demoProducts.where((p) {
      final matchesCategory = app.selectedCategory.isEmpty || p.category == app.selectedCategory;
      final matchesSearch = app.searchQuery.isEmpty || p.name.toLowerCase().contains(app.searchQuery.toLowerCase());
      final matchesPopular = app.showPopular ? p.isPopular : true;
      return matchesCategory && matchesSearch && matchesPopular;
    }).toList();

    return Scaffold( // Scaffold
      appBar: AppBar( // AppBar
        title: Text(app.selectedCategory.isEmpty ? 'Menú' : app.selectedCategory),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () => Navigator.pushNamed(context, '/cart'),
          ),
        ],
      ),
      body: Padding( // Padding
        padding: const EdgeInsets.all(16),
        child: Column( // Column
          children: [
            Row( // Row
              children: [
                Expanded( // Expanded
                  child: TextField( // TextField
                    decoration: const InputDecoration(
                      hintText: 'Buscar...',
                      prefixIcon: Icon(Icons.search),
                    ),
                    onChanged: context.read<AppState>().setSearchQuery,
                  ),
                ),
                const SizedBox(width: 8), // SizedBox
                OutlinedButton( // OutlinedButton
                  onPressed: () => context.read<AppState>().setSearchQuery(''),
                  child: const Text('Limpiar'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Expanded( // Expanded
              child: isDesktop
                  ? GridView.builder( // GridView
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 2.5,
                      ),
                      itemCount: products.length,
                      itemBuilder: (_, i) => ProductMenuCard(product: products[i]),
                    )
                  : ListView.separated( // ListView
                      itemCount: products.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (_, i) => ProductMenuCard(product: products[i]),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProductMenuCard extends StatefulWidget {
  final Product product;
  const ProductMenuCard({super.key, required this.product});

  @override
  State<ProductMenuCard> createState() => _ProductMenuCardState();
}

class _ProductMenuCardState extends State<ProductMenuCard> {
  int qty = 1;
  bool combo = false;
  final Set<String> selectedExtras = {};
  final Set<String> selectedPromos = {};

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Container( // Container
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
      ),
      child: Column( // Column
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row( // Row
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(p.imageAsset, width: 96, height: 96, fit: BoxFit.cover),
              ),
              const SizedBox(width: 12),
              Expanded( // Expanded
                child: Column( // Column
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.name, style: const TextStyle(fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Text(p.description, maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 6),
                    Text('\$${p.price.toStringAsFixed(2)}',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary)),
                  ],
                ),
              ),
              QuantityStepper( // OutlinedButton + Row
                quantity: qty,
                onChanged: (v) => setState(() => qty = v.clamp(1, 99)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SwitchListTile( // Switch
            contentPadding: EdgeInsets.zero,
            title: const Text('Hacer combo'),
            value: combo,
            onChanged: (v) => setState(() => combo = v),
          ),
          if (p.extras.isNotEmpty) ...[
            const Text('Extras'),
            const SizedBox(height: 4),
            Wrap(
              spacing: 8,
              children: [
                for (final e in p.extras)
                  FilterChip(
                    label: Text(e),
                    selected: selectedExtras.contains(e),
                    onSelected: (s) => setState(() {
                      if (s) {
                        selectedExtras.add(e);
                      } else {
                        selectedExtras.remove(e);
                      }
                    }),
                  ),
              ],
            ),
          ],
          if (p.promotions.isNotEmpty) ...[
            const SizedBox(height: 8),
            const Text('Promociones'),
            const SizedBox(height: 4),
            Wrap(
              spacing: 8,
              children: [
                for (final m in p.promotions)
                  FilterChip(
                    label: Text(m),
                    selected: selectedPromos.contains(m),
                    onSelected: (s) => setState(() {
                      if (s) {
                        selectedPromos.add(m);
                      } else {
                        selectedPromos.remove(m);
                      }
                    }),
                  ),
              ],
            ),
          ],
          const SizedBox(height: 12),
          Row( // Row
            children: [
              Expanded(
                child: ElevatedButton( // ElevatedButton
                  onPressed: () {
                    context.read<AppState>().addToCart(
                      p,
                      quantity: qty,
                      extras: selectedExtras,
                      promos: selectedPromos,
                      combo: combo,
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Añadido: ${p.name} x$qty')),
                    );
                  },
                  child: const Text('Añadir al carrito'),
                ),
              ),
              const SizedBox(width: 8),
              TextButton( // TextButton
                onPressed: () => Navigator.pushNamed(context, '/product', arguments: p),
                child: const Text('Ver detalle'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
