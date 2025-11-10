import { apiClient } from "./api.config";
import {
    Character,
    CharactersResponse,
} from "../../domain/models/Character.model";

/**
 * Servicio de Personajes
 * Maneja todas las peticiones relacionadas con personajes
 */
export class CharacterService {
    /**
     * ENDPOINT 1: Obtener lista de personajes.
     * Si searchName está vacío, pagina.
     * Si searchName tiene texto, busca por nombre Y raza en paralelo.
     */
    static async getCharacters(
        page: number = 1,
        limit: number = 10,
        searchName: string = ''
    ): Promise<CharactersResponse> {
        try {
            // --- INICIO DE LA MODIFICACIÓN ---

            // Caso 1: Búsqueda (si hay texto)
            if (searchName.length > 0) {

                // 💡 Lanzamos dos peticiones en paralelo
                const namePromise = apiClient.get<Character[]>("/characters", {
                    params: { name: searchName }
                });
                const racePromise = apiClient.get<Character[]>("/characters", {
                    params: { race: searchName }
                });

                // Esperamos a que ambas terminen (incluso si una falla)
                const results = await Promise.allSettled([namePromise, racePromise]);

                let allItems: Character[] = [];

                // 1. Añadir resultados de la búsqueda por NOMBRE
                if (results[0].status === 'fulfilled' && Array.isArray(results[0].value.data)) {
                    allItems = allItems.concat(results[0].value.data);
                }

                // 2. Añadir resultados de la búsqueda por RAZA
                if (results[1].status === 'fulfilled' && Array.isArray(results[1].value.data)) {
                    allItems = allItems.concat(results[1].value.data);
                }

                // 3. De-duplicar la lista (por si un personaje aparece en ambas)
                const uniqueItemsMap = new Map<number, Character>();
                for (const item of allItems) {
                    if (!uniqueItemsMap.has(item.id)) {
                        uniqueItemsMap.set(item.id, item);
                    }
                }
                const items = Array.from(uniqueItemsMap.values());

                // 4. Construir la respuesta falsa (mock)
                const mockMeta = {
                    totalItems: items.length,
                    itemCount: items.length,
                    itemsPerPage: items.length || 10,
                    totalPages: 1,
                    currentPage: 1,
                };

                return {
                    items: items,
                    meta: mockMeta,
                    links: { first: "", previous: "", next: "", last: "" },
                };

                // Caso 2: Paginación normal (sin búsqueda)
            } else {
                const response = await apiClient.get<CharactersResponse>("/characters", {
                    params: { page, limit },
                });
                return response.data; // Devuelve { items, meta, links }
            }
            // --- FIN DE LA MODIFICACIÓN ---

        } catch (error) {
            console.error("Error al obtener personajes:", error);
            // 💡 Si todo falla, devolvemos una respuesta vacía segura
            return {
                items: [],
                meta: { totalItems: 0, itemCount: 0, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
                links: { first: "", previous: "", next: "", last: "" },
            };
        }
    }

    /**
     * ENDPOINT 2: Obtener un personaje por ID
     * GET /characters/{id}
     */
    static async getCharacterById(id: number): Promise<Character> {
        try {
            const response = await apiClient.get<Character>(`/characters/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener personaje ${id}:`, error);
            throw error;
        }
    }
}