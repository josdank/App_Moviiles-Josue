import 'product.dart';

class CartItem {
  final Product product;
  int quantity;

  // Oferta/Combo seleccionado
  String? selectedOfferTitle;
  double selectedOfferExtra;

  /// Descuento porcentual (0-100) aplicado al precio base del producto.
  double selectedDiscountPercent;

  /// Texto opcional de regalo (ej: "Helado gratis"). No afecta el total.
  String? selectedFreeItem;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedOfferTitle,
    this.selectedOfferExtra = 0,
    this.selectedDiscountPercent = 0,
    this.selectedFreeItem,
  });

  double get unitPriceAfterDiscount {
    final d = selectedDiscountPercent.clamp(0, 100);
    return product.price * (1 - (d / 100));
  }

  double get unitPriceFinal => unitPriceAfterDiscount + selectedOfferExtra;

  double get total => unitPriceFinal * quantity;
}
