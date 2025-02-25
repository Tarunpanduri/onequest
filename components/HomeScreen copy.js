import React, { useState, useEffect, useRef } from 'react';
import { View, Text,StatusBar, Platform, StyleSheet, TouchableOpacity, Image, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'; // SecureStore for persistence
import { getAuth } from 'firebase/auth'; // Firebase Authentication for getting user ID
import { getDatabase, ref, get } from 'firebase/database'; // Firebase Realtime Database functions
import LottieView from 'lottie-react-native';


const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [userAddress, setUserAddress] = useState(null);
  const [userId, setUserId] = useState(null);  // State to store user ID
  const [loading, setLoading] = useState(true); // Loading state to track data fetching

  const images = [
    require('../assets/bnr.png'),
    require('../assets/bnrr.png'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: currentIndex * 315,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  // Fetch current user's ID using Firebase Authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Set user ID dynamically
        console.log("Fetched userId:", user.uid); // Debugging log
      } else {
        console.error("User is not authenticated");
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch addresses from Firebase when the component mounts
  useEffect(() => {
    if (!userId) return; // Don't fetch addresses until the user ID is available
  
    const fetchUserAddress = async () => {
      const db = getDatabase();
      const addressesRef = ref(db, `SavedUsers/${userId}/SavedAddress`);
      const snapshot = await get(addressesRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Fetched addresses:", data); // Debugging log
  
        // Check if data is valid
        if (data && typeof data === 'object') {
          // Directly map the fetched object to state
          const mappedAddress = {
            UserName: data.UserName || "N/A",
            WorkType: data.WorkType || "N/A",
            address: data.address || "N/A",
            area: data.area || "N/A",
            city: data.city || "N/A",
            contactNumber: data.contactNumber || "N/A",
            id: data.id || "N/A",
            latitude: data.latitude || "N/A",
            longitude: data.longitude || "N/A",
            name: data.name || "N/A",
            userId: data.userId || "N/A",
          };
  
          setUserAddress(mappedAddress);  // Update state with the fetched data
          console.log("Mapped address:", mappedAddress); // Debugging log
        } else {
          console.log("Invalid data format:", data);
          setUserAddress(null); // Handle case where data is malformed
        }
      } else {
        console.log("No address found for user.");
        setUserAddress(null); // Handle case where no data is available
      }
  
      setLoading(false); // Set loading to false once data is fetched
    };
  
    fetchUserAddress();
  }, [userId]); // Only run when userId changes
  

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
    <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('SA'); }}>
            <View>
              {loading ? (
                <Text style={styles.location}>  </Text>  // Show loading text while fetching
              ) : (
                <>
                  {userAddress ? ( // Check if userAddress exists
                    <>
                      <Text style={styles.location}>{userAddress?.WorkType || "N/A"}</Text>
                      <Text style={styles.subLocation}>{userAddress?.area ? `${userAddress.area}, ${userAddress.city}` : "N/A"}</Text>

                    </>
                  ) : (
                    <Text style={styles.location}>No address available</Text>
                  )}
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleProfileClick}>
            <Image source={require('../assets/prof.png')} style={styles.avatar} />
          </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.introTitle} onPress={() => navigation.navigate('TEO', { location: userAddress })}>YOUR QUEST BEGINS HERE</Text>
        <Text style={styles.subtitle} onPress={() => navigation.navigate('DesignTT')}>Find the top and best at your ease</Text>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#d6f0ff' }]} onPress={() => navigation.navigate('PrimePicks', { location: userAddress })}>
          <View style={styles.cardContent}>
            <Image source={require('../assets/d.png')} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Top Rated by Community</Text>
              <Text style={styles.cardDescription}>Top rated Stores, Hospitals, Restaurants, Hostels & more</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#ffed9b' }]} onPress={() => navigation.navigate('ECP', { location: userAddress })}>
          <View style={styles.cardContent}>
            <Image source={require('../assets/ed.png')} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Shape Your Future Here</Text>
              <Text style={styles.cardDescription}>Best Schools, Colleges, Institutions & more</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#d3f6e3' }]} onPress={() => navigation.navigate('News')}>
          <View style={styles.cardContent}>
            <Image source={require('../assets/news.jpg')} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Latest Headlines</Text>
              <Text style={styles.cardDescription}>World and National News in your pocket</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.eventSection}>
          <Text style={styles.sectionTitle}>Events</Text>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: scrollX, y: 0 }}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.eventImageContainer}>
                <Image source={image} style={styles.eventImage} resizeMode="cover" />
              </View>
            ))}
          </Animated.ScrollView>
        </View>

        <View style={styles.collabSection}>
        <Text style={styles.collabTitle}>
          Transform Your Vision into <Text style={{ color: 'yellow' }}>Reality</Text>
        </Text>

        {/* Subtitle Container: White background with full-width text and Lottie file */}
        <View style={styles.subtitleContainer}>
          {/* <Text style={styles.collabSubtitle}>
            We provide professional web and mobile app development, creating custom, high-performance solutions to help businesses excel in the digital age.With innovative design, powerful
          </Text> */}

          {/* Text on left and Lottie on right */}
          <View style={styles.subtitleRightContainer}>
            <Text style={styles.collabSubtitleLeft}>
            We build custom web and mobile apps with smart designs, useful features, and solutions that grow with your business.</Text>
            <View style={styles.lottieWrapper}>
              <LottieView
                source={require('../assets/collab.json')}  // Replace with your Lottie file path
                autoPlay
                loop
                style={styles.lottieStyle}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.collabButton}>
          <Text style={styles.buttonText}>Collaborate with us</Text>
        </TouchableOpacity>
      </View>







      </ScrollView>

      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} />
      </View>
    </View>
  );
};

const NavIcon = ({ title, iconSource }) => (
  <View style={styles.navItem}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space evenly between elements
    alignItems: 'flex-end',
    padding: 13,
    backgroundColor: '#009688',
    height: Platform.OS === 'ios' ? 120 : 110,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap:3
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  location: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subLocation: {
    color: '#d3f3f2',
    paddingBottom: 5,
  },
  cartIcon: {
    color: '#fff',
    fontSize: 28,
    paddingBottom:'7'
  },
  content: { padding: 15 },
  introTitle: { fontSize: Platform.OS === 'ios' ? 27 : 23, fontWeight: 'bold', textAlign: 'center', color: '#333', paddingTop: '15', paddingBottom: '10' },
  subtitle: { textAlign: 'center', color: 'purple', marginBottom: 20 },
  card: 
  { 
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5,
   },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardImage: { width: 150, height: 150, borderRadius: 10, marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'left', paddingBottom: '10' },
  cardDescription: { fontSize: 12, color: '#666', textAlign: 'left' },
  
  
  
  
  
  exploreButton: {
    backgroundColor: '#FF8C00', // Orange color
    borderRadius: 10,
    
    paddingVertical: 8,
    marginTop: 20, 
    width: Platform.OS === 'android' ? '90%' : '70%',
    
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5,
    fontSize: '16', 
    alignItems: 'left',
  },
  exploreText: {
    color: '#fff', 
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical:'center'
  },

  
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  eventSection: { marginVertical: 10 },
  eventImageContainer: { width: Platform.OS === 'ios' ? 360 : 310, height: Platform.OS === 'ios' ? 200 : 170, marginRight: 15 },
  eventImage: { width: '100%', height: '100%', borderRadius: 10 },
  collabSection: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#2c9d92',
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  collabTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  collabSubtitle: {
    color: '#000000',
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    textAlignVertical: 'top',
    textAlign: 'left',
    marginBottom: 5,
  },
  subtitleContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  subtitleRightContainer: {
    flexDirection: 'row', // Split text and Lottie horizontally
    marginTop: -3, 
  },
  collabSubtitleLeft: {
    flex: 1,  // Text takes up most of the width
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    color: '#000000',
    textAlign: 'auto',
    // marginRight: 10,  // Add some margin to separate from Lottie
  },
  lottieWrapper: {
    width: 120,  // Lottie width
    height: 100, // Lottie height
    justifyContent: 'center',
    alignItems: 'center',

  },
  lottieStyle: {
    width: '110%',
    height: '110%',
    right:3,
    top:10,
  },
  collabButton: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#009688', paddingVertical: 10 },
  navItem: { alignItems: 'center' },
  navIcon: { width: 24, height: 24 },
  navText: { color: '#ffffff', fontSize: 12, marginTop: 5 },

});

export default HomeScreen;
