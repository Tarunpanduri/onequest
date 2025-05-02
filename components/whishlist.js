import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  StatusBar, 
  ActivityIndicator,
  Animated
} from 'react-native';
import { Image } from 'expo-image'; // Using expo-image
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from './firebaseConfig';
import LottieView from 'lottie-react-native';
import * as SecureStore from 'expo-secure-store';

const Wishlist = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

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

  const SkeletonCard = () => (
    <View style={styles.item}>
      <SkeletonItem width="35%" height={100} style={{ borderRadius: 8, marginRight: 10 }} />
      <View style={[styles.textContainer, { flex: 1 }]}>
        <SkeletonItem width="80%" height={18} style={{ marginBottom: 8 }} />
        <SkeletonItem width="90%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonItem width="60%" height={14} />
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
      navigation.navigate('profile');
    } else {
      navigation.navigate('login');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserId(user.uid);
      fetchWishlist(user.uid);
    } else {
      console.warn('User is not logged in.');
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async (uid) => {
    if (!uid) return;
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dbRef = ref(database, `Wishlist/${uid}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([serviceId, value]) => ({
          serviceId,
          designId: value.id,
          ...value
        }));
        setWishlist(data);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    setLoading(false);
    setTimeout(() => setShowEmptyState(true), 3000);
  };

  const handleServicePress = (serviceId, designId) => {
    navigation.navigate('maineddded', { serviceId, designId });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Platform.OS === 'android' ? '#009688' : 'white'} 
                barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Wishlist</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4]} // Dummy data for skeleton loading
            renderItem={() => <SkeletonCard />}
            keyExtractor={(item) => item.toString()}
          />
        ) : userId ? (
          wishlist.length > 0 ? (
            <FlatList
              data={wishlist}
              keyExtractor={(item) => item.serviceId}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleServicePress(item.serviceId, item.designId)}>
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.image}
                    // placeholder={require('../assets/placeholder-wishlist.png')}
                    placeholderContentFit="cover"
                    transition={300}
                    contentFit="cover"
                  priority="high"/>
                  <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.address} numberOfLines={3}>{item.address}</Text>
                    <Text style={styles.timings}>Timings: {item.timings}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : showEmptyState ? (
            <View style={styles.emptyWishlistContainer}>
              <LottieView source={require('../assets/whishlist.json')} autoPlay loop style={styles.lottie} />
              <Text style={styles.emptyText}>Your wishlist is empty! Start adding your favorites now.</Text>
            </View>
          ) : null
        ) : (
          <View style={styles.loginPrompt}>
            <LottieView source={require('../assets/whishlist.json')} autoPlay loop style={styles.lottie} />
            <Text style={styles.loginText}>Please log in to view your wishlist.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('login')}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')}/>
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Scratch')}/>
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('wishlist')} />
        <NavIcon title="Profile" iconSource={require('../assets/profffff.png')} onPress={handleProfileClick} />
      </View>
    </View>
  );
};

// NavIcon Component with expo-image
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image 
      source={iconSource} 
      style={styles.navIcon} 
      contentFit="contain"
      priority="high"
      transition={300}
    />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    paddingHorizontal: 15, 
    paddingVertical: 20, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70 
  },
  heading: { 
    fontSize: Platform.OS === 'ios' ? 22 : 18, 
    fontWeight: 'bold', 
    color: '#000000', 
    flex: 1 
  },
  content: { flex: 1 },
  item: { 
    flexDirection: 'row', 
    marginBottom: 8, 
    borderRadius: 8, 
    backgroundColor: '#f5f5f5', 
    margin: 10, 
    padding: 10 
  },
  image: { 
    width: '35%', 
    height: 100, 
    borderRadius: 8, 
    marginRight: 10,
    backgroundColor: '#e1e1e1' // Fallback background
  },
  textContainer: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap' },
  address: { fontSize: 14, color: 'gray', flexWrap: 'wrap', Bottom: 0 },
  timings: { fontSize: 14, color: 'gray', flexWrap: 'wrap', marginBottom: 5 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWishlistContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: Platform.OS === 'ios' ? 16 : 14, color: 'gray', marginTop: 10 },
  lottie: { width: 200, height: 200, marginTop: Platform.OS === 'ios' ? -130 : -75 },
  loginPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginText: { fontSize: 16, color: 'gray', marginTop: 10, textAlign: 'center' },
  loginButton: { backgroundColor: '#009688', padding: 10, borderRadius: 8, marginTop: 15 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#009688',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: { alignItems: 'center' },
  navIcon: { width: 28, height: 28 },
  navText: { color: '#ffffff', fontSize: 12, marginTop: 5 },
});

export default Wishlist;