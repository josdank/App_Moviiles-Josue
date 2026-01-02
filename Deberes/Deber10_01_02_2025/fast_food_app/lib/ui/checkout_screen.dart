import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../state/app_state.dart';
import '../core/order_service.dart';
import 'order_status_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final name = TextEditingController();
  final phone = TextEditingController();
  final address = TextEditingController();
  bool loading = false;

  @override
  void dispose() {
    name.dispose();
    phone.dispose();
    address.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    final app = context.read<AppState>();
    final email = Supabase.instance.client.auth.currentUser?.email ?? '';

    if (name.text.trim().isEmpty || phone.text.trim().isEmpty || address.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Complete nombre, teléfono y dirección.')),
      );
      return;
    }

    if (app.cart.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Carrito vacío.')));
      return;
    }

    setState(() => loading = true);
    try {
      final result = await OrderService().createOrder(
        name: name.text.trim(),
        phone: phone.text.trim(),
        address: address.text.trim(),
        email: email,
        cart: app.cart,
        total: app.total,
      );

      final orderId = result['id']!;
      final ref = result['reference']!;

      app.clearCart();

      if (!mounted) return;

      await showDialog(
        context: context,
        builder: (dialogCtx) => AlertDialog(
          title: const Text('Pedido confirmado'),
          content: Text('Pedido registrado.\n\nCódigo de referencia: $ref'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(dialogCtx), child: const Text('OK')),
          ],
        ),
      );

      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => OrderStatusScreen(orderId: orderId)),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final email = Supabase.instance.client.auth.currentUser?.email ?? '';
    final app = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Text('Correo: $email', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextField(controller: name, decoration: const InputDecoration(labelText: 'Nombre')),
            const SizedBox(height: 12),
            TextField(
              controller: phone,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(labelText: 'Teléfono'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: address,
              decoration: const InputDecoration(labelText: 'Dirección'),
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            Text('Total: \$${app.total.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: loading ? null : _placeOrder,
                child: loading ? const CircularProgressIndicator() : const Text('Confirmar pedido'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
