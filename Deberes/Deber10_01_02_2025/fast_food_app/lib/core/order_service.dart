import 'dart:math';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/cart_item.dart';

class OrderService {
  final SupabaseClient _client = Supabase.instance.client;

  String _makeRefCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    final r = Random.secure();
    final part = List.generate(6, (_) => chars[r.nextInt(chars.length)]).join();
    return 'FF-$part';
  }

  /// Retorna: { id: uuid, reference: FF-XXXXXX }
  Future<Map<String, String>> createOrder({
    required String name,
    required String phone,
    required String address,
    required String email,
    required List<CartItem> cart,
    required double total,
  }) async {
    final uid = _client.auth.currentUser?.id;
    if (uid == null) throw Exception('No hay sesión activa');

    // Reintento por si reference_code choca (muy raro)
    Map<String, dynamic>? order;
    String ref = '';

    for (var i = 0; i < 5; i++) {
      ref = _makeRefCode();
      try {
        order = await _client
            .from('orders')
            .insert({
              'user_id': uid,
              'customer_name': name,
              'customer_phone': phone,
              'customer_address': address,
              'customer_email': email,
              'status': 'pending',
              'total': total,
              'reference_code': ref,
            })
            .select()
            .single();
        break;
      } catch (_) {
        if (i == 4) rethrow;
      }
    }

    final orderId = order!['id'].toString();

    final items = cart.map((c) {
      return {
        'order_id': orderId,
        'product_id': c.product.id,
        'product_name': c.product.name,
        'unit_price': c.product.price,
        'quantity': c.quantity,
        'selected_offer_title': c.selectedOfferTitle,
        'selected_offer_extra': c.selectedOfferExtra,
        // guardar info útil en texto (si quieres verlo luego)
        'selected_offer_title': c.selectedOfferTitle,
        'selected_offer_extra': c.selectedOfferExtra,
      };
    }).toList();

    if (items.isNotEmpty) {
      await _client.from('order_items').insert(items);
    }

    return {'id': orderId, 'reference': ref};
  }

  Future<List<Map<String, dynamic>>> getMyOrders() async {
    final uid = _client.auth.currentUser?.id;
    if (uid == null) return [];

    final res = await _client
        .from('orders')
        .select()
        .eq('user_id', uid)
        .order('created_at', ascending: false);

    return (res as List).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getAllOrdersEmployee() async {
    final res = await _client.from('orders').select().order('created_at', ascending: false);
    return (res as List).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getOrderItems(String orderId) async {
    final res = await _client.from('order_items').select().eq('order_id', orderId);
    return (res as List).cast<Map<String, dynamic>>();
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    await _client.from('orders').update({'status': status}).eq('id', orderId);
  }

  RealtimeChannel subscribeOrder(
    String orderId,
    void Function(Map<String, dynamic> newRow) onUpdate,
  ) {
    final channel = _client.channel('order-$orderId');

    channel.onPostgresChanges(
      event: PostgresChangeEvent.update,
      schema: 'public',
      table: 'orders',
      filter: PostgresChangeFilter(
        type: PostgresChangeFilterType.eq,
        column: 'id',
        value: orderId,
      ),
      callback: (payload) {
        final newRow = (payload.newRecord ?? {}) as Map<String, dynamic>;
        onUpdate(newRow);
      },
    );

    channel.subscribe();
    return channel;
  }
}
