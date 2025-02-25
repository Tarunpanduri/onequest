import React from 'react';
import { View, Text, Platform, StatusBar, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EducationPage = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Shape Your Future</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Static Container 1: Job Notifications */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Image style={styles.imgg} source={require('../assets/syf2.jpg')} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Job Notifications</Text>
              <Text style={styles.cardDescription}>
                Stay updated with the latest job notifications and opportunities across various fields.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('JN')}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Static Container 2: Educational Organizations */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Image source={require('../assets/syf1.jpg')} style={styles.imgg} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Top Educational Organizations</Text>
              <Text style={styles.cardDescription}>
                Explore the top educational organizations offering courses to enhance your knowledge.
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TEO')}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Static Container 3: Competitive Tests */}
        <View style={styles.cardContainered }>
          <View style={styles.card}>
            <Image source={require('../assets/syf3.png')} style={styles.imgg} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Competitive Tests</Text>
              <Text style={styles.cardDescription}>
                Prepare for top competitive tests and gain valuable skills!
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ctt')}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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


const NavIcon = ({ title, iconSource }) => (
  <View style={styles.navItem}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </View>
);





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  scrollViewContent: {
    marginTop: -15,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom:170
  },
  cardContainer: {
    width: Dimensions.get('window').width - 20,
    marginVertical: 8,
  },
  cardContainered: {
    width: Dimensions.get('window').width - 20,
    marginVertical: 8,
    marginBottom:45
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#a1a7ad',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  imgg: {
    width: '100%',
    height: 168,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 18,
    backgroundColor: '#90c8c2',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  cardDescription: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
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

export default EducationPage;
