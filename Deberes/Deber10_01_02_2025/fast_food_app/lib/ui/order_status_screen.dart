import 'package:flutter/material.dart';
import '../core/order_service.dart';

class OrderStatusScreen extends StatefulWidget {
  final String orderId;
  const OrderStatusScreen({super.key, required this.orderId});

  @override
  State<OrderStatusScreen> createState() => _OrderStatusScreenState();
}

class _OrderStatusScreenState extends State<OrderStatusScreen> {
  final service = OrderService();
  Map<String, dynamic>? order;
  List<Map<String, dynamic>> items = [];
  dynamic channel;

  @override
  void initState() {
    super.initState();
    _load();
    channel = service.subscribeOrder(widget.orderId, (newRow) {
      setState(() => order = newRow);
    });
  }

  Future<void> _load() async {
    final my = await service.getMyOrders();
    order = my.firstWhere((o) => o['id'].toString() == widget.orderId, orElse: () => {});
    items = await service.getOrderItems(widget.orderId);
    setState(() {});
  }

  @override
  void dispose() {
    if (channel != null) {
      // ignore: avoid_dynamic_calls
      channel.unsubscribe();
    }
    super.dispose();
  }

  String statusText(String? s) {
    switch (s) {
      case 'pending':
        return 'Pedido recibido';
      case 'preparing':
        return 'Preparando';
      case 'on_the_way':
        return 'En camino';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  }

  @override
  Widget build(BuildContext context) {
    final o = order;
    if (o == null) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      appBar: AppBar(title: const Text('Pedido en camino')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Text('Código: ${widget.orderId}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('Estado: ${statusText(o['status']?.toString())}', style: const TextStyle(fontSize: 16)),
            const Divider(height: 24),

            Text('Cliente: ${o['customer_name'] ?? ''}'),
            Text('Dirección: ${o['customer_address'] ?? ''}'),
            Text('Teléfono: ${o['customer_phone'] ?? ''}'),
            Text('Correo: ${o['customer_email'] ?? ''}'),

            const Divider(height: 24),
            const Text('Detalle del pedido', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ...items.map((it) => ListTile(
                  title: Text('${it['product_name']} x${it['quantity']}'),
                  subtitle: Text('Oferta: ${it['selected_offer_title'] ?? 'Ninguna'}'),
                  trailing: Text('\$${(it['unit_price'] as num).toDouble().toStringAsFixed(2)}'),
                )),
          ],
        ),
      ),
    );
  }
}
