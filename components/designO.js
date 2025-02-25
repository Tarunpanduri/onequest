import React, { useEffect, useState } from 'react';
import { View, Platform, Text, Image, StyleSheet, StatusBar, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { database } from './firebaseConfig';  // Importing the Firebase config
import { ref, get } from 'firebase/database';  // Firebase database functions

const DesignO = ({ navigation }) => {
  const [serviceData, setServiceData] = useState(null);
  const [buttonName, setButtonName] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  useEffect(() => {
    const fetchServiceData = async () => {
      const serviceRef = ref(database, 'services/service1');
      const snapshot = await get(serviceRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setServiceData(data);
        setButtonName(data.buttonName);  // Assuming the button name is stored as 'buttonName'
        setButtonLink(data.buttonLink);  // Assuming the button link is stored as 'buttonLink'
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

  const handleButtonPress = () => {
    if (buttonLink) {
      Linking.openURL(buttonLink); // Open the URL when the button is pressed
    }
  };

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
            <Text style={[styles.infoTextt, styles.boldText]}>{serviceData.name}</Text>
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

        {/* Specialist Scroll View */}
        <ScrollView style={styles.specialistScrollContainer}>
          {Array.isArray(serviceData.specialists) &&
            serviceData.specialists.map((specialist, index) => (
              <View key={index} style={styles.specialistCard}>
                <View style={styles.specialistContent}>
                  <Image source={{ uri: specialist.imageUrl || serviceData.imageUrl }} style={styles.specialistImage} />
                  <View style={styles.specialistTextContainer}>
                    <Text style={styles.specialistText}>
                      <Text style={styles.specialistLabel}>Name:</Text> {specialist.name || 'N/A'}
                    </Text>
                    <Text style={styles.specialistText}>
                      <Text style={styles.specialistLabel}>Specialist:</Text> {specialist.specialty || 'General'}
                    </Text>
                  </View>
                </View>
                {/* Separator Line */}
                {index < serviceData.specialists.length - 1 && (
                  <View style={styles.separatorLine}></View>
                )}
              </View>
            ))}

          {/* Button */}
          {buttonName && (
            <TouchableOpacity style={styles.buttonContainer} onPress={handleButtonPress}>
              <Text style={styles.buttonText}>{buttonName}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
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
    borderTopRightRadius: 13
  },
  tagline: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#009688',
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 7,
    paddingHorizontal: 15, // Left and Right gap
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  infoTextt: {
    fontSize: 20,
    color: '#333333',
    flex: 1, // Ensure the text takes the remaining space
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    flex: 3, // Ensure the text takes the remaining space
  },
  specialistScrollContainer: {
    paddingBottom: 60,
    paddingTop: 5, // Adds spacing at the top of the specialist section
  },
  specialistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15, // Adds horizontal margin to specialist cards
  },
  specialistContent: {
    flexDirection: 'row',
    padding: 5,
    paddingBottom: 15,
    alignItems: 'center',
  },
  specialistImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15, // Space between image and text
  },
  specialistTextContainer: {
    flex: 1,
  },
  specialistText: {
    fontSize: 14,
    color: '#333333',
  },
  specialistLabel: {
    fontWeight: 'bold',
    color: '#000000',
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    marginHorizontal: 15,
  },
  buttonContainer: {
    backgroundColor: '#009688', // Button color
    borderRadius: 13,
    paddingVertical: 13,
    marginHorizontal: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
