import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const navigation = useNavigation();

  const messages = [
    'Kabartma tozu katılıyor',
    'Süt ekleniyor',
    'Yumurtalar kırılıyor',
    'Un ekleniyor',
    'Malzemeler karıştırılıyor',
  ];

  useEffect(() => {
    // Change message every second
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);

    // Navigate to Home after 4 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Replace with the name of your target screen
    }, 4000);

    return () => {
      clearInterval(interval); // Clear message interval
      clearTimeout(timer); // Clear navigation timer
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/recipe.webp')} />
      <Text style={styles.text}>{messages[messageIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    },
    text: {
      fontSize: 32,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 20,
      borderRadius: 100,
    },
  });
