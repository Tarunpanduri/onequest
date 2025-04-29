import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";

const UserNewsScratchScreen = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();

  const handleProfileClick = async () => {
    const isLoggedIn = await SecureStore.getItemAsync("isLoggedIn");
    if (isLoggedIn === "true") {
      navigation.navigate("profile");
    } else {
      navigation.navigate("login");
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
      <StatusBar
        backgroundColor={Platform.OS === "android" ? "#009688" : "white"}
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Offers</Text>
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
              <ScratchCardComponent code={post.code || "NO CODE"} postId={post.id} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon
          title="Home"
          iconSource={require("../assets/home.png")}
          onPress={() => navigation.navigate("Home")}
        />
        <NavIcon
          title="Offers"
          iconSource={require("../assets/offer.png")}
          onPress={() => navigation.navigate("Scratch")}
        />
        <NavIcon
          title="Favorites"
          iconSource={require("../assets/heart.png")}
          onPress={() => navigation.navigate("wishlist")}
        />
        <NavIcon
          title="Profile"
          iconSource={require("../assets/profffff.png")}
          onPress={handleProfileClick}
          style={styles.naviconextra}
        />
      </View>
    </View>
  );
};

const ScratchCardComponent = ({ code, postId }) => {
  const [scratched, setScratched] = useState(false);
  const animationRef = useRef(null);

  const checkScratchStatus = async () => {
    const status = await SecureStore.getItemAsync(`scratch_${postId}`);
    if (status === "scratched") {
      setScratched(true);
    }
  };

  useEffect(() => {
    checkScratchStatus();
  }, []);

  const handleScratch = async () => {
    if (!scratched) {
      setScratched(true);
      animationRef.current?.play();
      await SecureStore.setItemAsync(`scratch_${postId}`, "scratched");
      console.log("Scratch Complete!");
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert("Copied!", "Code copied to clipboard.");
  };

  return (
    <View style={styles.scratchCardWrapper}>
      <View style={styles.scratchCardContainer}>
        <Text style={styles.revealText}>{scratched ? code : "Scratch to Reveal"}</Text>
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

      {scratched && (
                <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                  <Image source={require('../assets/copyy.png')} style={styles.copyButtonimg} />
                </TouchableOpacity>

        
      )}
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 22 : 70,
  },
  heading: {
    fontSize: Platform.OS === "ios" ? 22 : 18,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
  },
  containered: { padding: 10, backgroundColor: "#fff" },
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
  scratchCardWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  scratchCardContainer: {
    width: 150,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
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
  copyButton: {
    marginLeft: 10,
    backgroundColor: '#009688',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  copyButtonimg: {
  width:10,
  height:20,
  
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#009688",
    paddingVertical: 10,
    borderTopColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: { alignItems: "center" },
  navIcon: { width: 28, height: 28 },
  navText: { color: "#ffffff", fontSize: 12, marginTop: 5 },
});

export default UserNewsScratchScreen;
