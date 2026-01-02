import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/product.dart';

class ProductService {
  final _client = Supabase.instance.client;

  Future<List<Product>> fetchProducts() async {
    final res = await _client.from('products').select().order('created_at', ascending: false);
    return (res as List).map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Product> createProduct(Product p) async {
    final res = await _client.from('products').insert(p.toInsertJson()).select().single();
    return Product.fromJson(res);
  }

  Future<Product> updateProduct(Product p) async {
    final res = await _client.from('products').update(p.toUpdateJson()).eq('id', p.id).select().single();
    return Product.fromJson(res);
  }

  Future<void> deleteProduct(String id) async {
    await _client.from('products').delete().eq('id', id);
  }

  Future<String> uploadProductImage({
    required String productId,
    required File file,
  }) async {
    final bytes = await file.readAsBytes();
    final path = '$productId/${DateTime.now().millisecondsSinceEpoch}.jpg';

    await _client.storage.from('product-images').uploadBinary(
          path,
          bytes,
          fileOptions: const FileOptions(upsert: true, contentType: 'image/jpeg'),
        );

    return _client.storage.from('product-images').getPublicUrl(path);
  }
}
