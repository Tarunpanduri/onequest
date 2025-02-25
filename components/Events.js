import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Animated, Platform } from 'react-native';

const Events = ({ images }) => {
  return (
    <View style={styles.eventSection}>
      <Text style={styles.sectionTitle}>Events</Text>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.eventImageContainer}>
            <Image source={image} style={styles.eventImage} resizeMode="cover" />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  eventSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  eventImageContainer: {
    width: Platform.OS === 'ios' ? 360 : 310,
    height: Platform.OS === 'ios' ? 200 : 170,
    marginRight: 15,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default Events;
