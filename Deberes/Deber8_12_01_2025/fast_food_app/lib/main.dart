import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/theme.dart';
import 'core/supabase_config.dart';
import 'state/app_state.dart';

import 'auth/login_screen.dart';

import 'screens/home_screen.dart';
import 'screens/menu_screen.dart';
import 'screens/product_detail_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/checkout_screen.dart';

import 'models/product.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 🔐 Inicializa Supabase
  await SupabaseConfig.init();

  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState(),
      child: const FastFoodApp(),
    ),
  );
}

class FastFoodApp extends StatelessWidget {
  const FastFoodApp({super.key});

  @override
  Widget build(BuildContext context) {
    final session = Supabase.instance.client.auth.currentSession;

    return MaterialApp(
      title: 'Comida Rápida',
      theme: buildTheme(),
      debugShowCheckedModeBanner: false,

      // 🌎 Localización
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('es', 'EC'),
        Locale('es'),
      ],

      // 🧭 Pantalla inicial según sesión
      initialRoute: session == null ? '/login' : '/',

      routes: {
        '/login': (_) => const LoginScreen(),
        '/': (_) => const HomeScreen(),
        '/menu': (_) => const MenuScreen(),
        '/cart': (_) => const CartScreen(),
        '/checkout': (_) => const CheckoutScreen(),
      },

      // 📦 Detalle de producto
      onGenerateRoute: (settings) {
        if (settings.name == '/product') {
          final product = settings.arguments as Product;
          return MaterialPageRoute(
            builder: (_) => ProductDetailScreen(product: product),
          );
        }
        return null;
      },
    );
  }
}
