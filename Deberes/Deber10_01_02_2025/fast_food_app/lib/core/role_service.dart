import 'package:supabase_flutter/supabase_flutter.dart';

class RoleService {
  final _client = Supabase.instance.client;

  Future<String> getMyRole() async {
    final uid = _client.auth.currentUser?.id;
    if (uid == null) return 'user';

    final row = await _client.from('profiles').select('role').eq('id', uid).maybeSingle();
    return (row?['role']?.toString() ?? 'user');
  }
}
