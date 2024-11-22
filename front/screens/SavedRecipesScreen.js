import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SavedRecipesScreen = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSavedRecipes();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSavedRecipes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@saved_recipes');
      if (jsonValue != null) {
        setSavedRecipes(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Saved recipes could not be loaded.', e);
    }
  };

  const deleteRecipe = async (title) => {
    const updatedRecipes = savedRecipes.filter((item) => item.title !== title);
    setSavedRecipes(updatedRecipes);
    await AsyncStorage.setItem('@saved_recipes', JSON.stringify(updatedRecipes));
    Alert.alert('Başarılı', 'Tarif silindi.');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/recipe.webp')} style={styles.logo} />
      <FlatList
        data={savedRecipes}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <TouchableOpacity
              style={styles.recipeContent}
              onPress={() => navigation.navigate('Recipe', { recipe: item })}
            >
              <Image
                source={
                  item.imageUrl
                    ? { uri: item.imageUrl }
                    : require('../assets/recipe.webp')
                }
                style={styles.recipeImage}
              />
              <Text style={styles.recipeTitle}>{item.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteRecipe(item.title)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 40,
  },
  container: { flex: 1, padding: 16 },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipeContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  recipeTitle: { fontSize: 18, flexShrink: 1 },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: { color: 'white', fontWeight: 'bold' },
});

export default SavedRecipesScreen;