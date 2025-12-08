import 'dart:async';
import 'dart:math';
import '../models/product.dart';
import '../models/cart_item.dart';

class CartService {
  final List<CartItem> _items = [];
  final Random _random = Random();

  List<CartItem> get items => List.unmodifiable(_items);

  Future<void> addProduct(Product product, int quantity) async {
    await _simulateDelay();
    _simulateRandomError();

    if (quantity < 1) {
      throw Exception('Cantidad inválida');
    }

    final index = _items.indexWhere((i) => i.product.id == product.id);
    if (index >= 0) {
      final existing = _items[index];
      final newQty = existing.quantity + quantity;
      if (newQty > 10) {
        throw Exception('Stock insuficiente');
      }
      existing.quantity = newQty;
    } else {
      if (quantity > 10) {
        throw Exception('Stock insuficiente');
      }
      _items.add(CartItem(product: product, quantity: quantity));
    }
  }

  Future<void> removeProduct(Product product) async {
    await _simulateDelay();
    _simulateRandomError();
    _items.removeWhere((i) => i.product.id == product.id);
  }

  Future<void> updateQuantity(Product product, int newQuantity) async {
    await _simulateDelay();
    _simulateRandomError();

    if (newQuantity < 1) {
      throw Exception('Cantidad inválida');
    }
    if (newQuantity > 10) {
      throw Exception('Stock insuficiente');
    }

    final index = _items.indexWhere((i) => i.product.id == product.id);
    if (index == -1) {
      throw Exception('Producto no está en el carrito');
    }
    _items[index].quantity = newQuantity;
  }

  Future<void> clearCart() async {
    await _simulateDelay();
    _simulateRandomError();
    _items.clear();
  }

  Map<String, double> calculateTotals() {
    final subtotal = _items.fold<double>(
      0,
      (sum, item) => sum + item.product.price * item.quantity,
    );
    final discount = subtotal > 100 ? subtotal * 0.10 : 0.0;
    final taxes = subtotal * 0.12;
    final total = subtotal - discount + taxes;
    return {
      'subtotal': subtotal,
      'discount': discount,
      'taxes': taxes,
      'total': total,
    };
  }

  Future<void> _simulateDelay() async {
    final seconds = 1 + _random.nextInt(2);
    await Future.delayed(Duration(seconds: seconds));
  }

  void _simulateRandomError() {
    final p = _random.nextDouble();
    if (p < 0.2) {
      final errors = [
        'Error de conexión',
        'Producto no disponible',
        'Sesión expirada',
      ];
      throw Exception(errors[_random.nextInt(errors.length)]);
    }
  }
}
