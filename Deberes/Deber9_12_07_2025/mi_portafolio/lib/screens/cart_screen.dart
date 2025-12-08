import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/cart_item_tile.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Carrito'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep),
            tooltip: 'Vaciar carrito',
            onPressed: () => cart.clear(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: cart.items.isEmpty
                ? const _EmptyState()
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: cart.items.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) => CartItemTile(item: cart.items[i]),
                  ),
          ),
          _TotalsPanel(
            subtotal: cart.totals['subtotal'] ?? 0,
            discount: cart.totals['discount'] ?? 0,
            taxes: cart.totals['taxes'] ?? 0,
            total: cart.totals['total'] ?? 0,
          ),
        ],
      ),
    );
  }
}

class _TotalsPanel extends StatelessWidget {
  final double subtotal;
  final double discount;
  final double taxes;
  final double total;

  const _TotalsPanel({
    required this.subtotal,
    required this.discount,
    required this.taxes,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border(top: BorderSide(color: Colors.grey[300]!)),
      ),
      child: Column(
        children: [
          _row('Subtotal', subtotal),
          _row('Descuento', discount),
          _row('Impuestos', taxes),
          const Divider(),
          _row('Total', total, isBold: true),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Compra simulada realizada'),
                  backgroundColor: Colors.green[600],
                ),
              );
            },
            icon: const Icon(Icons.payment),
            label: const Text('Confirmar compra (mock)'),
          ),
        ],
      ),
    );
  }

  Widget _row(String label, double value, {bool isBold = false}) {
    final style = TextStyle(
      fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      fontSize: isBold ? 16 : 14,
    );
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: style),
          Text('\$${value.toStringAsFixed(2)}', style: style),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_cart_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 12),
            Text(
              'Tu carrito está vacío',
              style: TextStyle(color: Colors.grey[700], fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Agrega productos desde el catálogo.',
              style: TextStyle(color: Colors.grey[500]),
            ),
          ],
        ),
      ),
    );
  }
}
