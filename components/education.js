import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  StatusBar, 
  Animated 
} from 'react-native';

const Mained = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009688" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Shape Your Future</Text>
        <View style={styles.emptyView}></View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.eventSection}>
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

        <View style={styles.row}> 
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TEO')}>
            <Text style={styles.cardTitle}>Top Educational Organizations</Text>
            <Image source={require('../assets/education.png')} style={styles.cardImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('JN')}>
            <Text style={styles.cardTitle}>Job Notifications</Text>
            <Image source={require('../assets/jobs.png')} style={styles.cardImage} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.card, styles.fullWidthCard]} onPress={() => navigation.navigate('ctt')}>
          <View style={{ flex: 1 }}>
            <Image source={require('../assets/test.png')} style={styles.cardImage} />
          </View>
          <View style={{ flex: 2, marginLeft: 20 }}>
            <Text style={styles.cardTitle}>Competitive Tests</Text>
            <Text style={styles.cardDescription}>• Sharpen skills</Text>
            <Text style={styles.cardDescription}>• Ace exams</Text>
            <Text style={styles.cardDescription}>• Conquer goals</Text>
            <TouchableOpacity style={styles.startNowButton} onPress={() => navigation.navigate('ctt')}>
              <Text style={styles.startNowButtonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} onPress={() => navigation.navigate('Notifications')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Offers')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('Favorites')} />
      </View>
    </View>
  );
};

// Navigation Icon Component
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7} accessibilityLabel={title} accessibilityRole="button">
    <Image source={iconSource} style={styles.navIcon} resizeMode="contain" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default Mained;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: { width: 30, height: 30, tintColor: '#ffffff' },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', flex: 1, paddingLeft: 20 },
  emptyView: {
    width: 20,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 80, // Adjust the bottom padding for scrolling behavior
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  eventSection: { 
    marginVertical: 5 
  },
  eventImageContainer: { 
    width: Platform.OS === 'ios' ? 360 : 310, 
    height: Platform.OS === 'ios' ? 200 : 170, 
    marginRight: 15 
  },
  eventImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10 
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  fullWidthCard: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center', 
  },
  startNowButton: {
    backgroundColor: '#FF8C00', // Orange color
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    width: '50%',
    width: Platform.OS === 'ios' ? '50%' : '60%', 
    marginLeft: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startNowButtonText: {
    color: '#fff', 
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical:'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  cardDescription: {
    marginTop: Platform.OS === 'ios' ? 10 : 7,
    fontSize: 14,
    color: '#555',
    flex: 1,
    marginLeft: 25,

  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#009688',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  },
  topImage: {
    width: '97%',
    height: 163,
    alignSelf: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
});
