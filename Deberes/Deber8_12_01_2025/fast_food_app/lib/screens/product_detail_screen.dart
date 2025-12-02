import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../state/app_state.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  bool makeCombo = false;
  String? selectedSize;
  final Set<String> selectedExtras = {};
  int qty = 1;

  @override
  Widget build(BuildContext context) {
    final p = widget.product;

    return Scaffold( // Scaffold
      appBar: AppBar(title: Text(p.name)), // AppBar
      body: ListView( // ListView
        padding: const EdgeInsets.all(16),
        children: [
          Container( // Container
            height: 220,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(16)),
            child: Image.asset(p.imageAsset, fit: BoxFit.cover),
          ),
          const SizedBox(height: 16), // SizedBox
          Row( // Row
            children: [
              Expanded(child: Text(p.description)),
              const SizedBox(width: 8),
              Align( // Align
                alignment: Alignment.centerRight,
                child: Text('\$${p.price.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SwitchListTile( // Switch
            title: const Text('Hacer combo'),
            value: makeCombo,
            onChanged: (v) => setState(() => makeCombo = v),
          ),
          const SizedBox(height: 8),
          const Text('Tamaño / opción principal'),
          Column( // Column
            children: [
              RadioListTile<String>( // Radio
                title: const Text('Mediano'),
                value: 'Mediano',
                groupValue: selectedSize,
                onChanged: (v) => setState(() => selectedSize = v),
              ),
              RadioListTile<String>(
                title: const Text('Grande'),
                value: 'Grande',
                groupValue: selectedSize,
                onChanged: (v) => setState(() => selectedSize = v),
              ),
            ],
          ),
          const Text('Extras'),
          Column( // Column
            children: [
              for (final extra in p.extras)
                CheckboxListTile( // Checkbox
                  title: Text(extra),
                  value: selectedExtras.contains(extra),
                  onChanged: (v) => setState(() {
                    if (v == true) {
                      selectedExtras.add(extra);
                    } else {
                      selectedExtras.remove(extra);
                    }
                  }),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Cantidad'),
              Row(
                children: [
                  OutlinedButton(onPressed: () => setState(() => qty = (qty - 1).clamp(1, 99)), child: const Text('-')),
                  const SizedBox(width: 8),
                  Text('$qty'),
                  const SizedBox(width: 8),
                  OutlinedButton(onPressed: () => setState(() => qty = (qty + 1).clamp(1, 99)), child: const Text('+')),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          ElevatedButton( // ElevatedButton
            onPressed: () {
              context.read<AppState>().addToCart(
                p,
                quantity: qty,
                size: selectedSize,
                extras: selectedExtras,
                combo: makeCombo,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Añadido: ${p.name} x$qty')),
              );
              Navigator.pop(context);
            },
            child: const Text('Añadir al carrito'),
          ),
        ],
      ),
    );
  }
}
