import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/env.dart';

class AuthService {
  final _auth = Supabase.instance.client.auth;

  Future<AuthResponse> login(String email, String password) {
    return _auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> registerUser(String email, String password) {
    return _auth.signUp(email: email, password: password);
  }

  // ✅ RESET 1: Supabase directo (necesita Redirect URLs en Supabase)
  Future<void> resetViaSupabase(String email, {required String redirectTo}) {
    return _auth.resetPasswordForEmail(email, redirectTo: redirectTo);
  }

  // ✅ RESET 2: tu Vercel (si tienes /api/reset-password)
  Future<void> resetViaVercel(String email) async {
    final base = Env.resetApiUrl.trim();
    if (base.isEmpty) throw Exception('RESET_API_URL no configurado');

    final uri = Uri.parse(base.endsWith('/') ? '${base}api/reset-password' : '$base/api/reset-password');
    final res = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );

    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw Exception('Reset error ${res.statusCode}: ${res.body}');
    }
  }

  Future<void> changePassword(String newPassword) {
    return _auth.updateUser(UserAttributes(password: newPassword));
  }

  Future<void> logout() => _auth.signOut();
}
