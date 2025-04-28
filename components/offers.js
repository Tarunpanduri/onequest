import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Animated } from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import MaskedView from "@react-native-masked-view/masked-view";
import Reanimated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const UserNewsScratchScreen = () => {
  const [posts, setPosts] = useState([]);

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
    <ScrollView style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.newsCard}>
          {/* Left Side - Image */}
          <Image
            source={{ uri: post.imageUrl || "https://via.placeholder.com/100" }}
            style={styles.newsImage}
          />

          {/* Right Side - Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.newsTitle}>{post.title}</Text>
            <Text style={styles.newsDescription}>{post.description}</Text>

            {/* Scratchable Code Section */}
            <ScratchCardComponent code={post.code || "NO CODE"} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// Scratch Card Component
const ScratchCardComponent = ({ code }) => {
  const progress = useSharedValue(1); // Scratch opacity

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: 300 }),
  }));

  const handleGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      progress.value = 0; // Reveal the code
    }
  };

  return (
    <View style={styles.scratchCardContainer}>
      <MaskedView
        style={styles.scratchCard}
        maskElement={
          <PanGestureHandler onHandlerStateChange={handleGesture}>
            <Reanimated.View style={[styles.scratchSurface, animatedStyle]} />
          </PanGestureHandler>
        }
      >
        <View style={styles.revealContent}>
          <Text style={styles.revealText}>🎉 {code} 🎉</Text>
        </View>
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
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
    marginTop: 10,
    width: 150,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  scratchCard: {
    flex: 1,
  },
  scratchSurface: {
    flex: 1,
    backgroundColor: "#D3D3D3",
  },
  revealContent: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFD700",
  },
  revealText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D32F2F",
  },
});

export default UserNewsScratchScreen;
