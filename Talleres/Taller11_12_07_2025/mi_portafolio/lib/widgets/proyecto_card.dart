import 'package:flutter/material.dart';

class ProyectoCard extends StatelessWidget {
  final String titulo;
  final String descripcion;
  final List<String> tecnologias; // Para mostrar chips (Reto 4)
  final String estado;
  final String fechaTexto; // Para Row horizontal con icono (Reto 2)
  final double progreso; // Para barra de progreso (Reto 3)
  final String imagenUrl; // Para imagen al inicio (Reto 1)
  final String? urlCodigo; // Para botón "Código" (Reto 5)
  final String? urlDemo; // Para botón "Demo" (Reto 5)

  const ProyectoCard({
    super.key,
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

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.only(bottom: 16), // Espacio entre tarjetas
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Reto 1: Imagen
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              imagenUrl,
              height: 160,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 16),

          // Título
          Text(
            titulo,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.blue[800],
            ),
          ),
          const SizedBox(height: 8),

          // Descripción
          Text(
            descripcion,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[700],
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),

          // Reto 2: Información horizontal con Row (fecha + icono)
          Row(
            children: [
              Icon(
                Icons.calendar_today,
                size: 16,
                color: Colors.grey[500],
              ),
              const SizedBox(width: 6),
              Text(
                fechaTexto,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Reto 4: Chips de tecnologías (Wrap + Chip)
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: tecnologias.map((tec) {
              final isFirebase = tec.toLowerCase().contains('firebase');
              final bg = isFirebase ? Colors.orange[50] : Colors.blue[50];
              final fg =
                  isFirebase ? Colors.orange[700] : Colors.blue[700];
              return Chip(
                label: Text(tec),
                backgroundColor: bg,
                labelStyle: TextStyle(color: fg, fontSize: 12),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),

          // Reto 3: Barra de progreso
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Progreso: ${(progreso * 100).round()}%',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: progreso.clamp(0.0, 1.0),
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(
                    progreso >= 0.8
                        ? Colors.green
                        : (progreso >= 0.4 ? Colors.amber : Colors.red),
                  ),
                  minHeight: 8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Estado del proyecto
          Text(
            'Estado: $estado',
            style: TextStyle(
              fontSize: 12,
              color: Colors.green[600],
              fontWeight: FontWeight.w500,
            ),
          ),

          const SizedBox(height: 16),

          // Reto 5: Botones de acción (código y demo)
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () {
                  // Puedes abrir URL con url_launcher si lo agregas al pubspec
                  debugPrint('Ver código presionado: $urlCodigo');
                },
                icon: const Icon(Icons.code, size: 18),
                label: const Text('Código'),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: () {
                  debugPrint('Ver demo presionado: $urlDemo');
                },
                icon: const Icon(Icons.launch, size: 18),
                label: const Text('Demo'),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
