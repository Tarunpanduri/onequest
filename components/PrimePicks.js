import React, { useEffect, useState } from 'react';
import { View, Platform, Text, Image, StyleSheet, ScrollView, StatusBar,Button, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from './firebaseConfig'; // Import the shared Firebase instance
import LottieView from 'lottie-react-native';

const PrimePicks = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({ area: 'Unknown', city: 'Unknown', region: 'Unknown' });

  const largeCities = ['Hyderabad', 'Bangalore', 'Mumbai']; // Example list of large cities
  const [showEmptyContainer, setShowEmptyContainer] = useState(false);

  useEffect(() => {
    if (!loading && services.length === 0) {
      const timer = setTimeout(() => setShowEmptyContainer(true), 1000); 
      return () => clearTimeout(timer); // Cleanup on unmount
    } else {
      setShowEmptyContainer(false); // Reset visibility state
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
          console.log('Fetched location data:', { area, city, region });
          setLocation({ area, city, region });
          fetchServices(area, city); // Pass both area and city
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
        console.log("Fetching services for large city by area:", area);
      } else {
        queryCondition = where('city', '==', city);
        console.log("Fetching services for small city by city:", city);
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
          designId: data.designId || '', // Ensure designId is available
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

  const fallbackImage = 'https://via.placeholder.com/60';

  const handleServicePress = (serviceId, designId) => {
    navigation.navigate('maineddded', { serviceId, designId });
  };

  const EmptyState = ({ message }) => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

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
          <ActivityIndicator size="large" color="#009688" style={styles.loader} />
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
                      source={{ uri: service.imageUrl || fallbackImage }}
                      style={styles.cardImage}
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
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} onPress={() => navigation.navigate('Notifications')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Offers')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('Favorites')} />
      </View>
    </View>
  );
};

// NavIcon component
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default PrimePicks;

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
  loader: { marginTop: 50 },
  content: { flex: 1, paddingBottom: 60 },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
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
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  noData: { textAlign: 'center', fontSize: 16, color: '#666666', marginTop: 50 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#009688',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
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
  noservicetext:{
    fontSize:17,
    marginBottom:10,
    // marginTop:5,
  },
  noservicebutton: {
    backgroundColor: '#009688', // Button color
    marginTop: 20,
    marginHorizontal: 70,
    paddingVertical: 10,
    paddingHorizontal:50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
    marginBottom:20
  },
  logoutText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize:15
  }
});
