import 'package:flutter/material.dart';
import 'auth_service.dart';

class ForgotPasswordScreen extends StatefulWidget {
  final String? prefillEmail;
  const ForgotPasswordScreen({super.key, this.prefillEmail});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  late final TextEditingController email;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    email = TextEditingController(text: widget.prefillEmail ?? '');
  }

  @override
  void dispose() {
    email.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final mail = email.text.trim();
    if (mail.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Escriba el correo')));
      return;
    }

    setState(() => loading = true);
    try {
      // ✅ Supabase manda email y abre tu Vercel /reset
      await AuthService().resetViaSupabase(
        mail,
        redirectTo: 'https://web-reset-password-0fot.onrender.com/reset-password',
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Se envió el enlace al correo.')));
      Navigator.pop(context);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Recuperar contraseña')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Se enviará un enlace para cambiar la contraseña.'),
                const SizedBox(height: 12),
                TextField(controller: email, decoration: const InputDecoration(labelText: 'Correo')),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: loading ? null : _send,
                    child: loading ? const CircularProgressIndicator() : const Text('Enviar enlace'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
