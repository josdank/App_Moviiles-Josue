import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final _auth = Supabase.instance.client.auth;

  Future<AuthResponse> login(String email, String password) {
    return _auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> register(String email, String password) {
    return _auth.signUp(
      email: email,
      password: password,
    );
  }

  Future<void> resetPassword(String email) {
    return _auth.resetPasswordForEmail(email);
  }

  Future<void> changePassword(String newPassword) {
    return _auth.updateUser(
      UserAttributes(password: newPassword),
    );
  }

  Future<void> logout() {
    return _auth.signOut();
  }
}
