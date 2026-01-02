import 'package:supabase_flutter/supabase_flutter.dart';

class OfferService {
  final _client = Supabase.instance.client;

  /// Devuelve ofertas activas del producto. Si dayOfWeek != null, filtra por día.
  Future<List<Map<String, dynamic>>> getOffersForProduct(
    String productId, {
    int? dayOfWeek,
  }) async {
    final q = _client
        .from('product_offers')
        .select()
        .eq('product_id', productId)
        .eq('is_active', true);

    final res = await q.order('created_at', ascending: false);
    final list = (res as List).cast<Map<String, dynamic>>();

    if (dayOfWeek == null) return list;

    // Mostrar las que son del día o las que no tienen día (válidas siempre)
    return list.where((o) {
      final d = o['day_of_week'];
      if (d == null) return true;
      return (d is int ? d : int.tryParse(d.toString())) == dayOfWeek;
    }).toList();
  }

  Future<void> createOffer({
    required String productId,
    required String type, // promo|combo|offer
    required String title,
    String? details,
    double extraPrice = 0,
    double discountPercent = 0,
    int? dayOfWeek, // 1..7 (Lunes..Domingo)
    String? freeItem, // ej: "Helado gratis"
  }) async {
    await _client.from('product_offers').insert({
      'product_id': productId,
      'type': type,
      'title': title,
      'details': details,
      'extra_price': extraPrice,
      'discount_percent': discountPercent,
      'day_of_week': dayOfWeek,
      'free_item': freeItem,
      'is_active': true,
    });
  }

  Future<void> toggleOfferActive(String offerId, bool active) async {
    await _client.from('product_offers').update({'is_active': active}).eq('id', offerId);
  }

  Future<void> deleteOffer(String offerId) async {
    await _client.from('product_offers').delete().eq('id', offerId);
  }
}
