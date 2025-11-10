// components/SearchInput.tsx

import React from 'react';
import { TextInput, View } from 'react-native';
import { globalStyles, Colors } from '../src/presentation/styles/globalStyles';

interface SearchInputProps {
    searchText: string;
    onSearchChange: (text: string) => void;
}

// 💡 Usamos React.memo para evitar que se re-renderice si sus props no cambian.
const SearchInputComponent: React.FC<SearchInputProps> = React.memo(({ searchText, onSearchChange }) => {
    return (
        <View style={globalStyles.searchContainer}>
            <TextInput
                style={globalStyles.searchInput}
                placeholder="Busqueda por personaje"
                placeholderTextColor={Colors.textSecondary}
                value={searchText}
                onChangeText={onSearchChange}
            />
        </View>
    );
});

// Cambiamos el nombre para la exportación por defecto
export const SearchInput = SearchInputComponent;