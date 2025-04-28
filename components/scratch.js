import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { Canvas, Path, Skia, Touch, useTouchHandler, useValue } from "@shopify/react-native-skia";

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
          <Image
            source={{ uri: post.imageUrl || "https://via.placeholder.com/100" }}
            style={styles.newsImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.newsTitle}>{post.title}</Text>
            <Text style={styles.newsDescription}>{post.description}</Text>

            {/* GPay Scratch Card Effect */}
            <ScratchCardComponent code={post.code || "NO CODE"} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const ScratchCardComponent = ({ code }) => {
  const scratchPath = useValue(Skia.Path.Make());

  // Handle user touch for scratch effect
  const touchHandler = useTouchHandler({
    onStart: (touch) => {
      scratchPath.current.addCircle(touch.x, touch.y, 10);
    },
    onActive: (touch) => {
      scratchPath.current.addCircle(touch.x, touch.y, 10);
    },
  });

  return (
    <View style={styles.scratchCardContainer}>
      <View style={styles.revealContent}>
        <Text style={styles.revealText}>🎉 {code} 🎉</Text>
      </View>

      {/* Scratch Layer */}
      <Canvas style={styles.scratchCanvas} onTouch={touchHandler}>
        <Path path={scratchPath} color="transparent" strokeWidth={30} />
      </Canvas>
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
    width: 150,
    height: 50,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  scratchCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
