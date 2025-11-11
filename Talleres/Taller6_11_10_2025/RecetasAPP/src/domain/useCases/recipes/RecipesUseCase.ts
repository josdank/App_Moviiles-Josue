import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { supabase } from "../../../data/services/supabaseClient";
import { Receta } from "../../models/Receta";

export class RecipesUseCase {
  // Obtener todas las recetas
  async obtenerRecetas(): Promise<Receta[]> {
    try {
      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Normalizar imagen_url: si la columna guarda solo el path, generar publicUrl
      const resultados: Receta[] = (data || []).map((r: any) => {
        const imagen = r.imagen_url;
        if (imagen && !imagen.startsWith("http")) {
          try {
            const { data: urlData } = supabase.storage
              .from("recetas-fotos")
              .getPublicUrl(imagen);
            r.imagen_url = urlData.publicUrl;
          } catch (e) {
            console.log("No se pudo obtener publicUrl para:", imagen, e);
          }
        }
        return r as Receta;
      });

      return resultados;
    } catch (error) {
      console.log("Error al obtener recetas:", error);
      return [];
    }
  }

  // Buscar recetas por ingrediente
  async buscarPorIngrediente(ingrediente: string): Promise<Receta[]> {
    try {
      const { data, error } = await supabase
        .from("recetas")
        .select("*")
        .contains("ingredientes", [ingrediente])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log("Error en búsqueda:", error);
      return [];
    }
  }

  // Crear nueva receta
  async crearReceta(
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    chefId: string,
    imagenUri?: string
  ) {
    try {
      let imagenUrl = null;

      // Si hay imagen, la subimos primero
      if (imagenUri) {
        imagenUrl = await this.subirImagen(imagenUri);
      }

      const { data, error } = await supabase
        .from("recetas")
        .insert({
          titulo,
          descripcion,
          ingredientes,
          chef_id: chefId,
          imagen_url: imagenUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Si la imagen fue subida pero la URL guardada no es una http(s), intentamos obtener publicUrl y actualizar la fila
      try {
        if (imagenUrl && !imagenUrl.startsWith("http") && data?.id) {
          const urlResp = supabase.storage.from("recetas-fotos").getPublicUrl(imagenUrl);
          const urlData = (urlResp as any).data;
          const publicUrl = urlData?.publicUrl;
          if (publicUrl) {
            await supabase.from("recetas").update({ imagen_url: publicUrl }).eq("id", data.id);
            data.imagen_url = publicUrl;
          }
        }
      } catch (e) {
        console.log("No se pudo actualizar la receta con publicUrl:", e);
      }
      return { success: true, receta: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar receta existente
  async actualizarReceta(
    id: string,
    titulo: string,
    descripcion: string,
    ingredientes: string[],
    imagenUri?: string
  ) {
    try {
      let imagenUrl: string | null = null;

      // Si se pasó una nueva imagen, subirla primero
      if (imagenUri) {
        imagenUrl = await this.subirImagen(imagenUri);
      }

      const updatePayload: any = {
        titulo,
        descripcion,
        ingredientes,
      };

      if (imagenUrl) {
        updatePayload.imagen_url = imagenUrl;
      }

      const { data, error } = await supabase
        .from("recetas")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, receta: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Eliminar receta
  async eliminarReceta(id: string) {
    try {
      const { error } = await supabase.from("recetas").delete().eq("id", id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Subir imagen a Supabase Storage
  private async subirImagen(uri: string): Promise<string | null> {
    try {
      // Obtener la extensión del archivo
      const extension = uri.split(".").pop();
      const nombreArchivo = `${Date.now()}.${extension}`;

      // Intentar obtener un Blob (puede no estar disponible en algunos entornos RN)
      let uploadBody: any = null;
      let contentType = `image/${extension}`;

      try {
        const response = await fetch(uri);
        if (typeof (response as any).blob === "function") {
          uploadBody = await (response as any).blob();
        } else {
          // blob no disponible: lanzar para entrar al fallback
          throw new Error("blob_not_supported");
        }
      } catch (err) {
        // Fallback: leer como base64 y convertir a Buffer
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
          uploadBody = Buffer.from(base64, "base64");
          // contentType ya definido
        } catch (fsErr) {
          console.log("Error leyendo fichero para fallback base64:", fsErr);
          throw fsErr;
        }
      }

      // Subir a Supabase Storage (uploadBody puede ser Blob o Buffer)
      const { data, error } = await supabase.storage
        .from("recetas-fotos")
        .upload(nombreArchivo, uploadBody, {
          contentType,
        });

      if (error) throw error;

      console.log("Imagen subida al storage:", data);

      // Obtener la URL pública (si el bucket es público)
      const urlResp = supabase.storage.from("recetas-fotos").getPublicUrl(nombreArchivo);
      const urlData = (urlResp as any).data;

      if (urlData && urlData.publicUrl) {
        console.log("Public URL obtenida:", urlData.publicUrl);
      } else {
        console.log("No se obtuvo publicUrl, se devolverá el path:", nombreArchivo);
      }

      // Devolver el publicUrl si existe, si no, devolver el path (nombreArchivo)
      return urlData?.publicUrl || nombreArchivo;
    } catch (error) {
      console.log("Error al subir imagen:", error);
      return null;
    }
  }

  // Seleccionar imagen de la galería
  async seleccionarImagen(): Promise<string | null> {
    try {
      // Pedir permisos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Necesitamos permisos para acceder a tus fotos");
        return null;
      }

      // Abrir selector de imágenes
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        return resultado.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.log("Error al seleccionar imagen:", error);
      return null;
    }
  }

  // Tomar foto con la cámara
  async tomarFoto(): Promise<string | null> {
    try {
      // Pedir permisos para la cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Necesitamos permisos para acceder a la cámara");
        return null;
      }

      const resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!resultado.canceled) {
        return resultado.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.log("Error al tomar foto:", error);
      return null;
    }
  }
}
