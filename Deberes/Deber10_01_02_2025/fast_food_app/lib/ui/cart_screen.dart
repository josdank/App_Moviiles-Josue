import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import 'checkout_screen.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(title: const Text('Carrito')),
      body: app.cart.isEmpty
          ? const Center(child: Text('Carrito vacío'))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    itemCount: app.cart.length,
                    itemBuilder: (_, i) {
                      final item = app.cart[i];

                      final promo = item.selectedOfferTitle ?? 'Sin oferta';
                      final disc = item.selectedDiscountPercent > 0
                          ? ' -${item.selectedDiscountPercent.toStringAsFixed(0)}%'
                          : '';
                      final gift = (item.selectedFreeItem != null && item.selectedFreeItem!.trim().isNotEmpty)
                          ? ' • Regalo: ${item.selectedFreeItem}'
                          : '';

                      return ListTile(
                        title: Text(item.product.name),
                        subtitle: Text('$promo$disc$gift\nUnit: \$${item.unitPriceFinal.toStringAsFixed(2)}'),
                        isThreeLine: true,
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              onPressed: () => app.setQty(i, item.quantity - 1),
                              icon: const Icon(Icons.remove),
                            ),
                            Text('${item.quantity}'),
                            IconButton(
                              onPressed: () => app.setQty(i, item.quantity + 1),
                              icon: const Icon(Icons.add),
                            ),
                            IconButton(
                              onPressed: () => app.removeFromCart(i),
                              icon: const Icon(Icons.delete_outline),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          'Total: \$${app.total.toStringAsFixed(2)}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const CheckoutScreen()),
                          ),
                          child: const Text('Checkout'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
