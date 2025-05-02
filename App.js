// app.js

import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Check login status

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
      if (isLoggedIn === 'true') {
        setIsLoggedIn(true); // Redirect to home if logged in
      } else {
        setIsLoggedIn(false); // Stay on login page
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null; // Loading state or splash screen until the login status is checked
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#2c9d92" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
          // If logged in, navigate to Home screen
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // If not logged in, show Login screen
          <Stack.Screen name="login" component={LoginPage} />
        )}

        <Stack.Screen name="PrimePicks" component={PrimePicks} />
        <Stack.Screen name="education" component={Mained} />
        <Stack.Screen name="News" component={NewsSection} />
        <Stack.Screen name="signup" component={SignUpScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
