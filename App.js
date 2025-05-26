import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Image, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Screens
import HomeScreen from './components/HomeScreen';
import PrimePicks from './components/PrimePicks';
import NewsSection from './components/news';
import Mained from './components/education';
import LoginPage from './components/login';
import SignUpScreen from './components/signup';
import ProfilePage from './components/profile';
import TEO from './components/teo';
import jn from './components/jn';
import ma from './components/ma';
import ctt from './components/competitive';
import TC from './components/aptitude';
import SA from './components/address';
import ServiceDetails from './components/ServiceDetails';
import HD from './components/hospital';
import DesignO from './components/designO';
import DesignT from './components/designT';
import ECP from './components/educatio';
import DesignTT from './components/designTT';
import Majored from './components/ggd';
import Customer from './components/customer';
import maineded from './components/mainn';
import ChatSupport from './components/chatsupport';
import UpdateP from './components/updateprofile ';
import wishlist from './components/whishlist';
import Scratch from './components/scratch';

const Stack = createStackNavigator();

const SplashScreen = () => (
  <View style={styles.container}>
    <Image source={require('./assets/logo.png')} style={styles.image} />
  </View>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Securely check for stored user token
        const token = await SecureStore.getItemAsync('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#2c9d92" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            {/* Add authenticated screens here */}
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="login" component={LoginPage} />
            <Stack.Screen name="signup" component={SignUpScreen} />
            <Stack.Screen name="PrimePicks" component={PrimePicks} />
            <Stack.Screen name="education" component={Mained} />
            <Stack.Screen name="News" component={NewsSection} />
            <Stack.Screen name="profile" component={ProfilePage} />
            <Stack.Screen name="Customer" component={Customer} />
            <Stack.Screen name="TEO" component={TEO} />
            <Stack.Screen name="JN" component={jn} />
            <Stack.Screen name="ma" component={ma} />
            <Stack.Screen name="ctt" component={ctt} />
            <Stack.Screen name="Tc" component={TC} />
            <Stack.Screen name="SA" component={SA} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
            <Stack.Screen name="Hd" component={HD} />
            <Stack.Screen name="DesignO" component={DesignO} />
            <Stack.Screen name="DesignT" component={DesignT} />
            <Stack.Screen name="ECP" component={ECP} />
            <Stack.Screen name="DesignTT" component={DesignTT} />
            <Stack.Screen name="major" component={Majored} />
            <Stack.Screen name="maineddded" component={maineded} />
            <Stack.Screen name="ChatSupport" component={ChatSupport} />
            <Stack.Screen name="UpdateP" component={UpdateP} />
            <Stack.Screen name="wishlist" component={wishlist} />
            <Stack.Screen name="Scratch" component={Scratch} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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

export default App;
