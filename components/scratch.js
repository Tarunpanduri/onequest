import React, { useEffect, useState, useRef, } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,StatusBar,Platform,TouchableOpacity
} from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import LottieView from "lottie-react-native";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // SecureStore for persistence



const UserNewsScratchScreen = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  const handleProfileClick = async () => {
    const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigation.navigate('profile'); // Ensure Profile is registered in your navigator
    } else {
      navigation.navigate('login'); // Ensure Login is registered in your navigator
    }
  };


  useEffect(() => {
    const database = getDatabase();
    const postsRef = ref(database, "adminPosts");

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedPosts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPosts(formattedPosts);
      }
    });

    return () => off(postsRef);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Platform.OS === 'android' ? '#009688' : 'white'} barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
    
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Wishlist</Text>
      </View>
    
    <ScrollView style={styles.containered}>
      {posts.map((post) => (
        <View key={post.id} style={styles.newsCard}>
          <Image
            source={{ uri: post.imageUrl || "https://via.placeholder.com/100" }}
            style={styles.newsImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.newsTitle}>{post.title}</Text>
            <Text style={styles.newsDescription}>{post.description}</Text>

            {/* Custom Scratch Card */}
            <ScratchCardComponent code={post.code || "NO CODE"} />
          </View>
        </View>
      ))}
    </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <NavIcon title="Home" iconSource={require('../assets/home.png')} />
            <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Scratch')}/>
            <NavIcon title="Favorites" iconSource={require('../assets/heart.png')}  onPress={() => navigation.navigate('wishlist')} />
            <NavIcon title="Profile" iconSource={require('../assets/profffff.png')} onPress={handleProfileClick} style={styles.naviconextra} />
          </View>
    </View>
  );
};





const ScratchCardComponent = ({ code }) => {
  const [scratched, setScratched] = useState(false);
  const animationRef = useRef(null);

  const handleScratch = () => {
    if (!scratched) {
      setScratched(true);
      animationRef.current?.play();
      console.log("Scratch Complete!");
    }
  };

  return (
    <View style={styles.scratchCardContainer}>
      <Text style={styles.revealText}>{scratched ? code : "Scratch to Reveal"}</Text>

      {/* Scratch Area */}
      <View
        style={[
          styles.scratchContent,
          { backgroundColor: scratched ? "transparent" : "#FFD700" },
        ]}
      >
        {!scratched && (
          <View
            style={styles.overlay}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderMove={handleScratch}
          />
        )}

        {/* Lottie Confetti Animation */}
        {scratched && (
          <LottieView
            ref={animationRef}
            source={require("../assets/sparkles.json")} 
            autoPlay={false}
            loop={false}
            style={styles.lottie}
          />
        )}
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
  container: { flex: 1, backgroundColor: '#fff', },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 15, paddingVertical: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70 },
  heading: { fontSize: Platform.OS === 'ios' ? 22 : 18, fontWeight: 'bold', color: '#000000', flex: 1 },
  containered:{padding: 10, backgroundColor: "#fff",},
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  newsDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  scratchCardContainer: {
    width: 150,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    position: "relative",
  },
  scratchContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  revealText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D32F2F",
    position: "absolute",
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFD700",
    zIndex: 3,
  },
  lottie: {
    position: "absolute",
    width: 150,
    height: 150,
    top: -50,
    left: 0,
    zIndex: 5,
  },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#009688', paddingVertical: 10, 
    borderTopColor: '#ccc',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Shadow for Android
    elevation: 5,},
  navItem: { alignItems: 'center' },
  navIcon: { width: 28, height: 28 },
  navText: { color: '#ffffff', fontSize: 12, marginTop: 5 },
});

export default UserNewsScratchScreen;
