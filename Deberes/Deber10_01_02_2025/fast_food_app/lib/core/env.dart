import 'package:flutter_dotenv/flutter_dotenv.dart';

class Env {
  static String get supabaseUrl => dotenv.env['SUPABASE_URL'] ?? '';
  static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  static String get resetApiUrl => dotenv.env['RESET_API_URL'] ?? '';

  static void validate() {
    if (supabaseUrl.trim().isEmpty || supabaseAnonKey.trim().isEmpty) {
      throw Exception('Faltan SUPABASE_URL o SUPABASE_ANON_KEY en .env');
    }
  }
}
