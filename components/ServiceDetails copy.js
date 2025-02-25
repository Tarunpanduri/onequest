import React, { useEffect, useState } from 'react';
import {
  View,
  Platform,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, get } from 'firebase/database';

const ServiceDetails = ({ route }) => {
  const navigation = useNavigation();
  const { serviceId, designId } = route.params;
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonName, setButtonName] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    } else {
      console.warn('No serviceId provided');
    }
  }, []);

  const fetchServiceDetails = async () => {
    try {
      console.log('Fetching service details for:', serviceId);
      const dbRef = ref(getDatabase(), `services/${serviceId}`);
      const snapshot = await get(dbRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Service data retrieved:', data);
        setServiceData(data);
        setButtonName(data.buttonName || '');
        setButtonLink(data.buttonLink || '');
      } else {
        console.warn('No service data found');
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Error', 'Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonPress = () => {
    if (buttonLink) {
      Linking.canOpenURL(buttonLink)
        .then((supported) => {
          if (supported) {
            Linking.openURL(buttonLink);
          } else {
            Alert.alert('Invalid URL', 'Cannot open this link.');
          }
        })
        .catch((err) => console.error('An error occurred while opening the link:', err));
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#009688" style={styles.loader} />;
  }

  if (!serviceData) {
    return <Text style={styles.noData}>Service details not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {designId === 'design1' ? (
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
        <ScrollView contentContainerStyle={styles.containerr}>
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
              <TouchableOpacity style={styles.buttonContainerr} onPress={handleButtonPress}>
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








// {...................................DESIGN 2.......................................................}
      ) : designId === 'design2' ? (       
          <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Image source={require('../assets/back.png')} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.heading}>{serviceData.name}</Text>
              <View style={styles.emptyView}></View>
            </View>

            {/* Image and Info Container */}
            <ScrollView contentContainerStyle={styles.containerr}>
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

              {/* New Mobile Products Section */}
              <View style={styles.productsGrid}>
                {serviceData?.products?.map((product, index) => (
                  <View key={index} style={styles.productCard}>
                    {/* Product Image */}
                    <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

                    {/* Mobile Name */}
                    <Text style={styles.productName}>{product.name}</Text>

                    {/* Product Cost */}
                    <Text style={styles.productCost}>₹ {product.cost}</Text>

                    {/* Buy Now Button */}
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyNow(product)}>
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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
      ) : designId === 'design3' && serviceData ? (
        <View style={styles.design3Container}>
          <Text style={styles.title}>{serviceData.name}</Text>
          <Text>{serviceData.additionalInfo}</Text>
        </View>
      ) : designId === 'design4' && serviceData ? (
        <View style={styles.design4Container}>
          <Text style={styles.title}>{serviceData.name}</Text>
          <Image source={{ uri: serviceData.bannerUrl }} style={styles.bannerImage} />
          <Text>Contact: {serviceData.contactDetails}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>Invalid design or no content available.</Text>
      )}
    </ScrollView>
  );
};







// NavIcon component
const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default ServiceDetails;

const styles = StyleSheet.create({
  loader: { marginTop: 50 },
  noData: { textAlign: 'center', fontSize: 16, color: '#666666', marginTop: 50 },
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
  containerr: {
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
  buttonContainerr: {
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






  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  productCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  productCost: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  buyButton: {
    backgroundColor: '#009688',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },






  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});
