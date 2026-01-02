import 'dart:async';

import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/supabase_config.dart';
import 'core/theme.dart';
import 'core/role_service.dart';
import 'state/app_state.dart';

import 'auth/login_screen.dart';
import 'auth/change_password_screen.dart';

import 'ui/user_home_screen.dart';
import 'ui/employee_home_screen.dart';

final GlobalKey<NavigatorState> navKey = GlobalKey<NavigatorState>();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: ".env");
  await SupabaseConfig.init();

  runApp(
    ChangeNotifierProvider(
      create: (_) => AppState()..loadProducts(),
      child: const FastFoodApp(),
    ),
  );
}

class FastFoodApp extends StatefulWidget {
  const FastFoodApp({super.key});

  @override
  State<FastFoodApp> createState() => _FastFoodAppState();
}

class _FastFoodAppState extends State<FastFoodApp> {
  final _appLinks = AppLinks();
  StreamSubscription<Uri>? _linkSub;

  Uri? _lastHandled;
  DateTime? _lastHandledAt;

  @override
  void initState() {
    super.initState();
    _setupDeepLinks();
  }

  Future<void> _setupDeepLinks() async {
    // Link inicial
    try {
      final initial = await _appLinks.getInitialLink();
      if (initial != null) _handleUri(initial);
    } catch (_) {}

    // Links mientras corre
    _linkSub = _appLinks.uriLinkStream.listen((uri) {
      _handleUri(uri);
    }, onError: (_) {});
  }

  void _handleUri(Uri uri) {
    // Evitar doble disparo (getInitialLink + stream)
    final now = DateTime.now();
    if (_lastHandled == uri &&
        _lastHandledAt != null &&
        now.difference(_lastHandledAt!).inSeconds < 2) {
      return;
    }
    _lastHandled = uri;
    _lastHandledAt = now;

    // Ej: fastfoodapp://auth-callback?type=recovery
    if (uri.scheme == 'fastfoodapp' && uri.host == 'auth-callback') {
      final type = (uri.queryParameters['type'] ?? '').toLowerCase();

      // Para recovery/reset, abrir pantalla de cambiar contraseña dentro de la app
      if (type.isEmpty || type == 'recovery' || type == 'reset') {
        navKey.currentState?.push(
          MaterialPageRoute(builder: (_) => const ChangePasswordScreen()),
        );
      }
    }
  }

  @override
  void dispose() {
    _linkSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // IMPORTANTÍSIMO:
    // La navegación (login/logout) NO debe hacer push a FastFoodApp.
    // Este StreamBuilder cambia de pantalla automáticamente según el estado de Auth.
    return StreamBuilder<AuthState>(
      stream: Supabase.instance.client.auth.onAuthStateChange,
      builder: (context, snap) {
        final session = Supabase.instance.client.auth.currentSession;

        return MaterialApp(
          navigatorKey: navKey,
          debugShowCheckedModeBanner: false,
          theme: buildTheme(),
          localizationsDelegates: const [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [Locale('es')],
          home: session == null ? const LoginScreen() : const _RoleRouter(),
        );
      },
    );
  }
}

class _RoleRouter extends StatefulWidget {
  const _RoleRouter();

  @override
  State<_RoleRouter> createState() => _RoleRouterState();
}

class _RoleRouterState extends State<_RoleRouter> {
  String? role;
  String? err;

  @override
  void initState() {
    super.initState();
    _loadRole();
  }

  Future<void> _loadRole() async {
    try {
      final r = await RoleService().getMyRole();
      if (!mounted) return;
      setState(() => role = r);
    } catch (e) {
      if (!mounted) return;
      setState(() => err = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    if (err != null) {
      return Scaffold(body: Center(child: Text('Error rol: $err')));
    }
    if (role == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return role == 'employee'
        ? const EmployeeHomeScreen()
        : const UserHomeScreen();
  }
}
