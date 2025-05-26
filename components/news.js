import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';


const NewsSection = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  const fetchNews = async () => {
    const apiUrl = "https://mocki.io/v1/16847e41-f08a-468c-a717-609dc7438d61";
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const formattedData = data.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));

      // Simulate network delay to see skeleton loading
      setTimeout(() => {
        setNews(formattedData);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setError("Failed to load news. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
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
    <View style={styles.skeletonCard}>
      <SkeletonItem width="100%" height={200} style={{ marginBottom: 15 }} />
      <SkeletonItem width="80%" height={24} style={{ marginBottom: 10 }} />
      <SkeletonItem width="60%" height={18} style={{ marginBottom: 8 }} />
      <SkeletonItem width="40%" height={14} />
    </View>
  );

  // Add shimmer animation
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [fadeAnim]);

  const renderItem = ({ item }) => (
    <View style={styles.newsCard}>
      <Image 
        source={{ uri: item.image }}
        style={styles.image}
        transition={200} // Smooth fade-in duration
        contentFit="cover"
        priority="high" // Prioritize loading these images
        cachePolicy="disk" // Cache images for better performance
      />
      <View style={styles.newsCardContent}>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text style={styles.area}>{item.area}</Text>
        <Text style={styles.time}>Updated: {item.updated}</Text>
      </View>
    </View>
  );

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
      <StatusBar
        barStyle="light-content"
        backgroundColor="#009688"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>News</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Main Content */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]} // Dummy data for skeleton loading
          renderItem={renderSkeletonCard}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.newsSection}
          showsVerticalScrollIndicator={false}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchNews}>
            <Text style={styles.refreshText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.newsSection}
          ListEmptyComponent={<Text style={styles.noNews}>No news available</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}

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


const NavIcon = ({ title, iconSource, onPress, style }) => (
  <TouchableOpacity style={[styles.navItem, style]} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} resizeMode="contain" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: { width: 30, height: 30, tintColor: '#ffffff' },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', flex: 1, paddingLeft: 20 },
  content: { paddingBottom: 80 },
  newsSection: { paddingHorizontal: 15, paddingBottom: 80, marginTop: 10 },
  newsCard: {
    backgroundColor: '#fcfcfc',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 15,
  },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  newsCardContent: { padding: 15 },
  headline: { fontSize: 20, fontWeight: 'bold', color: '#141212', marginBottom: 8 },
  area: { fontSize: 16, color: '#141212', marginBottom: 8 },
  time: { fontSize: 12, color: '#555' },
  error: { color: 'red', fontSize: 16, textAlign: 'center', paddingBottom: 10 },
  noNews: { color: '#555', fontSize: 16, textAlign: 'center', paddingTop: 20 },
  refreshButton: {
    backgroundColor: '#009688',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  refreshText: { color: '#ffffff', fontSize: 16, textAlign: 'center' },
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
    skeletonCard: {
      backgroundColor: '#fcfcfc',
      borderWidth: 1,
      borderColor: '#e1e1e1',
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 4,
      marginBottom: 15,
      padding: 15,
    },
  skeletonContent: {
    marginTop: 10,
  },
});

export default NewsSection;