import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { CharacterCard } from "../../components/CharacterCard";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { SearchInput } from "../../components/SearchInput";
import { Character } from "../../src/domain/models/Character.model";
import { useCharacters } from "../../src/presentation/hooks/useCharacters";
import { globalStyles, Colors } from "../../src/presentation/styles/globalStyles";

/**
 * Pantalla principal de personajes
 */
export default function CharactersScreen() {
    // 💡 Paso 1: Desestructuramos todas las variables necesarias del hook
    const {
        characters, loading, error, loadMore, refresh,
        searchText, setSearchText, isRefreshing
    } = useCharacters();

    // Estado de carga inicial
    if (loading && characters.length === 0) {
        return <LoadingState message="Cargando personajes..." />;
    }

    // Estado de error
    if (error && characters.length === 0) {
        return <ErrorState message={error} />;
    }

    // Renderizar cada personaje
    const renderCharacter = ({ item }: { item: Character }) => (
        <CharacterCard character={item} />
    );

    // Footer de la lista
    const renderFooter = () => {
        // Solo mostramos el loader si NO estamos buscando y hay más para cargar
        if (!loading || searchText) return null;
        return (
            <View style={globalStyles.footerLoader}>
                <Text style={{ color: Colors.textSecondary }}>Cargando más personajes...</Text>
            </View>
        );
    };

    return (
        <View style={globalStyles.container}>

            {/* 💡 Paso 2: El SearchInput va AHORA FUERA del FlatList */}
            <SearchInput
                searchText={searchText}
                onSearchChange={setSearchText}
            />

            <FlatList
                data={characters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCharacter}
                // Deshabilitamos la carga infinita cuando se está buscando
                onEndReached={!searchText ? loadMore : undefined}
                onEndReachedThreshold={0.5}
                // ❌ Eliminamos ListHeaderComponent
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        // Usamos isRefreshing y deshabilitamos cuando se está buscando
                        refreshing={isRefreshing && !searchText}
                        onRefresh={!searchText ? refresh : () => { }}
                    />
                }
                // Asumimos que globalStyles.listContent ahora tiene paddingTop: 0
                contentContainerStyle={globalStyles.listContent}
            />
        </View>
    );
}