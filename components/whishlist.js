import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { database } from './firebaseConfig';
import LottieView from 'lottie-react-native';

const Wishlist = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

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
      console.log('Fetching wishlist for userId:', uid);
      const dbRef = ref(database, `Wishlist/${uid}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([serviceId, value]) => ({
          serviceId,
          designId: value.id,
          ...value
        }));
        setWishlist(data);
        console.log('Wishlist data:', data);
      } else {
        console.log('No wishlist items found.');
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    setLoading(false);

    // Delay empty state by 3 seconds
    setTimeout(() => {
      setShowEmptyState(true);
    }, 3000);
  };

  const handleServicePress = (serviceId, designId) => {
    console.log(`Navigating to 'maineddded' with serviceId: ${serviceId}, designId: ${designId}`);
    navigation.navigate('maineddded', { serviceId, designId });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Platform.OS === 'android' ? '#009688' : 'white'} barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Wishlist</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#009688" style={styles.loader} />
        ) : userId ? (
          wishlist.length > 0 ? (
            <FlatList
              data={wishlist}
              keyExtractor={(item) => item.serviceId}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.item} onPress={() => handleServicePress(item.serviceId, item.designId)}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
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

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} />
        <NavIcon title="Wishlist" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('Wishlist')} />
        <NavIcon title="Profile" iconSource={require('../assets/profffff.png')} onPress={() => navigation.navigate('profile')} />
      </View>
    </View>
  );
};

// NavIcon Component
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 15, paddingVertical: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70 },
  heading: { fontSize: Platform.OS === 'ios' ? 22 : 18, fontWeight: 'bold', color: '#000000', flex: 1 },
  content: { flex: 1 }, // Ensures content takes remaining space
  item: { flexDirection: 'row', marginBottom: 8, borderRadius: 8, backgroundColor: '#f5f5f5', margin: 10, padding: 10 },
  image: { width: '35%', height: 100, borderRadius: 8, marginRight: 10 },
  textContainer: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap', },
  address: { fontSize: 14, color: 'gray', flexWrap: 'wrap',Bottom:0 },
  timings: { fontSize: 14, color: 'gray', flexWrap: 'wrap',marginBottom:5 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWishlistContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: Platform.OS === 'ios' ? 16 : 14, color: 'gray', marginTop: 10 },
  lottie: { width: 200, height: 200, marginTop: Platform.OS === 'ios' ? -130 : -75 },
  loginPrompt: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loginText: { fontSize: 16, color: 'gray', marginTop: 10, textAlign: 'center' },
  loginButton: { backgroundColor: '#009688', padding: 10, borderRadius: 8, marginTop: 15 },
  loginButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#009688', paddingVertical: 10, borderTopWidth: 0.5 },
  navItem: { alignItems: 'center' },
  navIcon: { width: 28, height: 28 },
  navText: { color: '#ffffff', fontSize: 12, marginTop: 5 },
});

export default Wishlist;
