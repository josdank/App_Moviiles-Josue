import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useCVContext } from '../context/CVContext';
import uuid from 'react-native-uuid';


interface FormValues {
  nombre: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
}

export default function SkillsScreen() {
  const { cvData, addSkill, deleteSkill } = useCVContext();
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { nombre: '', nivel: 'Básico' },
  });

  const onSubmit = (data: FormValues) => {
    const newSkill = { id: uuid.v4().toString(), ...data };
    addSkill(newSkill);
    reset();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Agregar Habilidad</Text>

      <Text style={{ marginTop: 10 }}>Nombre de la habilidad:</Text>
      <Controller
        control={control}
        name="nombre"
        rules={{ required: 'Campo obligatorio' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ej: React, Node.js, Python..."
              style={{
                borderWidth: 1,
                borderColor: error ? 'red' : '#ccc',
                borderRadius: 8,
                padding: 8,
                marginVertical: 5,
              }}
            />
            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
          </>
        )}
      />

      <Text style={{ marginTop: 10 }}>Nivel:</Text>
      <Controller
        control={control}
        name="nivel"
        render={({ field: { onChange, value } }) => (
          <Picker selectedValue={value} onValueChange={onChange}>
            <Picker.Item label="Básico" value="Básico" />
            <Picker.Item label="Intermedio" value="Intermedio" />
            <Picker.Item label="Avanzado" value="Avanzado" />
            <Picker.Item label="Experto" value="Experto" />
          </Picker>
        )}
      />

      <Button title="Agregar" onPress={handleSubmit(onSubmit)} />

      <Text style={{ fontSize: 18, marginTop: 20, fontWeight: 'bold' }}>Mis habilidades:</Text>
      {cvData.habilidades?.map((h, i) => (
        <View key={h.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <Text style={{ flex: 1 }}>• {h.nombre} ({h.nivel})</Text>
            <Button title="Eliminar" onPress={() => deleteSkill(h.id)} />
        </View>
        ))}
    </View>
  );
}
