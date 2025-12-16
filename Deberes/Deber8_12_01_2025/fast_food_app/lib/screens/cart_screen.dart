import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../widgets/quantity_stepper.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final items = app.cart;

    return Scaffold( // Scaffold
      appBar: AppBar(title: const Text('Carrito')), // AppBar
      body: Column( // Column
        children: [
          Expanded( // Expanded
            child: ListView.builder( // ListView
              itemCount: items.length,
              itemBuilder: (context, i) {
                final item = items[i];
                return Padding( // Padding
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Container( // Container
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                    ),
                    child: Row( // Row
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.asset(item.product.imageAsset, width: 64, height: 64, fit: BoxFit.cover),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column( // Column
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.product.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                              const SizedBox(height: 4),
                              Text('Extras: ${item.selectedExtras.isEmpty ? 'Ninguno' : item.selectedExtras.join(', ')}'),
                              if (item.selectedPromos.isNotEmpty)
                                Text('Promos: ${item.selectedPromos.join(', ')}'),
                              if (item.selectedSize != null) Text('Tamaño: ${item.selectedSize}'),
                              if (item.makeCombo) const Text('Combo activado'),
                              const SizedBox(height: 4),
                              Text('Precio unitario: \$${item.product.price.toStringAsFixed(2)}'),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        QuantityStepper(
                          quantity: item.quantity,
                          onChanged: (q) => context.read<AppState>().updateQuantity(item, q),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () => context.read<AppState>().removeFromCart(item),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container( // Container
            padding: const EdgeInsets.all(16),
            child: Column( // Column
              children: [
                Row(
                  children: [
                    const Expanded(child: Text('Total', style: TextStyle(fontWeight: FontWeight.bold))),
                    Text('\$${app.total.toStringAsFixed(2)}'),
                  ],
                ),
                const SizedBox(height: 12),
                ElevatedButton( // ElevatedButton
                  onPressed: items.isEmpty ? null : () => Navigator.pushNamed(context, '/checkout'),
                  child: const Text('Proceder al pago'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
