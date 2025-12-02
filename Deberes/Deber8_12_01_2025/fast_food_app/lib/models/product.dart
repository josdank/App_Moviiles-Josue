class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageAsset;
  final String category;
  final bool isPopular;
  final List<String> extras;      // Para checkbox
  final List<String> promotions;  // Para checkbox

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageAsset,
    required this.category,
    this.isPopular = false,
    this.extras = const [],
    this.promotions = const [],
  });
}

final demoProducts = <Product>[
  // Hamburguesas
  Product(
    id: 'b1',
    name: 'Doble Hamburguesa',
    description: 'Dos carnes, doble queso, lechuga y salsa especial.',
    price: 6.99,
    imageAsset: 'assets/images/burger.jpg',
    category: 'Hamburguesas',
    isPopular: true,
    extras: ['Extra Queso', 'Tocino', 'Sin Salsa'],
    promotions: ['Combo clásico', '2x1 martes'],
  ),
  Product(
    id: 'b2',
    name: 'Hamburguesa Clásica',
    description: 'Carne, queso, lechuga, tomate.',
    price: 4.99,
    imageAsset: 'assets/images/burger.jpg',
    category: 'Hamburguesas',
    extras: ['Pan integral', 'Tocino'],
    promotions: ['Combo clásico'],
  ),

  // Acompañantes
  Product(
    id: 's1',
    name: 'Papas Fritas Grandes',
    description: 'Crocantes y doradas.',
    price: 2.99,
    imageAsset: 'assets/images/fries.jpg',
    category: 'Acompañantes',
    isPopular: true,
    extras: ['Salsa BBQ', 'Salsa Picante'],
    promotions: ['2x1 miércoles'],
  ),
  Product(
    id: 's2',
    name: 'Papas Fritas Medianas',
    description: 'Clásicas.',
    price: 2.49,
    imageAsset: 'assets/images/fries.jpg',
    category: 'Acompañantes',
    extras: ['Salsa Ketchup'],
    promotions: const [],
  ),

  // Pollo
  Product(
    id: 'c1',
    name: 'Pollo Crispy',
    description: 'Crujiente y jugoso.',
    price: 5.99,
    imageAsset: 'assets/images/chicken.jpg',
    category: 'Pollo',
    extras: ['Picante', 'BBQ'],
    promotions: ['Combo pollo'],
  ),
  Product(
    id: 'c2',
    name: 'Alitas BBQ',
    description: '6 unidades con salsa BBQ.',
    price: 4.49,
    imageAsset: 'assets/images/chicken.jpg',
    category: 'Pollo',
    promotions: ['Alitas + bebida'],
  ),

  // Bebidas
  Product(
    id: 'd1',
    name: 'Refresco Grande',
    description: 'Bebida fría.',
    price: 1.99,
    imageAsset: 'assets/images/drink.jpg',
    category: 'Bebidas',
    isPopular: false,
    extras: ['Hielo extra', 'Poco hielo'],
    promotions: ['Refresco + papas'],
  ),
  Product(
    id: 'd2',
    name: 'Limonada',
    description: 'Fresca y natural.',
    price: 1.79,
    imageAsset: 'assets/images/drink.jpg',
    category: 'Bebidas',
    promotions: const [],
  ),
];
