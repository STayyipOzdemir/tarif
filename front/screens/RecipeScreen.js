// components/RecipeScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecipeScreen = ({ route }) => {
  const { recipe } = route.params; // Navigasyondan gelen recipe verisi
  const { title, description, ingredients, steps, nutrition, imageUrl } = recipe;

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false); // Resim yükleme durumu
  const [imageError, setImageError] = useState(false); // Resim yükleme hatası durumu

  useEffect(() => {
    loadSavedRecipes();
  }, []);

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

  const saveRecipe = async () => {
    try {
      const exists = savedRecipes.find((item) => item.title === title);
      if (exists) {
        Alert.alert('Bilgi', 'Bu tarif zaten kaydedilmiş.');
        return;
      }

      const newRecipe = {
        title,
        description,
        ingredients,
        steps,
        nutrition,
        imageUrl: imageUrl || 'https://via.placeholder.com/300x200.png?text=Tarif+Fotoğrafı',
      };
      const newSavedRecipes = [...savedRecipes, newRecipe];
      await AsyncStorage.setItem('@saved_recipes', JSON.stringify(newSavedRecipes));
      setSavedRecipes(newSavedRecipes);
      Alert.alert('Başarılı', 'Tarif başarıyla kaydedildi.');
    } catch (e) {
      console.error('Error saving the recipe.', e);
      Alert.alert('Hata', 'Tarifi kaydederken bir hata oluştu.');
    }
  };

  // İçeriği sadece resim yüklendiğinde göster
  const renderContent = () => (
    <>
      <Text style={styles.title}>{title || 'Tarifin Adı'}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      <Text style={styles.sectionTitle}>Malzemeler</Text>
      {ingredients.map((item, index) => (
        <Text key={index} style={styles.contentText}>
          - {item}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Nasıl Yapılır</Text>
      {steps.map((step, index) => (
        <Text key={index} style={styles.contentText}>
          {index + 1}. {step}
        </Text>
      ))}
      {nutrition && (
        <>
          <Text style={styles.sectionTitle}>Besin Değerleri</Text>
          <Text style={styles.contentText}>Kalori: {nutrition.calories}</Text>
          <Text style={styles.contentText}>Protein: {nutrition.protein}</Text>
          <Text style={styles.contentText}>Yağ: {nutrition.fat}</Text>
          <Text style={styles.contentText}>Karbonhidrat: {nutrition.carbohydrates}</Text>
        </>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
        <Text style={styles.saveButtonText}>Tarifi Kaydet</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/recipe.webp')} style={styles.logo} />
      <View style={styles.imageContainer}>
        {!imageLoaded && !imageError && (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        )}
        <Image
          source={
            imageUrl
              ? { uri: imageUrl }
              : { uri: 'https://via.placeholder.com/300x200.png?text=Tarif+Fotoğrafı' }
          }
          style={styles.image}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true); // Hata durumunda da içeriği göstermek için
          }}
        />
      </View>
      {imageLoaded && !imageError ? (
        renderContent()
      ) : imageError ? (
        <>
          <Text style={styles.errorText}>
            Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
          </Text>
          {/* İsteğe bağlı olarak içeriği göstermek isterseniz, aşağıdaki satırı yorum satırı haline getirebilirsiniz */}
          {/* {renderContent()} */}
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 30 },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 40,
  },
  imageContainer: {
    width: '95%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
  },
  image: { width: '100%', height: '100%', borderRadius: 16 },
  loader: { position: 'absolute' },
  title: { fontSize: 24, fontWeight: 'bold', margin: 15 },
  description: { fontSize: 16, marginHorizontal: 15, marginBottom: 10 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 20,
  },
  contentText: { fontSize: 16, marginHorizontal: 15, marginTop: 10 },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { 
    fontSize: 16, 
    color: 'red', 
    textAlign: 'center', 
    margin: 20 
  },
});

export default RecipeScreen;