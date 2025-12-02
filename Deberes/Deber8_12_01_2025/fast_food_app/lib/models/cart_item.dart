import 'product.dart';

class CartItem {
  final Product product;
  int quantity;
  String? selectedSize;            // Radio (si quisieras tamaño)
  final Set<String> selectedExtras; // Checkbox
  final Set<String> selectedPromos; // Promociones seleccionadas
  bool makeCombo;                   // Switch

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedSize,
    Set<String>? selectedExtras,
    Set<String>? selectedPromos,
    this.makeCombo = false,
  })  : selectedExtras = selectedExtras ?? <String>{},
        selectedPromos = selectedPromos ?? <String>{};
}
