import { useEffect, useState } from "react";
import { CharacterService } from "../../data/services/character.service";
import { Character } from "../../domain/models/Character.model";

/**
 * Hook personalizado para manejar la lista de personajes.
 * Implementa paginación, búsqueda por API y "debounce" para la búsqueda.
 */
export const useCharacters = (initialPage: number = 1) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(initialPage);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');

    // Estado para el texto de búsqueda "debounced" (con retardo)
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');

    // Efecto para el Debounce
    // Espera 500ms después de que el usuario deja de escribir para actualizar el término de búsqueda.
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 500); // 500ms de espera

        return () => {
            clearTimeout(timerId); // Limpia el timer si el usuario sigue escribiendo
        };
    }, [searchText]); // Se ejecuta cada vez que 'searchText' (búsqueda en tiempo real) cambia

    /**
     * Función para cargar personajes, ahora usa el término "debounced".
     */
    const fetchCharacters = async (
        pageNumber: number,
        isPullToRefresh = false
    ) => {
        // USA EL TÉRMINO DEBOUNCED
        const finalPage = debouncedSearchText ? 1 : pageNumber;
        const shouldShowLoading = finalPage === 1 && characters.length === 0 && !isPullToRefresh;

        try {
            if (isPullToRefresh) {
                setIsRefreshing(true);
            } else if (shouldShowLoading) {
                setLoading(true);
            }
            setError(null);

            const response = await CharacterService.getCharacters(
                finalPage,
                10,
                debouncedSearchText // USA EL TÉRMINO DEBOUNCED
            );

            // DEFENSA: Asegurarnos que response.items sea un array
            const newItems = response?.items || [];

            if (debouncedSearchText || finalPage === 1) {
                setCharacters(newItems);
            } else {
                setCharacters((prev) => [...prev, ...newItems]);
            }

            // DEFENSA: Asegurarnos que response.meta exista
            const meta = response?.meta;
            const morePages = meta ? meta.currentPage < meta.totalPages : false;
            setHasMore(debouncedSearchText ? false : morePages);

        } catch (err) {
            setError("Error al cargar personajes. Intenta nuevamente.");
            console.error(err);
        } finally {
            setIsRefreshing(false);
            if (shouldShowLoading) {
                setLoading(false);
            }
        }
    };

    const loadMore = () => {
        if (!loading && hasMore && !debouncedSearchText) { // USA EL TÉRMINO DEBOUNCED
            const nextPage = page + 1;
            setPage(nextPage);
            fetchCharacters(nextPage);
        }
    };

    const refresh = () => {
        setPage(1);
        fetchCharacters(1, true);
    };

    // EFECTO CLAVE: Se dispara solo cuando el texto "debounced" cambia.
    useEffect(() => {
        // Ejecuta la búsqueda si el texto está vacío (vuelve a la lista completa) o si tiene 2 o más caracteres.
        if (debouncedSearchText.length === 0 || debouncedSearchText.length >= 2) {
            setPage(1);
            fetchCharacters(1);
        }
    }, [debouncedSearchText]); // 💡 USA EL TÉRMINO DEBOUNCED

    // Carga inicial (solo se ejecuta una vez al montar)
    useEffect(() => {
        fetchCharacters(page);
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text); // Actualiza la UI en tiempo real
        // El useEffect (debounce) se encargará de llamar a la API
    };

    return {
        characters: characters || [], // DEFENSA: Asegurarnos que 'characters' siempre sea un array
        loading: loading, // CORREGIDO: Lógica de carga simplificada
        error,
        loadMore,
        refresh,
        hasMore: hasMore && !debouncedSearchText, // Deshabilitamos hasMore si hay búsqueda
        searchText,
        setSearchText: handleSearch,
        isRefreshing,
    };
};