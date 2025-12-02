import 'package:flutter/material.dart';

class QuantityStepper extends StatelessWidget {
  final int quantity;
  final ValueChanged<int> onChanged;

  const QuantityStepper({super.key, required this.quantity, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row( // Row
      mainAxisSize: MainAxisSize.min,
      children: [
        OutlinedButton( // OutlinedButton
          onPressed: () => onChanged(quantity - 1),
          child: const Text('-'),
        ),
        const SizedBox(width: 8), // SizedBox
        Text('$quantity'),
        const SizedBox(width: 8),
        OutlinedButton(
          onPressed: () => onChanged(quantity + 1),
          child: const Text('+'),
        ),
      ],
    );
  }
}
