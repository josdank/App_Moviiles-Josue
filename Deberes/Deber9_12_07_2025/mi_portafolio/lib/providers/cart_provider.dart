import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/cart_service.dart';

class CartProvider extends ChangeNotifier {
  final CartService _service = CartService();

  List get items => _service.items;
  Map<String, double> get totals => _service.calculateTotals();

  Future<void> add(Product product, int quantity, BuildContext context) async {
    try {
      await _service.addProduct(product, quantity);
      notifyListeners();
      _showInfo(context, 'Producto agregado: ${product.name} x$quantity');
    } catch (e) {
      _showError(context, e.toString());
    }
  }

  Future<void> remove(Product product, BuildContext context) async {
    try {
      await _service.removeProduct(product);
      notifyListeners();
      _showInfo(context, 'Producto removido: ${product.name}');
    } catch (e) {
      _showError(context, e.toString());
    }
  }

  Future<void> update(Product product, int qty, BuildContext context) async {
    try {
      await _service.updateQuantity(product, qty);
      notifyListeners();
      _showInfo(context, 'Cantidad actualizada: ${product.name} x$qty');
    } catch (e) {
      _showError(context, e.toString());
    }
  }

  Future<void> clear(BuildContext context) async {
    try {
      await _service.clearCart();
      notifyListeners();
      _showInfo(context, 'Carrito vaciado');
    } catch (e) {
      _showError(context, e.toString());
    }
  }

  void _showError(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: Colors.red[600],
        duration: const Duration(seconds: 3),
        action: SnackBarAction(
          label: 'Reintentar',
          textColor: Colors.white,
          onPressed: () {},
        ),
      ),
    );
  }

  void _showInfo(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: Colors.pink[400],
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
