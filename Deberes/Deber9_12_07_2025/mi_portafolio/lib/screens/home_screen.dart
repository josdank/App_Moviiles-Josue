import 'package:flutter/material.dart';
import '../widgets/proyecto_card.dart';
import '../widgets/proyecto_expandible.dart';
import '../widgets/proyecto_card_mini.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final proyectos = [
      ProyectoData(
        titulo: 'Sistema de Biblioteca',
        descripcion:
            'Aplicación web para gestionar préstamos de libros, registro de usuarios y catálogo digital. Incluye panel administrativo y reportes.',
        tecnologias: ['Flutter', 'Firebase', 'Cloud Firestore'],
        estado: 'Completado',
        fechaTexto: 'Enero 2024',
        progreso: 1.0,
        imagenUrl: 'https://picsum.photos/seed/lib/800/400',
        urlCodigo: 'https://github.com/tu_usuario/sistema_biblioteca',
        urlDemo: 'https://tu-demo.com/biblioteca',
      ),
      ProyectoData(
        titulo: 'App de Tareas',
        descripcion:
            'Gestión de tareas diarias con recordatorios, categorías y modo offline. Interfaz limpia y accesible.',
        tecnologias: ['Flutter', 'SQLite'],
        estado: 'En desarrollo',
        fechaTexto: 'Marzo 2024',
        progreso: 0.7,
        imagenUrl: 'https://picsum.photos/seed/todo/800/400',
        urlCodigo: 'https://github.com/tu_usuario/app_tareas',
        urlDemo: 'https://tu-demo.com/tareas',
      ),
      ProyectoData(
        titulo: 'E-commerce',
        descripcion:
            'Tienda virtual con carrito, pasarela de pagos y seguimiento de pedidos. Admin para gestión de productos y métricas.',
        tecnologias: ['React', 'Node.js', 'MongoDB'],
        estado: 'En pausa',
        fechaTexto: 'Junio 2023',
        progreso: 0.4,
        imagenUrl: 'https://picsum.photos/seed/shop/800/400',
        urlCodigo: 'https://github.com/tu_usuario/ecommerce',
        urlDemo: 'https://tu-demo.com/ecommerce',
      ),
    ];

    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Mi Portafolio'),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.view_list), text: 'Lista'),
              Tab(icon: Icon(Icons.unfold_more), text: 'Expandible'),
              Tab(icon: Icon(Icons.grid_on), text: 'Grid'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Vista Lista (Retos 1–6)
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(
                  'Mis Proyectos',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(height: 16),
                for (final p in proyectos)
                  ProyectoCard(
                    titulo: p.titulo,
                    descripcion: p.descripcion,
                    tecnologias: p.tecnologias,
                    estado: p.estado,
                    fechaTexto: p.fechaTexto,
                    progreso: p.progreso,
                    imagenUrl: p.imagenUrl,
                    urlCodigo: p.urlCodigo,
                    urlDemo: p.urlDemo,
                  ),
              ],
            ),
            // Vista Expandible (Reto 7)
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(
                  'Detalles Expandibles',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                ),
                const SizedBox(height: 16),
                for (final p in proyectos)
                  ProyectoExpandible(
                    titulo: p.titulo,
                    descripcion: p.descripcion,
                    tecnologias: p.tecnologias.join(' • '),
                    detalles:
                        'Arquitectura: separación por capas, manejo de estado, autenticación, caching y optimización de consultas.',
                  ),
              ],
            ),
            // Vista Grid (Reto 8)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Proyectos en Grid',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[800],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.9,
                      children: [
                        ProyectoCardMini(
                          titulo: proyectos[0].titulo,
                          icono: Icons.menu_book,
                        ),
                        ProyectoCardMini(
                          titulo: proyectos[1].titulo,
                          icono: Icons.check_circle,
                        ),
                        ProyectoCardMini(
                          titulo: proyectos[2].titulo,
                          icono: Icons.shopping_cart,
                        ),
                        const ProyectoCardMini(
                          titulo: 'Proyecto 4',
                          icono: Icons.games,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProyectoData {
  final String titulo;
  final String descripcion;
  final List<String> tecnologias;
  final String estado;
  final String fechaTexto;
  final double progreso; // 0.0 a 1.0
  final String imagenUrl;
  final String? urlCodigo;
  final String? urlDemo;

  ProyectoData({
    required this.titulo,
    required this.descripcion,
    required this.tecnologias,
    required this.estado,
    required this.fechaTexto,
    required this.progreso,
    required this.imagenUrl,
    this.urlCodigo,
    this.urlDemo,
  });
}
