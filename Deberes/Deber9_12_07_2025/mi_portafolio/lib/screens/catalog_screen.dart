import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import 'cart_screen.dart';

class CatalogScreen extends StatelessWidget {
  const CatalogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final products = const [
      Product(id: '1', name: 'Laptop', price: 800),
      Product(id: '2', name: 'Smartphone', price: 500),
      Product(id: '3', name: 'Auriculares', price: 50),
      Product(id: '4', name: 'Monitor', price: 200),
      Product(id: '5', name: 'Teclado', price: 35),
      Product(id: '6', name: 'Mouse', price: 25),
    ];

    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Catálogo de Productos'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            tooltip: 'Ver carrito',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CartScreen()),
              );
            },
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: products.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final product = products[index];
          return ProductCard(
            product: product,
            onAddOne: () => cart.add(product, 1, context),
            onAddMany: () => cart.add(product, 2, context),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CartScreen()),
          );
        },
        icon: const Icon(Icons.receipt_long),
        label: const Text('Ver Carrito'),
      ),
    );
  }
}
