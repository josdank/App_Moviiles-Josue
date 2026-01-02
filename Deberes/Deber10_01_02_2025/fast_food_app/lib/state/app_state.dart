import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../core/product_service.dart';

class AppState extends ChangeNotifier {
  final productService = ProductService();

  List<Product> products = [];
  List<CartItem> cart = [];
  bool loading = false;
  String? error;

  String selectedCategory = 'Todos';
  String search = '';

  List<String> get categories {
    final set = <String>{'Todos'};
    for (final p in products) {
      if (p.category.trim().isNotEmpty) set.add(p.category.trim());
    }
    return set.toList();
  }

  List<Product> get filteredProducts {
    var list = products;

    if (selectedCategory != 'Todos') {
      list = list.where((p) => p.category == selectedCategory).toList();
    }

    if (search.trim().isNotEmpty) {
      final s = search.trim().toLowerCase();
      list = list.where((p) => p.name.toLowerCase().contains(s)).toList();
    }

    return list;
  }

  void setCategory(String c) {
    selectedCategory = c;
    notifyListeners();
  }

  void setSearch(String s) {
    search = s;
    notifyListeners();
  }

  Future<void> loadProducts() async {
    loading = true;
    error = null;
    notifyListeners();

    try {
      products = await productService.fetchProducts();
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<Product> createAndReturnProduct(Product p) async {
    final created = await productService.createProduct(p);
    products.insert(0, created);
    notifyListeners();
    return created;
  }

  Future<void> createProduct(Product p) async {
    final created = await productService.createProduct(p);
    products.insert(0, created);
    notifyListeners();
  }

  Future<void> updateProduct(Product p) async {
    final updated = await productService.updateProduct(p);
    final idx = products.indexWhere((x) => x.id == updated.id);
    if (idx != -1) products[idx] = updated;
    notifyListeners();
  }

  Future<void> deleteProduct(String id) async {
    await productService.deleteProduct(id);
    products.removeWhere((p) => p.id == id);
    notifyListeners();
  }

  void addToCart(
    Product p, {
    int qty = 1,
    String? offerTitle,
    double offerExtra = 0,
    double discountPercent = 0,
    String? freeItem,
  }) {
    final idx = cart.indexWhere((c) =>
        c.product.id == p.id &&
        c.selectedOfferTitle == offerTitle &&
        c.selectedOfferExtra == offerExtra &&
        c.selectedDiscountPercent == discountPercent &&
        c.selectedFreeItem == freeItem);

    if (idx != -1) {
      cart[idx].quantity += qty;
    } else {
      cart.add(
        CartItem(
          product: p,
          quantity: qty,
          selectedOfferTitle: offerTitle,
          selectedOfferExtra: offerExtra,
          selectedDiscountPercent: discountPercent,
          selectedFreeItem: freeItem,
        ),
      );
    }
    notifyListeners();
  }

  void setQty(int index, int qty) {
    if (index < 0 || index >= cart.length) return;
    cart[index].quantity = qty.clamp(1, 99);
    notifyListeners();
  }

  void removeFromCart(int index) {
    if (index < 0 || index >= cart.length) return;
    cart.removeAt(index);
    notifyListeners();
  }

  void clearCart() {
    cart.clear();
    notifyListeners();
  }

  double get total => cart.fold(0.0, (sum, it) => sum + it.total);
}
