import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../core/offer_service.dart';
import '../models/product.dart';
import '../state/app_state.dart';

class EmployeeProductsScreen extends StatefulWidget {
  /// Si viene un id, abre automáticamente el formulario de edición de ese producto
  final String? editProductId;

  const EmployeeProductsScreen({super.key, this.editProductId});

  @override
  State<EmployeeProductsScreen> createState() => _EmployeeProductsScreenState();
}

class _EmployeeProductsScreenState extends State<EmployeeProductsScreen> {
  bool _openedAuto = false;
  final _offersApi = OfferService();

  Future<File?> _pickImage() async {
    final picker = ImagePicker();
    final x = await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (x == null) return null;
    return File(x.path);
  }

  String _weekdayName(int w) {
    // 1..7
    switch (w) {
      case 1:
        return 'Lunes';
      case 2:
        return 'Martes';
      case 3:
        return 'Miércoles';
      case 4:
        return 'Jueves';
      case 5:
        return 'Viernes';
      case 6:
        return 'Sábado';
      case 7:
        return 'Domingo';
      default:
        return '—';
    }
  }

  double _toDouble(dynamic v) {
    if (v is num) return v.toDouble();
    return double.tryParse(v?.toString() ?? '') ?? 0;
  }

  int? _toInt(dynamic v) {
    if (v == null) return null;
    if (v is int) return v;
    return int.tryParse(v.toString());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    // Si llegó desde la home con editProductId, abrir el form una sola vez
    if (!_openedAuto && widget.editProductId != null) {
      _openedAuto = true;
      final app = context.read<AppState>();
      final p = app.products.firstWhere(
        (e) => e.id == widget.editProductId,
        orElse: () => Product(
          id: 'tmp',
          name: '',
          description: '',
          price: 0,
          category: 'Hamburguesas',
          imageUrl: null,
          isAvailable: true,
        ),
      );
      if (p.id != 'tmp') {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _openForm(context, product: p);
        });
      }
    }
  }

  Future<void> _openForm(BuildContext context, {Product? product}) async {
    final app = context.read<AppState>();

    final name = TextEditingController(text: product?.name ?? '');
    final desc = TextEditingController(text: product?.description ?? '');
    final price = TextEditingController(text: product?.price.toString() ?? '');
    final category = TextEditingController(text: product?.category ?? 'Hamburguesas');
    final imageUrl = TextEditingController(text: product?.imageUrl ?? '');
    bool isAvailable = product?.isAvailable ?? true;

    File? picked;

    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (ctx, setLocal) => AlertDialog(
          title: Text(product == null ? 'Nuevo producto' : 'Editar producto'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Preview
                  Container(
                    height: 170,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      color: Colors.black12,
                      image: picked != null
                          ? DecorationImage(image: FileImage(picked!), fit: BoxFit.cover)
                          : (imageUrl.text.trim().isNotEmpty
                              ? DecorationImage(image: NetworkImage(imageUrl.text.trim()), fit: BoxFit.cover)
                              : null),
                    ),
                    child: (picked == null && imageUrl.text.trim().isEmpty)
                        ? const Center(child: Icon(Icons.image, size: 42))
                        : null,
                  ),
                  const SizedBox(height: 12),

                  TextField(controller: name, decoration: const InputDecoration(labelText: 'Nombre')),
                  const SizedBox(height: 10),
                  TextField(controller: desc, decoration: const InputDecoration(labelText: 'Descripción'), maxLines: 2),
                  const SizedBox(height: 10),
                  TextField(controller: price, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Precio')),
                  const SizedBox(height: 10),
                  TextField(controller: category, decoration: const InputDecoration(labelText: 'Categoría (ej: Hamburguesas, Snacks...)')),
                  const SizedBox(height: 10),

                  SwitchListTile(
                    value: isAvailable,
                    onChanged: (v) => setLocal(() => isAvailable = v),
                    title: const Text('Disponible'),
                    subtitle: const Text('Si está apagado, se mostrará como no disponible'),
                  ),

                  const Divider(height: 22),

                  TextField(
                    controller: imageUrl,
                    decoration: const InputDecoration(labelText: 'Imagen (URL opcional)', hintText: 'https://...'),
                    onChanged: (_) => setLocal(() {}),
                  ),

                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            picked = await _pickImage();
                            setLocal(() {});
                          },
                          icon: const Icon(Icons.image_outlined),
                          label: const Text('Elegir imagen (archivo)'),
                        ),
                      ),
                      const SizedBox(width: 10),
                      OutlinedButton.icon(
                        onPressed: () {
                          picked = null;
                          imageUrl.clear();
                          setLocal(() {});
                        },
                        icon: const Icon(Icons.delete_outline),
                        label: const Text('Quitar'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
            ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Guardar')),
          ],
        ),
      ),
    );

    if (ok != true) return;

    final nameV = name.text.trim();
    final descV = desc.text.trim();
    final catV = category.text.trim().isEmpty ? 'General' : category.text.trim();
    final priceV = double.tryParse(price.text.trim()) ?? 0;

    if (nameV.isEmpty) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('El nombre es obligatorio.')));
      return;
    }

    String? finalImageUrl = imageUrl.text.trim().isEmpty ? null : imageUrl.text.trim();

    // NUEVO -> crear para obtener id real -> subir imagen si es archivo
    if (product == null) {
      final created = await app.createAndReturnProduct(
        Product(
          id: 'tmp',
          name: nameV,
          description: descV,
          price: priceV,
          category: catV,
          imageUrl: picked != null ? null : finalImageUrl,
          isAvailable: isAvailable,
        ),
      );

      if (picked != null) {
        final uploaded = await app.productService.uploadProductImage(productId: created.id, file: picked!);
        await app.updateProduct(created.copyWith(imageUrl: uploaded));
      }
    } else {
      if (picked != null) {
        final uploaded = await app.productService.uploadProductImage(productId: product.id, file: picked!);
        finalImageUrl = uploaded;
      }

      await app.updateProduct(
        product.copyWith(
          name: nameV,
          description: descV,
          price: priceV,
          category: catV,
          imageUrl: finalImageUrl,
          isAvailable: isAvailable,
        ),
      );
    }
  }

  // -------------------- PROMOS UI --------------------

  Future<void> _openPromos(BuildContext context, Product product) async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (sheetCtx) {
        return DraggableScrollableSheet(
          expand: false,
          initialChildSize: 0.82,
          minChildSize: 0.55,
          maxChildSize: 0.95,
          builder: (ctx, scrollController) {
            return Padding(
              padding: EdgeInsets.only(
                left: 14,
                right: 14,
                top: 6,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 12,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Promos / Ofertas / Combos', style: Theme.of(ctx).textTheme.titleLarge),
                  const SizedBox(height: 4),
                  Text(product.name, style: Theme.of(ctx).textTheme.bodyMedium),
                  const SizedBox(height: 12),

                  // Botón crear
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        await _openCreateOffer(ctx, product);
                        if (!ctx.mounted) return;
                        // Recargar lista
                        (ctx as Element).markNeedsBuild();
                      },
                      icon: const Icon(Icons.add),
                      label: const Text('Crear promo/oferta/combo'),
                    ),
                  ),

                  const SizedBox(height: 10),

                  Expanded(
                    child: FutureBuilder<List<Map<String, dynamic>>>(
                      future: _offersApi.getOffersForProduct(product.id),
                      builder: (ctx2, snap) {
                        if (snap.connectionState != ConnectionState.done) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        if (snap.hasError) {
                          return Center(child: Text('Error cargando ofertas: ${snap.error}'));
                        }
                        final offers = snap.data ?? [];
                        if (offers.isEmpty) {
                          return const Center(child: Text('No hay ofertas aún para este producto.'));
                        }

                        return ListView.separated(
                          controller: scrollController,
                          itemCount: offers.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (_, i) {
                            final o = offers[i];

                            final id = o['id'].toString();
                            final title = (o['title'] ?? '').toString();
                            final type = (o['type'] ?? '').toString();
                            final details = (o['details'] ?? '').toString();
                            final isActive = (o['is_active'] ?? true) == true;
                            final extra = _toDouble(o['extra_price']);
                            final discount = _toDouble(o['discount_percent']);
                            final day = _toInt(o['day_of_week']);
                            final freeItem = (o['free_item'] ?? '').toString().trim();

                            final chips = <Widget>[
                              Chip(label: Text(type.toUpperCase())),
                              if (day != null) Chip(label: Text(_weekdayName(day))),
                              if (discount > 0) Chip(label: Text('-${discount.toStringAsFixed(0)}%')),
                              if (extra != 0) Chip(label: Text('+\$${extra.toStringAsFixed(2)}')),
                              if (freeItem.isNotEmpty) Chip(label: Text('Regalo')),
                            ];

                            return Card(
                              child: Padding(
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            title,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                          ),
                                        ),
                                        Switch(
                                          value: isActive,
                                          onChanged: (v) async {
                                            await _offersApi.toggleOfferActive(id, v);
                                            if (!ctx2.mounted) return;
                                            (ctx2 as Element).markNeedsBuild();
                                          },
                                        ),
                                      ],
                                    ),
                                    if (details.trim().isNotEmpty) Text(details),
                                    const SizedBox(height: 10),
                                    Wrap(spacing: 8, runSpacing: 6, children: chips),
                                    const SizedBox(height: 6),
                                    Align(
                                      alignment: Alignment.centerRight,
                                      child: TextButton.icon(
                                        onPressed: () async {
                                          final ok = await showDialog<bool>(
                                            context: ctx2,
                                            builder: (dialogCtx) => AlertDialog(
                                              title: const Text('Eliminar oferta'),
                                              content: Text('Se eliminará "$title".'),
                                              actions: [
                                                TextButton(
                                                  onPressed: () => Navigator.pop(dialogCtx, false),
                                                  child: const Text('Cancelar'),
                                                ),
                                                ElevatedButton(
                                                  onPressed: () => Navigator.pop(dialogCtx, true),
                                                  child: const Text('Eliminar'),
                                                ),
                                              ],
                                            ),
                                          );
                                          if (ok == true) {
                                            await _offersApi.deleteOffer(id);
                                            if (!ctx2.mounted) return;
                                            (ctx2 as Element).markNeedsBuild();
                                          }
                                        },
                                        icon: const Icon(Icons.delete_outline),
                                        label: const Text('Eliminar'),
                                      ),
                                    )
                                  ],
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _openCreateOffer(BuildContext context, Product product) async {
    // Form controllers
    final title = TextEditingController();
    final details = TextEditingController();
    final extraPrice = TextEditingController(text: '0');
    final discountPercent = TextEditingController(text: '0');
    final freeItem = TextEditingController();

    String type = 'promo'; // promo|combo|offer
    int? dayOfWeek; // null = siempre (1..7 = día)

    final ok = await showDialog<bool>(
      context: context,
      builder: (dialogCtx) => StatefulBuilder(
        builder: (dctx, setLocal) => AlertDialog(
          title: const Text('Crear promo/oferta/combo'),
          content: SizedBox(
            width: 520,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  DropdownButtonFormField<String>(
                    value: type,
                    items: const [
                      DropdownMenuItem(value: 'promo', child: Text('Promo (descuento)')),
                      DropdownMenuItem(value: 'offer', child: Text('Oferta (extra / condición)')),
                      DropdownMenuItem(value: 'combo', child: Text('Combo (incluye algo)')),
                    ],
                    onChanged: (v) => setLocal(() => type = v ?? 'promo'),
                    decoration: const InputDecoration(labelText: 'Tipo'),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<int?>(
                    value: dayOfWeek,
                    items: [
                      const DropdownMenuItem(value: null, child: Text('Siempre (cualquier día)')),
                      for (int i = 1; i <= 7; i++)
                        DropdownMenuItem(value: i, child: Text(_weekdayName(i))),
                    ],
                    onChanged: (v) => setLocal(() => dayOfWeek = v),
                    decoration: const InputDecoration(labelText: 'Día (opcional)'),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: title,
                    decoration: const InputDecoration(labelText: 'Título (ej: Lunes -15%)'),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: details,
                    maxLines: 2,
                    decoration: const InputDecoration(labelText: 'Detalle (opcional)'),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: discountPercent,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Descuento % (0..100)',
                      hintText: 'Ej: 15',
                    ),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: extraPrice,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Extra precio (opcional)',
                      hintText: 'Ej: 1.50',
                    ),
                  ),
                  const SizedBox(height: 10),

                  TextField(
                    controller: freeItem,
                    decoration: const InputDecoration(
                      labelText: 'Regalo (opcional)',
                      hintText: 'Ej: Helado gratis',
                    ),
                  ),

                  const SizedBox(height: 10),
                  const Text(
                    'Notas:\n- El descuento se aplica al precio base.\n- El extra se suma después del descuento.\n- El regalo solo se muestra (no suma).',
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(dialogCtx, false), child: const Text('Cancelar')),
            ElevatedButton(onPressed: () => Navigator.pop(dialogCtx, true), child: const Text('Crear')),
          ],
        ),
      ),
    );

    if (ok != true) return;

    final t = title.text.trim();
    if (t.isEmpty) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('El título es obligatorio.')));
      return;
    }

    final disc = double.tryParse(discountPercent.text.trim()) ?? 0;
    final extra = double.tryParse(extraPrice.text.trim()) ?? 0;
    final gift = freeItem.text.trim().isEmpty ? null : freeItem.text.trim();
    final det = details.text.trim().isEmpty ? null : details.text.trim();

    await _offersApi.createOffer(
      productId: product.id,
      type: type,
      title: t,
      details: det,
      extraPrice: extra,
      discountPercent: disc,
      dayOfWeek: dayOfWeek,
      freeItem: gift,
    );

    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Oferta creada')));
  }

  // -------------------- UI LISTA PRODUCTOS --------------------

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();

    return Scaffold(
      appBar: AppBar(title: const Text('Productos (Empleado)')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _openForm(context),
        icon: const Icon(Icons.add),
        label: const Text('Nuevo'),
      ),
      body: app.loading
          ? const Center(child: CircularProgressIndicator())
          : app.error != null
              ? Center(child: Text('Error: ${app.error}'))
              : ListView.separated(
                  padding: const EdgeInsets.all(12),
                  itemCount: app.products.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (_, i) {
                    final p = app.products[i];

                    return Card(
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(12),
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            width: 54,
                            height: 54,
                            color: Colors.black12,
                            child: p.imageUrl == null
                                ? const Icon(Icons.image_not_supported)
                                : Image.network(p.imageUrl!, fit: BoxFit.cover),
                          ),
                        ),
                        title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${p.category} • \$${p.price.toStringAsFixed(2)}'
                            '${p.isAvailable ? '' : ' • NO DISPONIBLE'}'),
                        trailing: Wrap(
                          spacing: 6,
                          children: [
                            IconButton(
                              tooltip: 'Promos',
                              icon: const Icon(Icons.local_offer_outlined),
                              onPressed: () => _openPromos(context, p),
                            ),
                            IconButton(
                              tooltip: 'Editar',
                              icon: const Icon(Icons.edit),
                              onPressed: () => _openForm(context, product: p),
                            ),
                            IconButton(
                              tooltip: 'Eliminar',
                              icon: const Icon(Icons.delete_outline),
                              onPressed: () async {
                                final ok = await showDialog<bool>(
                                  context: context,
                                  builder: (dialogCtx) => AlertDialog(
                                    title: const Text('Eliminar producto'),
                                    content: Text('Se eliminará "${p.name}".'),
                                    actions: [
                                      TextButton(
                                        onPressed: () => Navigator.pop(dialogCtx, false),
                                        child: const Text('Cancelar'),
                                      ),
                                      ElevatedButton(
                                        onPressed: () => Navigator.pop(dialogCtx, true),
                                        child: const Text('Eliminar'),
                                      ),
                                    ],
                                  ),
                                );

                                if (ok == true) {
                                  await app.deleteProduct(p.id);
                                }
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
