class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String? imageUrl;
  final String category;
  final bool isAvailable;

  const Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    this.imageUrl,
    this.isAvailable = true,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    double toD(dynamic v) => (v is num) ? v.toDouble() : double.tryParse(v.toString()) ?? 0;

    return Product(
      id: json['id'].toString(),
      name: (json['name'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      price: toD(json['price']),
      imageUrl: json['image_url']?.toString(),
      category: (json['category'] ?? '').toString(),
      isAvailable: (json['is_available'] ?? true) as bool,
    );
  }

  Map<String, dynamic> toInsertJson() => {
        'name': name,
        'description': description,
        'price': price,
        'image_url': imageUrl,
        'category': category,
        'is_available': isAvailable,
      };

  Map<String, dynamic> toUpdateJson() => toInsertJson();

  Product copyWith({
    String? name,
    String? description,
    double? price,
    String? imageUrl,
    String? category,
    bool? isAvailable,
  }) {
    return Product(
      id: id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      imageUrl: imageUrl ?? this.imageUrl,
      category: category ?? this.category,
      isAvailable: isAvailable ?? this.isAvailable,
    );
  }
}
