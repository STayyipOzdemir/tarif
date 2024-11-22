import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getRecipe from '../services/openaiService';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = () => {
  const navigation = useNavigation();

  const [userInput, setUserInput] = useState('');
  const [recipeData, setRecipeData] = useState({
    recipeType: '',
    servings: '',
    prepTime: '',
    difficulty: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showServingsModal, setShowServingsModal] = useState(false);
  const [showPrepTimeModal, setShowPrepTimeModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  // Örnek AI tarafından üretilmiş tarif önerileri
  useEffect(() => {
    setAiSuggestions([
      { id: '1', name: 'Çikolatalı Kek' },
      { id: '2', name: 'Sebzeli Makarna' },
      { id: '3', name: 'Izgara Tavuk' },
    ]);
  }, []);

  const handleGenerateRecipe = async (selectedRecipeType) => {
    setLoading(true);
    try {
      const response = await getRecipe({
        ...recipeData,
        recipeType: selectedRecipeType || userInput,
      });
      setLoading(false);

      // Tarif verilerini RecipeScreen ekranına yönlendirme
      navigation.navigate('Recipe', { recipe: response.recipe });
    } catch (error) {
      setLoading(false);
      console.error("Tarif alınırken hata oluştu:", error);
      alert("Tarif alınırken bir hata oluştu: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Alanı */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Tarif türü girin..."
          value={userInput}
          onChangeText={setUserInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => handleGenerateRecipe()} style={styles.sendButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Baloncuklar */}
      <View style={styles.bubblesContainer}>
        <TouchableOpacity style={styles.bubble} onPress={() => setShowServingsModal(true)}>
          <Text style={styles.bubbleText}>
            {recipeData.servings ? `Kişi Sayısı: ${recipeData.servings} Kişilik` : 'Kişi Sayısı'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bubble} onPress={() => setShowPrepTimeModal(true)}>
          <Text style={styles.bubbleText}>
            {recipeData.prepTime ? `Hazırlık Süresi: ${recipeData.prepTime}` : 'Hazırlık Süresi'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bubble} onPress={() => setShowDifficultyModal(true)}>
          <Text style={styles.bubbleText}>
            {recipeData.difficulty ? `Zorluk: ${recipeData.difficulty}` : 'Zorluk Seviyesi'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* AI Tarafından Önerilen Tarifler */}
      <FlatList
        data={aiSuggestions}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeSuggestion} onPress={() => handleGenerateRecipe(item.name)}>
            <Text style={styles.recipeSuggestionText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.suggestionsList}
      />

      {/* Yükleniyor Göstergesi */}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Tarif oluşturuluyor...</Text>
        </View>
      )}

      {/* Kişi Sayısı Seçim Modali */}
      <Modal visible={showServingsModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kaç kişilik olsun?</Text>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((serving) => (
              <TouchableOpacity
                key={serving}
                style={styles.modalOption}
                onPress={() => {
                  setRecipeData((prev) => ({ ...prev, servings: serving }));
                  setShowServingsModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{serving} Kişilik</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowServingsModal(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Hazırlık Süresi Seçim Modali */}
      <Modal visible={showPrepTimeModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hazırlık Süresi</Text>
            {['30 dakikadan az', '30-60 dakika', '1-2 saat', '2 saatten fazla'].map((time) => (
              <TouchableOpacity
                key={time}
                style={styles.modalOption}
                onPress={() => {
                  setRecipeData((prev) => ({ ...prev, prepTime: time }));
                  setShowPrepTimeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{time}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPrepTimeModal(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Zorluk Seviyesi Seçim Modali */}
      <Modal visible={showDifficultyModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Zorluk Seviyesi</Text>
            {['Kolay', 'Orta', 'Zor'].map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.modalOption}
                onPress={() => {
                  setRecipeData((prev) => ({ ...prev, difficulty: level }));
                  setShowDifficultyModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{level}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowDifficultyModal(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f5', alignItems: 'center', paddingTop: 50 },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
  },
  bubblesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  bubble: {
    backgroundColor: '#e1f5fe',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  bubbleText: { fontSize: 14, color: '#007AFF', textAlign: 'center' },
  suggestionsList: { width: '90%' },
  recipeSuggestion: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  recipeSuggestionText: { fontSize: 16, color: '#333' },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#007AFF' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, marginBottom: 15, fontWeight: 'bold' },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: { fontSize: 16, color: '#007AFF' },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  modalCloseButtonText: { color: '#fff', fontSize: 16 },
});

export default ChatScreen;
