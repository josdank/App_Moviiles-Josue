import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';

class CheckoutScreen extends StatelessWidget {
  const CheckoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final addrController = TextEditingController(text: app.deliveryAddress);

    return Scaffold( // Scaffold
      appBar: AppBar(title: const Text('Checkout')), // AppBar
      body: Padding( // Padding
        padding: const EdgeInsets.all(16.0),
        child: Column( // Column
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Center(child: Text('Dirección de entrega')), // Center
            const SizedBox(height: 12), // SizedBox
            TextField( // TextField
              controller: addrController,
              maxLines: 2,
              decoration: const InputDecoration(
                hintText: 'Calle, número, referencia...',
                labelText: 'Dirección',
              ),
              onChanged: context.read<AppState>().setDeliveryAddress,
            ),
            const SizedBox(height: 12),
            Align( // Align
              alignment: Alignment.centerRight,
              child: Text(
                'Total a pagar: \$${app.total.toStringAsFixed(2)}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton( // ElevatedButton
              onPressed: app.cart.isEmpty || app.deliveryAddress.isEmpty
                  ? null
                  : () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Pedido realizado por \$${app.total.toStringAsFixed(2)}')),
                      );
                      Navigator.popUntil(context, ModalRoute.withName('/'));
                    },
              child: const Text('Confirmar pedido'),
            ),
            const SizedBox(height: 8),
            TextButton( // TextButton
              onPressed: () => Navigator.pop(context),
              child: const Text('Volver'),
            ),
          ],
        ),
      ),
    );
  }
}
