import React, { useEffect, useState } from 'react';
import { View, Platform, Text, Image, StyleSheet, StatusBar, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { database } from './firebaseConfig';  
import { ref, get } from 'firebase/database';

const DesignO = ({ navigation }) => {
  const [serviceData, setServiceData] = useState(null);
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      const serviceRef = ref(database, 'services/service1');
      const snapshot = await get(serviceRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setServiceData(data);
        setExperts(data.experts || []);  // Assuming 'experts' contains an array
      } else {
        console.log('No data available');
      }
    };

    fetchServiceData();
  }, []);

  if (!serviceData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>PRIME PICKS</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Image and Info Container */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoCard}>
          <Image source={{ uri: serviceData.imageUrl }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, styles.boldText]}>{serviceData.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.infoText}>{serviceData.address}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Timings:</Text>
            <Text style={styles.infoText}>{serviceData.timings}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.infoText}>{serviceData.contactNumber}</Text>
          </View>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Discover Your Perfect Care Specialist</Text>

        {/* Experts Section */}
        <View style={styles.specialistContainer}>
          {experts.map((expert, index) => (
            <View style={styles.row} key={index}>
              <View style={styles.column}>
                <Image source={{ uri: expert.imageUrl }} style={styles.specialistImage} />
                <Text style={styles.specialistName}>{expert.name}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Button */}
        {buttonName && (
          <TouchableOpacity style={styles.buttonContainerr} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>{buttonName}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} onPress={() => navigation.navigate('Notifications')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Offers')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('Favorites')} />
      </View>
    </View>
  );
};

// NavIcon component
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default DesignO;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#ffffff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  emptyView: { width: 30 },
  container: {
    padding: 15,
    paddingBottom: 10,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    borderRadius: 13,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 15,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#009688',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  specialistContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#009688',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
});