import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,Platform,StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigation } from '@react-navigation/native';
import { app } from "./firebaseConfig"; 

const db = getDatabase(app);
const auth = getAuth(app);

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userRef = ref(db, `registeredUsers/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('isLoggedIn'); 
      await signOut(auth); 
      navigation.navigate('login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('../assets/back.png')} style={styles.backIcon} />
              </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateP')}>
          <Image source={require('../assets/proff.png')} style={styles.profileImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('UpdateP')}>
          <Ionicons name="pencil" size={16} color="white" />
        </TouchableOpacity>
      </View>

        
        <View>
          <Text style={styles.greeting}>Hi, there!</Text>
          <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
          <View style={styles.userIdcont}>
            <Text style={styles.userIdLabel}>User ID:</Text>
            <Text style={styles.userId}> {auth.currentUser?.uid}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('wishlist')}>
          <Ionicons name="heart" size={25} color="#009688" />
          <Text style={styles.cardText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Scratch')}>
          <Ionicons name="ticket" size={24} color="#009688" />
          <Text style={styles.cardText}>Coupons</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsContainer}>
      <MenuItem icon="person-outline" text="Edit Profile" onPress={() => navigation.navigate('UpdateP')} />
        <MenuItem icon="location-outline" text="Addresses" onPress={() => navigation.navigate('SA')} />
        <MenuItem icon="headset-outline" text="Customer Support" onPress={() => navigation.navigate('Customer')} />
        <MenuItem icon="chatbubble-ellipses-outline" text="Get a Quote" onPress={() => navigation.navigate('QuoteScreen')} />
        <MenuItem icon="settings-outline" text="Settings" onPress={() => navigation.navigate('SettingsScreen')} />
        <MenuItem icon="information-circle-outline" text="About Us" onPress={() => navigation.navigate('GeneralInfo')} />
        <MenuItem icon="share-social-outline" text="Share the App" onPress={() => navigation.navigate('GeneralInfo')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>App Version 1.0.0</Text>
    </ScrollView>
  );
};

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color="black" />
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons name="chevron-forward-outline" size={18} color="gray" />
  </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',

    },
    backIcon: {     width: 24,height: 24, tintColor:'#000000' ,marginTop:60,marginBottom:-52, },
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginTop: 40,
    position: 'relative', // Ensure absolute positioning works
    marginBottom:Platform.OS === 'ios' ? 14 :10
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 80,
    marginRight: 25,
    borderWidth: 0.6,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    left: 65, // Adjust based on the image size and placement
    backgroundColor: '#2c9d92',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { fontSize: Platform.OS === 'ios' ? 20 :17, color: 'gray',marginTop:30 },
  name: { fontSize: Platform.OS === 'ios' ? 24 :19, fontWeight: 'bold', color: 'black' },
  editProfileButton: {
    backgroundColor: '#009688',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
  
  },
  userIdcont:{flexDirection:'row'},
  userIdLabel:{fontSize:Platform.OS === 'ios' ? 14 :10},
  userId: {
    fontSize: Platform.OS === 'ios' ? 14 :10,
    color: '#009688',
  },
  editProfileText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Platform.OS === 'ios' ? 17 :13 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 20, alignItems: 'center', marginHorizontal: 5, borderWidth: 0.5, borderColor: '#ddd', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: 'black' },

  settingsContainer: { backgroundColor: '#fff', borderRadius: 15, paddingVertical: Platform.OS === 'ios' ? 7 : 5, paddingHorizontal:  10,  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5, borderColor: '#ddd' },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: 'black', marginLeft: 10 },

  versionText: { textAlign: 'center', color: 'gray', marginTop: 7, fontSize: 12 },
  logoutButton: {
    backgroundColor: '#009688',
    marginTop: 20,
    marginHorizontal: 95,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  logoutText: { fontWeight: 'bold', color: 'white', fontSize: 16, },
});