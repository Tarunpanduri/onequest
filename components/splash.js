import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent({ navigation }) {
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
      navigation.replace('Home'); // Replace 'Home' with your initial screen
    }, 2000); // Display splash screen for 2 seconds
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
