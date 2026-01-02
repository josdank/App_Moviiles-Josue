import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../auth/auth_service.dart';
import '../state/app_state.dart';
import 'cart_screen.dart';
import 'order_tracking_screen.dart';
import 'product_detail_screen.dart';

class UserHomeScreen extends StatelessWidget {
  const UserHomeScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    await AuthService().logout();
    if (!context.mounted) return;

    // Limpiar stack; main.dart mostrará LoginScreen
    Navigator.of(context).popUntil((route) => route.isFirst);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sesión cerrada')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final userEmail = Supabase.instance.client.auth.currentUser?.email ?? '';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        actions: [
          IconButton(
            tooltip: 'Mis pedidos',
            icon: const Icon(Icons.local_shipping_outlined),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const OrderTrackingScreen()),
            ),
          ),
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
          ),
        ],
      ),
      body: app.loading
          ? const Center(child: CircularProgressIndicator())
          : app.error != null
              ? Center(child: Text('Error: ${app.error}'))
              : Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Sesión: $userEmail'),
                          const SizedBox(height: 10),
                          TextField(
                            decoration: const InputDecoration(
                              prefixIcon: Icon(Icons.search),
                              hintText: 'Buscar productos...',
                            ),
                            onChanged: app.setSearch,
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 48,
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        children: app.categories.map((c) {
                          final selected = app.selectedCategory == c;
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: ChoiceChip(
                              label: Text(c),
                              selected: selected,
                              onSelected: (_) => app.setCategory(c),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                    Expanded(
                      child: app.filteredProducts.isEmpty
                          ? const Center(child: Text('No hay productos para mostrar.'))
                          : GridView.builder(
                              padding: const EdgeInsets.all(12),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                childAspectRatio: 0.78,
                                crossAxisSpacing: 10,
                                mainAxisSpacing: 10,
                              ),
                              itemCount: app.filteredProducts.length,
                              itemBuilder: (_, i) {
                                final p = app.filteredProducts[i];
                                return InkWell(
                                  onTap: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => ProductDetailScreen(product: p),
                                    ),
                                  ),
                                  child: Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(10),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Expanded(
                                            child: Container(
                                              width: double.infinity,
                                              decoration: BoxDecoration(
                                                borderRadius: BorderRadius.circular(12),
                                                color: Colors.black12,
                                                image: p.imageUrl == null
                                                    ? null
                                                    : DecorationImage(
                                                        image: NetworkImage(p.imageUrl!),
                                                        fit: BoxFit.cover,
                                                      ),
                                              ),
                                              child: p.imageUrl == null
                                                  ? const Center(child: Icon(Icons.image, size: 40))
                                                  : null,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                                          Text('\$${p.price.toStringAsFixed(2)}'),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const CartScreen()),
        ),
        icon: const Icon(Icons.shopping_cart),
        label: Text('Carrito (${app.cart.length})'),
      ),
    );
  }
}
