import 'package:supabase_flutter/supabase_flutter.dart';

class ProductService {
  final _client = Supabase.instance.client;

  Future<List<dynamic>> getProducts() async {
    return await _client.from('products').select();
  }

  Future<void> addProduct(Map<String, dynamic> product) async {
    await _client.from('products').insert(product);
  }

  Future<void> updateProduct(String id, Map<String, dynamic> product) async {
    await _client.from('products').update(product).eq('id', id);
  }

  Future<void> deleteProduct(String id) async {
    await _client.from('products').delete().eq('id', id);
  }
}
