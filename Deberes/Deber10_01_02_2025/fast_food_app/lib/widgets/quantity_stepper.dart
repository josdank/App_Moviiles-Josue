import 'package:flutter/material.dart';

class QuantityStepper extends StatelessWidget {
  final int value;
  final ValueChanged<int> onChanged;
  const QuantityStepper({super.key, required this.value, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton(
          onPressed: () => onChanged((value - 1).clamp(1, 99)),
          icon: const Icon(Icons.remove_circle_outline),
        ),
        Text('$value', style: const TextStyle(fontWeight: FontWeight.bold)),
        IconButton(
          onPressed: () => onChanged((value + 1).clamp(1, 99)),
          icon: const Icon(Icons.add_circle_outline),
        ),
      ],
    );
  }
}
