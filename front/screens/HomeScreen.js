import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yemek Tarifi Chatbot</Text>
      <Button
        title="Tarif Almak İçin Sohbet Başlat"
        onPress={() => navigation.navigate('Chat')}
      />
      <Button
        title="Tarifleri Görüntüle"
        onPress={() => navigation.navigate('SavedRecipesScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default HomeScreen;
