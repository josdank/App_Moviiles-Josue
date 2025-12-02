import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../models/cart_item.dart';

class AppState extends ChangeNotifier {
  final List<CartItem> _cart = [];
  String _searchQuery = '';
  String _deliveryAddress = '';
  String _selectedCategory = '';
  bool _showPopular = false;

  List<CartItem> get cart => List.unmodifiable(_cart);
  String get searchQuery => _searchQuery;
  String get deliveryAddress => _deliveryAddress;
  String get selectedCategory => _selectedCategory;
  bool get showPopular => _showPopular;

  void setSearchQuery(String q) {
    _searchQuery = q;
    notifyListeners();
  }

  void setDeliveryAddress(String address) {
    _deliveryAddress = address;
    notifyListeners();
  }

  void setCategoryFilter(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void togglePopular(bool value) {
    _showPopular = value;
    notifyListeners();
  }

  void addToCart(
    Product product, {
    int quantity = 1,
    String? size,
    Set<String>? extras,
    Set<String>? promos,
    bool combo = false,
  }) {
    // Para demo: items se agrupan por producto + size
    final existing = _cart.where((c) => c.product.id == product.id && c.selectedSize == size).toList();
    if (existing.isNotEmpty) {
      existing.first.quantity += quantity;
      existing.first.makeCombo = existing.first.makeCombo || combo;
      if (extras != null) existing.first.selectedExtras.addAll(extras);
      if (promos != null) existing.first.selectedPromos.addAll(promos);
    } else {
      _cart.add(CartItem(
        product: product,
        quantity: quantity,
        selectedSize: size,
        selectedExtras: extras ?? {},
        selectedPromos: promos ?? {},
        makeCombo: combo,
      ));
    }
    notifyListeners();
  }

  void updateQuantity(CartItem item, int qty) {
    item.quantity = qty.clamp(1, 99);
    notifyListeners();
  }

  void removeFromCart(CartItem item) {
    _cart.remove(item);
    notifyListeners();
  }

  double get total => _cart.fold(0, (sum, c) => sum + (c.product.price * c.quantity));
}
