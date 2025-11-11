import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { checkReputation, checkFraudScore, getThreatCategories } from '../../data/datasources/dymoApi';

export default function HomeScreen() {
  const [reputation, setReputation] = useState(null);
  const [fraudScore, setFraudScore] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    checkReputation('example.com').then(setReputation);
    checkFraudScore('8.8.8.8').then(setFraudScore);
    getThreatCategories().then(setCategories);
  }, []);

  return (
    <ScrollView>
      <Text>Reputación de dominio:</Text>
      {reputation && <Text>{JSON.stringify(reputation)}</Text>}
      <Text>Fraud Score de IP:</Text>
      {fraudScore && <Text>{JSON.stringify(fraudScore)}</Text>}
      <Text>Categorías de amenazas:</Text>
      {categories.map((c, i) => <Text key={i}>{c.name}</Text>)}
    </ScrollView>
  );
}
