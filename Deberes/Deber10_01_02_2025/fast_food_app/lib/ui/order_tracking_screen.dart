import 'package:flutter/material.dart';
import '../core/order_service.dart';
import 'order_status_screen.dart';

class OrderTrackingScreen extends StatefulWidget {
  const OrderTrackingScreen({super.key});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  final service = OrderService();
  bool loading = true;
  List<Map<String, dynamic>> orders = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await service.getMyOrders();
    setState(() {
      orders = data;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mis pedidos')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (_, i) {
                final o = orders[i];
                return ListTile(
                  title: Text('Pedido ${o['id']}'),
                  subtitle: Text('Estado: ${o['status']}'),
                  trailing: Text('\$${(o['total'] as num).toDouble().toStringAsFixed(2)}'),
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => OrderStatusScreen(orderId: o['id'].toString())),
                  ),
                );
              },
            ),
    );
  }
}
