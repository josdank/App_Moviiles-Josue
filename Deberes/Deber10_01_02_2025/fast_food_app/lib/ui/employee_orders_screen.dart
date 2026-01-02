import 'package:flutter/material.dart';
import '../core/order_service.dart';

class EmployeeOrdersScreen extends StatefulWidget {
  const EmployeeOrdersScreen({super.key});

  @override
  State<EmployeeOrdersScreen> createState() => _EmployeeOrdersScreenState();
}

class _EmployeeOrdersScreenState extends State<EmployeeOrdersScreen> {
  final service = OrderService();
  bool loading = true;
  List<Map<String, dynamic>> orders = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final data = await service.getAllOrdersEmployee();
    setState(() {
      orders = data;
      loading = false;
    });
  }

  Future<void> _setStatus(String orderId, String status) async {
    await service.updateOrderStatus(orderId, status);
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pedidos'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _load),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (_, i) {
                final o = orders[i];
                final id = o['id'].toString();
                return Card(
                  margin: const EdgeInsets.all(10),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Pedido: $id', style: const TextStyle(fontWeight: FontWeight.bold)),
                        Text('Cliente: ${o['customer_name']}'),
                        Text('Dirección: ${o['customer_address']}'),
                        Text('Teléfono: ${o['customer_phone']}'),
                        Text('Correo: ${o['customer_email']}'),
                        const SizedBox(height: 8),
                        Text('Estado actual: ${o['status']}'),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          children: [
                            ElevatedButton(
                              onPressed: () => _setStatus(id, 'preparing'),
                              child: const Text('Preparando'),
                            ),
                            ElevatedButton(
                              onPressed: () => _setStatus(id, 'on_the_way'),
                              child: const Text('En camino'),
                            ),
                            ElevatedButton(
                              onPressed: () => _setStatus(id, 'delivered'),
                              child: const Text('Entregado'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
