import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar, Animated } from 'react-native';
import { auth, db, database as rtdb } from './firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { Image } from 'expo-image'; // Import expo-image
import * as SecureStore from 'expo-secure-store';



const Teo = ({ navigation, route }) => {
  const [area, setArea] = useState('Unknown');
  const [city, setCity] = useState('Unknown');
  const [region, setRegion] = useState('Unknown');
  const [services10th, setServices10th] = useState([]);
  const [servicesIntermediate, setServicesIntermediate] = useState([]);
  const [servicesGraduation, setServicesGraduation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  


  const cardThemes = {
    '10th': {
      bgColor: '#FFEBEE', // Light red
      borderColor: '#EF5350', // Darker red
      textColor: '#D32F2F'  // Dark red for text
    },
    'intermediate': {
      bgColor: '#E8F5E9', // Light green
      borderColor: '#66BB6A', // Darker green
      textColor: '#2E7D32'  // Dark green for text
    },
    'graduation': {
      bgColor: '#E3F2FD', // Light blue
      borderColor: '#42A5F5', // Darker blue
      textColor: '#1565C0'  // Dark blue for text
    }
  };

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
    <SkeletonItem width={100} height={100} style={styles.skeletonImage} />
    <View style={styles.skeletonContent}>
      <SkeletonItem width={'80%'} height={20} style={{ marginBottom: 10 }} />
      <SkeletonItem width={'60%'} height={16} style={{ marginBottom: 8 }} />
      <SkeletonItem width={'90%'} height={16} style={{ marginBottom: 4 }} />
      <SkeletonItem width={'70%'} height={16} />
    </View>
  </View>
);

const renderSkeletonSection = () => (
  <View style={styles.section}>
    <SkeletonItem width={120} height={24} style={{ marginBottom: 15 }} />
    {renderSkeletonCard()}
    {renderSkeletonCard()}
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
    const fetchLocationData = async () => {
      try {
        console.log('Fetching user location data...');
        const userId = auth.currentUser?.uid;
  
        if (!userId) {
          console.error('No user is logged in.');
          setError('No user is logged in.');
          return;
        }
  
        console.log(`User ID: ${userId}`);
        
        // Check if rtdb is properly initialized
        if (!rtdb) {
          console.error('Realtime Database is not initialized');
          setError('Database connection error');
          return;
        }
  
        const userRef = ref(rtdb, `SavedUsers/${userId}`);
        console.log('Fetching user document from Realtime Database...');
        const snapshot = await get(userRef);
  
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('User data found:', userData);
          
          // Check if SavedAddress exists in the user data
          if (userData.SavedAddress) {
            setArea(userData.SavedAddress.area || 'Unknown');
            setCity(userData.SavedAddress.city || 'Unknown');
            setRegion(userData.SavedAddress.region || 'Unknown');
          } else {
            console.error('No address data found for the user.');
            setError('No address data found for the user.');
          }
        } else {
          console.error('No user data found.');
          setError('No user data found.');
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError('Failed to fetch location data.');
      }
    };
  
    fetchLocationData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (area === 'Unknown') {
        console.log('Area is Unknown. Skipping service fetch.');
        return;
      }

      try {
        console.log(`Fetching services for area: ${area}`);
        const q10th = query(
          collection(db, 'education'),
          where('area', '==', area),
          where('category', '==', '10th/SSC')
        );
        const qIntermediate = query(
          collection(db, 'education'),
          where('area', '==', area),
          where('category', '==', 'Intermediate/12th')
        );
        const qGraduation = query(
          collection(db, 'education'),
          where('area', '==', area),
          where('category', '==', 'Graduation')
        );

        const [querySnapshot10th, querySnapshotIntermediate, querySnapshotGraduation] = await Promise.all([
          getDocs(q10th),
          getDocs(qIntermediate),
          getDocs(qGraduation),
        ]);

        console.log('10th/SSC documents:', querySnapshot10th.docs.length);
        console.log('Intermediate/12th documents:', querySnapshotIntermediate.docs.length);
        console.log('Graduation documents:', querySnapshotGraduation.docs.length);

        setServices10th(
          querySnapshot10th.docs.map((doc) => ({
            id: doc.id,
            imageUrl: doc.data().imageUrl || '',
            name: doc.data().name || 'Unknown Education',
            courses: JSON.parse(doc.data().courses || '[]'),
          }))
        );

        setServicesIntermediate(
          querySnapshotIntermediate.docs.map((doc) => ({
            id: doc.id,
            imageUrl: doc.data().imageUrl || '',
            name: doc.data().name || 'Unknown Education',
            courses: JSON.parse(doc.data().courses || '[]'),
          }))
        );

        setServicesGraduation(
          querySnapshotGraduation.docs.map((doc) => ({
            id: doc.id,
            imageUrl: doc.data().imageUrl || '',
            name: doc.data().name || 'Unknown Education',
            courses: JSON.parse(doc.data().courses || '[]'),
          }))
        );
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to fetch educational services.');
      } finally {
        console.log('Finished fetching services.');
        setLoading(false);
      }
    };

    fetchServices();
  }, [area]);

  const isLocationIssue = area === 'Unknown' || city === 'Unknown' || region === 'Unknown';

  const NoDataContainer = ({ heading, subtext }) => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataHeading}>{heading}</Text>
      <Image source={require('../assets/ed.png')} style={styles.noDataImage} resizeMode="contain" />
      <Text style={styles.noDataSubtext}>{subtext}</Text>
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Go Back"
        >
          <Image source={require('../assets/back.png')} style={styles.backIcon}                      transition={300}
                      contentFit="cover"
                      cachePolicy="disk" priority="high"  />
        </TouchableOpacity>
        <Text style={styles.heading}>Top Organizatons</Text>
        <View style={styles.emptyView}></View>
      </View>

      <ScrollView style={styles.scrollView}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {loading ? (
          <>
          {renderSkeletonSection()}
          {renderSkeletonSection()}
          {renderSkeletonSection()}
        </>
                ) : (
          <>

            <View style={styles.section}>
              <Text style={styles.title}>10th/SSC</Text>
              {services10th.length > 0 ? (
                services10th.map((service) => (
                  <View key={service.id} style={styles.card}>
                    <Image source={{ uri: service.imageUrl }} style={styles.image}                       transition={300}
                      contentFit="cover"
                      cachePolicy="disk" priority="high" />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={styles.cardText}>Courses Offered:</Text>
                      {service.courses.map((course, index) => (
                        <Text key={index} style={styles.cardText}>• {course}</Text>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <NoDataContainer
                  heading="No data available for 10th/SSC"
                  subtext="We couldn't find any services for 10th/SSC in this area."
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Intermediate/12th</Text>
              {servicesIntermediate.length > 0 ? (
                servicesIntermediate.map((service) => (
                  <View key={service.id} style={styles.card}>
                    <Image source={{ uri: service.imageUrl }} style={styles.image}                       transition={300}
                      contentFit="cover"
                      cachePolicy="disk" priority="high"  />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={styles.cardText}>Courses Offered:</Text>
                      {service.courses.map((course, index) => (
                        <Text key={index} style={styles.cardText}>• {course}</Text>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <NoDataContainer
                  heading="No data available for Intermediate/12th"
                  subtext="We couldn't find any services for Intermediate/12th in this area."
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.title}>Graduation</Text>
              {servicesGraduation.length > 0 ? (
                servicesGraduation.map((service) => (
                  <View key={service.id} style={styles.card}>
                    <Image source={{ uri: service.imageUrl }} style={styles.image}                       transition={300}
                      contentFit="cover"
                      cachePolicy="disk"
                      priority="high" 
                      />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={styles.cardText}>Courses Offered:</Text>
                      {service.courses.map((course, index) => (
                        <Text key={index} style={styles.cardText}>• {course}</Text>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <NoDataContainer
                  heading="No data available for Graduation"
                  subtext="We couldn't find any services for Graduation in this area."
                />
              )}
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
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default Teo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#2c9d92',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  emptyView: { width: 30 },
  scrollView: {
    flex: 1,
    marginBottom:65
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 3
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 15,
    padding: 10,
    gap: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: Platform.OS === 'ios' ? 10 : 5,
  },
  cardText: {
    fontSize: 14,
    paddingBottom: 3,
    color: '#555',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    marginHorizontal: 20
  },
  noDataHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  noDataImage: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
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
  // Skeleton styles
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 15,
    padding: 10,
    gap: 10,
  },
  skeletonImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  skeletonContent: {
    flex: 1,
    padding: 10,
    gap: 8,
  },
});
