import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Platform, StatusBar, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image'; // Import expo-image
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';


const EducationPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton Loading Components
  const SkeletonItem = ({ width, height, style }) => (
    <View style={[
      { 
        width, 
        height, 
        backgroundColor: '#e1e1e1',
        borderRadius: 4,
        overflow: 'hidden',
      },
      style
    ]}>
      <Animated.View 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f2f2f2',
          opacity: fadeAnim
        }} 
      />
    </View>
  );

  const renderSkeletonCard = () => (
    <View style={styles.card}>
      <SkeletonItem width="100%" height={168} />
      <View style={[styles.cardContent, { backgroundColor: '#e1e1e1' }]}>
        <SkeletonItem width="60%" height={24} style={{ marginBottom: 10 }} />
        <SkeletonItem width="90%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonItem width="80%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonItem width="40%" height={40} style={{ borderRadius: 10 }} />
      </View>
    </View>
  );

  // Shimmer animation
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [fadeAnim]);

        const handleProfileClick = async () => {
          const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
          if (isLoggedIn === 'true') {
            navigation.navigate('profile'); // Ensure Profile is registered in your navigator
          } else {
            navigation.navigate('login'); // Ensure Login is registered in your navigator
          }
        };

  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image 
            source={require('../assets/back.png')} 
            style={styles.backIcon} 
            contentFit="contain"
            priority="high"
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Shape Your Future</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <>
            <View style={styles.cardContainer}>
              {renderSkeletonCard()}
            </View>
            <View style={styles.cardContainer}>
              {renderSkeletonCard()}
            </View>
            <View style={styles.cardContainered}>
              {renderSkeletonCard()}
            </View>
          </>
        ) : (
          <>
            {/* Static Container 1: Job Notifications */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Image 
                  style={styles.imgg} 
                  source={require('../assets/syf2.jpg')}
                  contentFit="cover"
                  transition={300}
                  priority="high"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Job Notifications</Text>
                  <Text style={styles.cardDescription}>
                    Stay updated with the latest job notifications and opportunities across various fields.
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JN')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Static Container 2: Educational Organizations */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Image 
                  source={require('../assets/syf1.jpg')} 
                  style={styles.imgg}
                  contentFit="cover"
                  transition={300}
                  priority="high"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Top Educational Organizations</Text>
                  <Text style={styles.cardDescription}>
                    Explore the top educational organizations offering courses to enhance your knowledge.
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TEO')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Static Container 3: Competitive Tests */}
            <View style={styles.cardContainered}>
              <View style={styles.card}>
                <Image 
                  source={require('../assets/syf3.png')} 
                  style={styles.imgg}
                  contentFit="cover"
                  transition={300}
                  priority="high"
                  cachePolicy="disk"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Competitive Tests</Text>
                  <Text style={styles.cardDescription}>
                    Prepare for top competitive tests and gain valuable skills!
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ctt')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

    {/* Bottom Navigation */}
    <View style={styles.bottomNav}>
      <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')}/>
      <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Scratch')}/>
      <NavIcon title="Favorites" iconSource={require('../assets/heart.png')}  onPress={() => navigation.navigate('wishlist')} />
      <NavIcon title="Profile" iconSource={require('../assets/profffff.png')} onPress={handleProfileClick} style={styles.naviconextra} />
    </View>
    </View>
  );
};

const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image 
      source={iconSource} 
      style={styles.navIcon}
      contentFit="contain"
      transition={300}
      priority="high"
      cachePolicy="disk"
    />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: { 
    width: 30, 
    height: 30, 
    tintColor: '#ffffff' 
  },
  heading: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#ffffff', 
    flex: 1, 
    paddingLeft: 20 
  },
  scrollViewContent: {
    marginTop: -15,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 170
  },
  cardContainer: {
    width: Dimensions.get('window').width - 20,
    marginVertical: 8,
  },
  cardContainered: {
    width: Dimensions.get('window').width - 20,
    marginVertical: 8,
    marginBottom: 45
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#a1a7ad',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  imgg: {
    width: '100%',
    height: 168,
    backgroundColor: '#e1e1e1', // Fallback background
  },
  cardContent: {
    padding: 18,
    backgroundColor: '#90c8c2',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  cardDescription: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#009688', paddingVertical: 10, 
      borderTopColor: '#ccc',
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      // Shadow for Android
      elevation: 5, },
    navItem: { alignItems: 'center' },
    naviconextra:{width: 25, height: 25},
    navIcon: { width: 28, height: 28 },
    
    navText: { color: '#ffffff', fontSize: 12, marginTop: 5 },
});

export default EducationPage;