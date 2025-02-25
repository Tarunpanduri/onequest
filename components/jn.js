import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from './firebaseConfig'; // Import Firestore from config file
import { collection, getDocs } from 'firebase/firestore'; // Firestore queries

// Job Card Component
const JobCard = ({ logo, company, position, applyLink, lastDate }) => {
  const fadeAnimation = useRef(new Animated.Value(1)).current; // Initial opacity is 1

  useEffect(() => {
    const startFade = () => {
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 0, // Fade out to 0 opacity
          duration: 1000, // 1 second
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1, // Fade in to full opacity
          duration: 1000, // 1 second
          useNativeDriver: true,
        }),
      ]).start();
    };

    const interval = setInterval(startFade, 3000); // Fade every 3 seconds

    return () => clearInterval(interval);
  }, [fadeAnimation]);

  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: logo || 'https://via.placeholder.com/80' }}
        style={styles.logoLeft}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{`${company} IS HIRING: ${position} - FRESHERS`}</Text>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => applyLink && Linking.openURL(applyLink)}
          disabled={!applyLink}
          accessibilityLabel={`Apply for ${position} at ${company}`}
        >
          <Text style={styles.buttonText}>Apply Now</Text>
        </TouchableOpacity>
        <Animated.Text
          style={[
            styles.lastDateText,
            { opacity: fadeAnimation }, // Apply fade animation
          ]}
        >
          <Text style={styles.lastDateLabel}>Last Date to Apply: </Text>
          <Text style={styles.lastDateValue}>{lastDate}</Text>
        </Animated.Text>
      </View>
    </View>
  );
};

const PrimePicks = () => {
  const navigation = useNavigation();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'jobs'));
        const jobs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobData(jobs);
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>JOB NOTIFICATIONS</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Job Listings */}
      {loading ? (
        <ActivityIndicator size="large" color="#009688" style={{ marginTop: 50 }} />
      ) : jobData.length > 0 ? (
        <FlatList
          contentContainerStyle={{ paddingBottom: 70, paddingTop: 20 }}
          data={jobData}
          renderItem={({ item }) => (
            <JobCard
              logo={item.logo}
              company={item.company}
              position={item.position}
              applyLink={item.applyLink}
              lastDate={item.lastDate || 'Not Specified'}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noDataText}>
          No job notifications available at the moment.
        </Text>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavIcon
          title="Home"
          iconSource={require('../assets/home.png')}
          onPress={() => navigation.navigate('Home')}
        />
        <NavIcon
          title="Notifications"
          iconSource={require('../assets/bell.png')}
          onPress={() => navigation.navigate('Notifications')}
        />
        <NavIcon
          title="Offers"
          iconSource={require('../assets/offer.png')}
          onPress={() => navigation.navigate('Offers')}
        />
        <NavIcon
          title="Favorites"
          iconSource={require('../assets/heart.png')}
          onPress={() => navigation.navigate('Favorites')}
        />
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
    flex: 1,
    textAlign: 'center',
  },
  emptyView: { width: 30 },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
    gap: 4,
  },
  logoLeft: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lastDateText: {
    flexDirection: 'row',
    fontWeight: 'bold'
  },
  lastDateLabel: {
    fontSize: 14,
    color: 'red',
  },
  lastDateValue: {
    fontSize: 14,
    color: 'black',
  },
  applyButton: {
    backgroundColor: '#ff7f50',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
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
    zIndex: 10,
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
