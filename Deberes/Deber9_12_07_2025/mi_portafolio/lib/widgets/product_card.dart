import 'package:flutter/material.dart';
import '../models/product.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback onAddOne;
  final VoidCallback onAddMany;

  const ProductCard({
    super.key,
    required this.product,
    required this.onAddOne,
    required this.onAddMany,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: Colors.pink[70],
            child: Icon(Icons.inventory_2, color: Colors.pink[700]),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text('\$${product.price.toStringAsFixed(2)}',
                    style: TextStyle(color: Colors.grey[700])),
                const SizedBox(height: 6),
                Text(
                  'Stock mock: 10 unidades',
                  style: TextStyle(color: Colors.grey[500], fontSize: 12),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          TextButton.icon(
            onPressed: onAddOne,
            icon: const Icon(Icons.add_circle_outline),
            label: const Text('Agregar 1'),
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            onPressed: onAddMany,
            icon: const Icon(Icons.add_shopping_cart),
            label: const Text('Agregar 2'),
          ),
        ],
      ),
    );
  }
}
