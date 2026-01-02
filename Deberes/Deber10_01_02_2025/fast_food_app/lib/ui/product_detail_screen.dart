import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../state/app_state.dart';
import '../core/offer_service.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int qty = 1;

  String? selectedOfferTitle;
  double selectedOfferExtra = 0;
  double selectedDiscountPercent = 0;
  String? selectedFreeItem;

  List<Map<String, dynamic>> offers = [];
  bool loadingOffers = true;

  @override
  void initState() {
    super.initState();
    _loadOffers();
  }

  Future<void> _loadOffers() async {
    try {
      final today = DateTime.now().weekday; // 1..7
      final data = await OfferService().getOffersForProduct(widget.product.id, dayOfWeek: today);
      setState(() {
        offers = data;
        loadingOffers = false;
      });
    } catch (_) {
      setState(() => loadingOffers = false);
    }
  }

  double _toDouble(dynamic v) {
    if (v is num) return v.toDouble();
    return double.tryParse(v?.toString() ?? '') ?? 0;
  }

  int? _toInt(dynamic v) {
    if (v == null) return null;
    if (v is int) return v;
    return int.tryParse(v.toString());
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    final baseDiscounted = p.price * (1 - (selectedDiscountPercent.clamp(0, 100) / 100));
    final finalUnit = baseDiscounted + selectedOfferExtra;

    return Scaffold(
      appBar: AppBar(title: Text(p.name)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Container(
              height: 220,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: Colors.black12,
                image: p.imageUrl == null
                    ? null
                    : DecorationImage(image: NetworkImage(p.imageUrl!), fit: BoxFit.cover),
              ),
              child: p.imageUrl == null ? const Center(child: Icon(Icons.image, size: 48)) : null,
            ),
            const SizedBox(height: 12),
            Text(p.description),
            const SizedBox(height: 8),

            Text(
              'Precio: \$${p.price.toStringAsFixed(2)}',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),

            if (selectedDiscountPercent > 0)
              Text(
                'Con descuento: \$${baseDiscounted.toStringAsFixed(2)} (-${selectedDiscountPercent.toStringAsFixed(0)}%)',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),

            if (selectedOfferExtra != 0)
              Text(
                'Extra oferta: +\$${selectedOfferExtra.toStringAsFixed(2)}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),

            if (selectedFreeItem != null && selectedFreeItem!.trim().isNotEmpty)
              Text(
                'Incluye: ${selectedFreeItem!}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              ),

            const SizedBox(height: 16),
            const Text('Promos / Combos disponibles', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),

            if (loadingOffers) const LinearProgressIndicator(),
            if (!loadingOffers && offers.isEmpty) const Text('No hay ofertas para este producto hoy.'),

            ...offers.map((o) {
              final title = o['title'].toString();
              final extra = _toDouble(o['extra_price']);
              final details = (o['details'] ?? '').toString();
              final discount = _toDouble(o['discount_percent']);
              final day = _toInt(o['day_of_week']);
              final freeItem = (o['free_item'] ?? '').toString().trim();

              final selected = selectedOfferTitle == title;

              String subtitle = details;
              if (day != null) subtitle = '[Solo hoy] ${subtitle.isEmpty ? '' : subtitle}';
              if (discount > 0) subtitle = '${subtitle.isEmpty ? '' : '$subtitle\n'}Descuento: -${discount.toStringAsFixed(0)}%';
              if (freeItem.isNotEmpty) subtitle = '${subtitle.isEmpty ? '' : '$subtitle\n'}Regalo: $freeItem';

              final label = '$title'
                  '${discount > 0 ? ' (-${discount.toStringAsFixed(0)}%)' : ''}'
                  '${extra != 0 ? ' (+\$${extra.toStringAsFixed(2)})' : ''}';

              return RadioListTile<String>(
                title: Text(label),
                subtitle: subtitle.isEmpty ? null : Text(subtitle),
                value: title,
                groupValue: selectedOfferTitle,
                onChanged: (v) {
                  setState(() {
                    selectedOfferTitle = v;
                    selectedOfferExtra = extra;
                    selectedDiscountPercent = discount;
                    selectedFreeItem = freeItem.isEmpty ? null : freeItem;
                  });
                },
              );
            }),

            const Divider(height: 24),

            Row(
              children: [
                IconButton(
                  onPressed: () => setState(() => qty = (qty - 1).clamp(1, 99)),
                  icon: const Icon(Icons.remove),
                ),
                Text('$qty', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                IconButton(
                  onPressed: () => setState(() => qty = (qty + 1).clamp(1, 99)),
                  icon: const Icon(Icons.add),
                ),
                const Spacer(),
                ElevatedButton.icon(
                  onPressed: () {
                    context.read<AppState>().addToCart(
                          p,
                          qty: qty,
                          offerTitle: selectedOfferTitle,
                          offerExtra: selectedOfferExtra,
                          discountPercent: selectedDiscountPercent,
                          freeItem: selectedFreeItem,
                        );

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Agregado: \$${finalUnit.toStringAsFixed(2)} x$qty'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.shopping_cart),
                  label: const Text('Agregar'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
