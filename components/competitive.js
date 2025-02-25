import React from 'react';
import {
  View,
  Platform,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrimePicks = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>COMPETITIVE TESTS</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.gridContainer}>
          {/* First Row */}
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#F9A8A8' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'Aptitude' })} // Navigate with subject name
          >
            <Image style={styles.image} source={require('../assets/aa.png')} />
            <Text style={styles.boxText}>Aptitude</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#A8D0F9' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'Verbal' })} // Navigate with subject name
          >
            <Image style={styles.image} source={require('../assets/vv.png')} />
            <Text style={styles.boxText}>Verbal Ability</Text>
          </TouchableOpacity>

          {/* Second Row */}
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#A8F9B4' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'Reasoning' })}
          >
            <Image style={styles.image} source={require('../assets/rr.png')} />
            <Text style={styles.boxText}>Reasoning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#ECA8F9' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'GK' })}
          >
            <Image style={styles.image} source={require('../assets/gg.png')} />
            <Text style={styles.boxText}>GK</Text>
          </TouchableOpacity>
        </View>

        {/* DO YOU KNOW Container */}
        <View style={styles.infoContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.infoTitle}>DO YOU KNOW?</Text>
            <Image source={require('../assets/bb.png')} style={styles.imagee} /> {/* Local PNG image */}
          </View>
          <View style={styles.line}></View> {/* Line under the heading */}
          <Text style={styles.infoHeading}>Anti-Gravity Hill?</Text>
          <Text style={styles.infoText}>
            The Magnetic Hill in Ladakh, India, is an intriguing natural wonder that seemingly defies the laws of gravity.
            Located on the Leh-Kargil-Baltic National Highway, this hill creates an optical illusion, making it appear
            as though vehicles are rolling uphill against gravity when they are actually moving downhill. Tourists from
            around the world flock to the site to witness this phenomenon.
          </Text>
        </View>

        {/* Remaining Cards */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#F9D8A8' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'Current-Affairs' })}
          >
            <Image style={styles.image} source={require('../assets/ca.png')} />
            <Text style={styles.boxText}>Current Affairs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box, { backgroundColor: '#A8F9F9' }]}
            onPress={() => navigation.navigate('Tc', { Aptitude: 'Computers' })}
          >
            <Image style={styles.image} source={require('../assets/cc.png')} />
            <Text style={styles.boxText}>Computers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { title: 'Home', icon: require('../assets/home.png'), screen: 'Home' },
          { title: 'Notifications', icon: require('../assets/bell.png'), screen: 'Notifications' },
          { title: 'Offers', icon: require('../assets/offer.png'), screen: 'Offers' },
          { title: 'Favorites', icon: require('../assets/heart.png'), screen: 'Favorites' },
        ].map((item, index) => (
          <NavIcon
            key={index}
            title={item.title}
            iconSource={item.icon}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
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

export default PrimePicks;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 22 : 60,
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
  },
  emptyView: { width: 30 },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    marginBottom: 16,
    flex: 'column', // Make it a column
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5,
    paddingVertical: 20, // Add vertical padding
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginBottom: 8,
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Changed to black
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5,
  },
  headingContainer: {
    flexDirection: 'row', // Align text and image in the same line
    justifyContent: 'space-between', // Space between text and image
    alignItems: 'center', // Align items vertically in the center
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10, // Space before and after the line
  },
  infoHeading: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  imagee: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
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
