import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../auth/auth_service.dart';
import '../state/app_state.dart';

import 'employee_orders_screen.dart';
import 'employee_products_screen.dart';
import 'product_detail_screen.dart';

class EmployeeHomeScreen extends StatefulWidget {
  const EmployeeHomeScreen({super.key});

  @override
  State<EmployeeHomeScreen> createState() => _EmployeeHomeScreenState();
}

class _EmployeeHomeScreenState extends State<EmployeeHomeScreen> {
  int index = 0;

  Future<void> _logout(BuildContext context) async {
    await AuthService().logout();
    if (!mounted) return;

    // Importante: limpiar stack. main.dart se encarga de mostrar LoginScreen
    Navigator.of(context).popUntil((route) => route.isFirst);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sesión cerrada')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    final pages = [
      _EmployeeProductsHome(app: app),
      const EmployeeOrdersScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(index == 0 ? 'Productos (Empleado)' : 'Pedidos (Empleado)'),
        actions: [
          IconButton(
            tooltip: 'Refrescar',
            icon: const Icon(Icons.refresh),
            onPressed: () => context.read<AppState>().loadProducts(),
          ),
          IconButton(
            tooltip: 'Cerrar sesión',
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
          ),
        ],
      ),
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (i) => setState(() => index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.storefront_outlined), label: 'Productos'),
          NavigationDestination(icon: Icon(Icons.receipt_long_outlined), label: 'Pedidos'),
        ],
      ),
      floatingActionButton: index == 0
          ? FloatingActionButton.extended(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const EmployeeProductsScreen()),
              ),
              icon: const Icon(Icons.add),
              label: const Text('Nuevo'),
            )
          : null,
    );
  }
}

class _EmployeeProductsHome extends StatelessWidget {
  final AppState app;
  const _EmployeeProductsHome({required this.app});

  @override
  Widget build(BuildContext context) {
    if (app.loading) return const Center(child: CircularProgressIndicator());
    if (app.error != null) return Center(child: Text('Error: ${app.error}'));

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 8),
          child: TextField(
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Buscar productos...',
            ),
            onChanged: app.setSearch,
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

                    return Card(
                      child: InkWell(
                        borderRadius: BorderRadius.circular(16),
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => ProductDetailScreen(product: p)),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: Stack(
                                  children: [
                                    Container(
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
                                    Positioned(
                                      right: 6,
                                      top: 6,
                                      child: Row(
                                        children: [
                                          IconButton(
                                            style: IconButton.styleFrom(backgroundColor: Colors.white),
                                            icon: const Icon(Icons.edit, size: 18),
                                            onPressed: () {
                                              Navigator.push(
                                                context,
                                                MaterialPageRoute(
                                                  builder: (_) => EmployeeProductsScreen(editProductId: p.id),
                                                ),
                                              );
                                            },
                                          ),
                                          const SizedBox(width: 6),
                                          IconButton(
                                            style: IconButton.styleFrom(backgroundColor: Colors.white),
                                            icon: const Icon(Icons.delete, size: 18),
                                            onPressed: () async {
                                              final ok = await showDialog<bool>(
                                                context: context,
                                                builder: (dialogCtx) => AlertDialog(
                                                  title: const Text('Eliminar producto'),
                                                  content: Text('Se eliminará "${p.name}".'),
                                                  actions: [
                                                    TextButton(
                                                      onPressed: () => Navigator.pop(dialogCtx, false),
                                                      child: const Text('Cancelar'),
                                                    ),
                                                    ElevatedButton(
                                                      onPressed: () => Navigator.pop(dialogCtx, true),
                                                      child: const Text('Eliminar'),
                                                    ),
                                                  ],
                                                ),
                                              );

                                              if (ok == true) {
                                                await context.read<AppState>().deleteProduct(p.id);
                                                if (!context.mounted) return;
                                                ScaffoldMessenger.of(context).showSnackBar(
                                                  const SnackBar(content: Text('Producto eliminado')),
                                                );
                                              }
                                            },
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
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
    );
  }
}
