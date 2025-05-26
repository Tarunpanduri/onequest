import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Platform,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from './firebaseConfig';
import LottieView from 'lottie-react-native';
import * as SecureStore from 'expo-secure-store';


const PrimePicks = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({ area: 'Unknown', city: 'Unknown', region: 'Unknown' });
  const fadeAnim = useRef(new Animated.Value(0.4)).current;
  const largeCities = ['Hyderabad', 'Bangalore', 'Mumbai'];
  const [showEmptyContainer, setShowEmptyContainer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

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
      <SkeletonItem width={60} height={60} style={{ borderRadius: 10, marginRight: 15 }} />
      <View style={styles.skeletonContent}>
        <SkeletonItem width={'70%'} height={20} style={{ marginBottom: 8 }} />
        <SkeletonItem width={'50%'} height={16} />
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

  useEffect(() => {
    if (!loading && services.length === 0) {
      const timer = setTimeout(() => setShowEmptyContainer(true), 1000); 
      return () => clearTimeout(timer);
    } else {
      setShowEmptyContainer(false);
    }
  }, [loading, services]);
 
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          console.error('No user is logged in.');
          return;
        }

        const dbRef = getDatabase();
        const locationRef = ref(dbRef, `SavedUsers/${userId}/SavedAddress`);
        const snapshot = await get(locationRef);

        if (snapshot.exists()) {
          const locationData = snapshot.val();
          const { area, city, region } = locationData || {};
          setLocation({ area, city, region });
          fetchServices(area, city);
        } else {
          console.warn('No location data found.');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const isLargeCity = (city) => largeCities.includes(city);

  const fetchServices = async (area, city) => {
    if (!area && !city) return;

    try {
      setLoading(true);

      let queryCondition;
      if (isLargeCity(city)) {
        queryCondition = where('area', '==', area);
      } else {
        queryCondition = where('city', '==', city);
      }

      const q = query(collection(db, 'services'), queryCondition, limit(10));
      const querySnapshot = await getDocs(q);
      const servicesData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        servicesData.push({
          id: doc.id,
          imageUrl: data.imageUrl || '',
          name: data.name || 'Unknown Service',
          designId: data.designId || '',
        });
      });

      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services: ', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices(location.area, location.city);
    setRefreshing(false);
  };


  const handleServicePress = (serviceId, designId) => {
    navigation.navigate('maineddded', { serviceId, designId });
  };

      const handleProfileClick = async () => {
        const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
        if (isLoggedIn === 'true') {
          navigation.navigate('profile'); // Ensure Profile is registered in your navigator
        } else {
          navigation.navigate('login'); // Ensure Login is registered in your navigator
        }
      };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Prime Picks</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {loading ? (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.skeletonContainer}
          >
            {[1, 2, 3, 4, 5].map((_, index) => (
              <View key={index}>{renderSkeletonCard()}</View>
            ))}
          </ScrollView>
        ) : (
          <>
            {services.length > 0 ? (
              <ScrollView
                style={styles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              >
                {services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.card}
                    onPress={() => handleServicePress(service.id, service.designId)}
                  >
                    <Image
                      source={{ uri: service.imageUrl }}
                      style={styles.cardImage}
                      transition={300}
                      contentFit="cover"
                      cachePolicy="disk"
                      priority="high" 
                    />
                    <View>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              showEmptyContainer && (
                <View style={styles.emptyContainer}>
                  <LottieView
                    source={require('../assets/noservice.json')}
                    autoPlay
                    loop
                    style={styles.lottieAnimation}
                  />
                  <Text style={styles.noservicetext}>Bringing amazing services soon! Stay tuned for updates! 😊</Text>
                  <TouchableOpacity style={styles.noservicebutton} onPress={() => navigation.goBack()}>
                    <Text style={styles.logoutText}>Go Back :)</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </>
        )}
      </View>

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
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
  emptyView: { width: 30 },
  content: { flex: 1, paddingBottom: 60 },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  skeletonContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    alignItems: 'center',
  },
  skeletonContent: {
    flex: 1,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#e1e1e1',
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
    marginBottom: 13,
  },
  noservicetext: {
    fontSize: 17,
    marginBottom: 10,
  },
  noservicebutton: {
    backgroundColor: '#009688',
    marginTop: 20,
    marginHorizontal: 70,
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20
  },
  logoutText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15
  }
});

export default PrimePicks;