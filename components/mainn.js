import React, { useEffect, useState ,useRef} from 'react';
import {
  View,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { getDatabase, ref, get,set } from 'firebase/database';
import { auth } from "./firebaseConfig"; // Firebase authentication
import { Image } from 'expo-image';

const ServiceDetails = ({ route }) => {
  const navigation = useNavigation();
  const { serviceId, designId } = route.params;
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonName, setButtonName] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [tagline, setTagline] = useState('');
  const userId = auth.currentUser?.uid; // Get logged-in user ID
  const db = getDatabase();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0.4)).current;



    // Skeleton Loading Components
    const SkeletonItem = ({ width, height, style }) => (
      <View style={[
        { 
          width, 
          height, 
          backgroundColor: '#e1e1e1',
          borderRadius: 4,
          overflow: 'hidden',
        },
        style
      ]}>
        <Animated.View 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f2f2f2',
            opacity: fadeAnim
          }} 
        />
      </View>
    );
  
    // Design 1 Skeleton (Specialists List)
    const renderDesign1Skeleton = () => (
      <View style={styles.containerr}>
        <View style={styles.infoCard}>
          <SkeletonItem width="100%" height={200} style={{ borderTopLeftRadius: 13, borderTopRightRadius: 13,marginBottom:10 }} />
          <View style={styles.infoContainer}>
            <SkeletonItem width="70%" height={24} style={{marginRight:5}} />
            <SkeletonItem width={24} height={24} style={{marginRight:5}}/>
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}}/>
            <SkeletonItem width="60%" height={16} />
          </View>
        </View>
        
        <SkeletonItem width="80%" height={24} style={{ alignSelf: 'center', marginVertical: 10 }} />
        
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={[styles.specialistCard, { padding: 15 }]}>
            <View style={styles.specialistContent}>
              <SkeletonItem width={80} height={80} style={{ borderRadius: 15, marginRight: 15 }} />
              <View style={styles.specialistTextContainer}>
                <SkeletonItem width="60%" height={16} style={{ marginBottom: 8 }} />
                <SkeletonItem width="40%" height={16} />
              </View>
            </View>
            {index < 2 && <View style={styles.separatorLine} />}
          </View>
        ))}
        
        <SkeletonItem width="90%" height={50} style={{ 
          alignSelf: 'center', 
          marginTop: 20,
          marginBottom: 70,
          borderRadius: 13 
        }} />
      </View>
    );
  
    // Design 2 Skeleton (Products Grid)
    const renderDesign2Skeleton = () => (
      <View style={styles.containerr}>
        <View style={styles.infoCard}>
          <SkeletonItem width="100%" height={200} style={{ borderTopLeftRadius: 13, borderTopRightRadius: 13,marginBottom:10 }} />
          <View style={styles.infoContainer}>
            <SkeletonItem width="70%" height={24} style={{marginRight:5}} />
            <SkeletonItem width={24} height={24} style={{marginRight:5}}/>
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}}/>
            <SkeletonItem width="60%" height={16} />
          </View>
        </View>
        
        <SkeletonItem width="80%" height={24} style={{ alignSelf: 'center', marginVertical: 10 }} />
        
        <View style={styles.productsGrid}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.productCard}>
              <SkeletonItem width={100} height={100} style={{ borderRadius: 10 }} />
              <SkeletonItem width="80%" height={16} style={{ marginTop: 8 }} />
              <SkeletonItem width="40%" height={14} style={{ marginTop: 4 }} />
              <SkeletonItem width="90%" height={30} style={{ 
                marginTop: 8,
                borderRadius: 8 
              }} />
            </View>
          ))}
        </View>
      </View>
    );
  
    // Design 3 Skeleton (Products List)
    const renderDesign3Skeleton = () => (
      <View style={styles.containerr}>
        <View style={styles.infoCard}>
          <SkeletonItem width="100%" height={200} style={{ borderTopLeftRadius: 13, borderTopRightRadius: 13,marginBottom:10 }} />
          <View style={styles.infoContainer}>
            <SkeletonItem width="70%" height={24} style={{marginRight:5}} />
            <SkeletonItem width={24} height={24} style={{marginRight:5}}/>
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}}/>
            <SkeletonItem width="60%" height={16} />
          </View>
        </View>
        
        <SkeletonItem width="80%" height={24} style={{ alignSelf: 'center', marginVertical: 10 }} />
        
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={[styles.specialistCard, { padding: 15 }]}>
            <View style={styles.specialistContent}>
              <SkeletonItem width={80} height={80} style={{ borderRadius: 15, marginRight: 15 }} />
              <View style={styles.specialistTextContainer}>
                <SkeletonItem width="60%" height={16} style={{ marginBottom: 8 }} />
                <SkeletonItem width="40%" height={16} />
              </View>
            </View>
            {index < 2 && <View style={styles.separatorLine} />}
          </View>
        ))}
        
        <SkeletonItem width="90%" height={50} style={{ 
          alignSelf: 'center', 
          marginTop: 20,
          marginBottom: 70,
          borderRadius: 13 
        }} />
      </View>
    );
  
    // Design 4 Skeleton (Experts Grid)
    const renderDesign4Skeleton = () => (
      <View style={styles.containerr}>
        <View style={styles.infoCard}>
          <SkeletonItem width="100%" height={200} style={{ borderTopLeftRadius: 13, borderTopRightRadius: 13,marginBottom:10 }} />
          <View style={styles.infoContainer}>
            <SkeletonItem width="70%" height={24} style={{marginRight:5}} />
            <SkeletonItem width={24} height={24} style={{marginRight:5}}/>
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}} />
            <SkeletonItem width="60%" height={16} />
          </View>
          <View style={styles.infoContainer}>
            <SkeletonItem width="30%" height={16} style={{marginRight:15}}/>
            <SkeletonItem width="60%" height={16} />
          </View>
        </View>
        
        <SkeletonItem width="80%" height={24} style={{ alignSelf: 'center', marginVertical: 10 }} />
        
        <View style={styles.ServiceContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.ServiceRow}>
              <View style={styles.column}>
                <SkeletonItem width={120} height={120} style={{ borderRadius: 10 }} />
                <SkeletonItem width="80%" height={16} style={{ marginTop: 5 }} />
              </View>
            </View>
          ))}
        </View>
        
        <SkeletonItem width="90%" height={50} style={{ 
          alignSelf: 'center', 
          marginTop: 20,
          marginBottom: 70,
          borderRadius: 13 
        }} />
      </View>
    );
  
    // Shimmer animation
    useEffect(() => {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    }, [fadeAnim]);


  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
      checkWishlistStatus();
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
        setTagline(data.tagline || ''); 
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
  const checkWishlistStatus = async () => {
    if (!userId) return;
    const wishlistRef = ref(db, `Wishlist/${userId}/${serviceId}`);
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
      setIsWishlisted(true);
    }
  };

  const handleWishlistToggle = () => {
    if (!userId) {
      Alert.alert("Login Required", "You must be logged in to add to wishlist.");
      return;
    }

    const wishlistRef = ref(db, `Wishlist/${userId}/${serviceId}`);

    if (isWishlisted) {
      set(wishlistRef, null); // Remove from wishlist
      setIsWishlisted(false);
    } else {
      set(wishlistRef, {
        name: serviceData.name,
        imageUrl: serviceData.imageUrl,
        address: serviceData.address,
        id: serviceId,
        designId: designId,
        timings: serviceData.timings,
      });
      setIsWishlisted(true);
    }
  };
  console.log("designId:", serviceId); 

  if (loading) {
    return (
      <View style={styles.containerred}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonItem width={30} height={30} />
          <SkeletonItem width="60%" height={24} style={{ marginLeft: 20 }} />
          <View style={{ width: 30 }} />
        </View>
  
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {designId === 'design1' && renderDesign1Skeleton()}
          {designId === 'design2' && renderDesign2Skeleton()}
          {designId === 'design3' && renderDesign3Skeleton()}
          {designId === 'design4' && renderDesign4Skeleton()}
        </ScrollView>
  
        {/* Bottom Nav Skeleton */}
        <View style={styles.bottomNav}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.navItem}>
              <SkeletonItem width={24} height={24} />
              <SkeletonItem width={40} height={12} style={{ marginTop: 5 }} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  
  if (!serviceData) {
    return <Text style={styles.noData}>Service details not found.</Text>;
  }

  return (
    <View style={styles.containerred}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{serviceData.name}</Text>
        <View style={styles.emptyView}></View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {designId === 'design1' ? (
          <View style={styles.content}>
            {/* Image and Info Container */}
                    <ScrollView contentContainerStyle={styles.containerr}>
                      <View style={styles.infoCard}>
                        <Image source={{ uri: serviceData.imageUrl }} style={styles.image} cachePolicy="disk" priority="high" />
                        <View style={styles.infoContainer}>
                          <Text style={[styles.infoTextt, styles.boldText]}>{serviceData.name}</Text>
                          <TouchableOpacity onPress={handleWishlistToggle}>
                            <AntDesign name={isWishlisted ? "heart" : "hearto"} size={24} color={isWishlisted ? "red" : "gray"} />
                          </TouchableOpacity>
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
                        {tagline ? (<Text style={styles.tagline}>{tagline}</Text>) : null}
            
                      {/* Specialist Scroll View */}
                      <ScrollView style={styles.specialistScrollContainer}>
                        {Array.isArray(serviceData.specialists) &&
                          serviceData.specialists.map((specialist, index) => (
                            <View key={index} style={styles.specialistCard}>
                              <View style={styles.specialistContent}>
                                <Image source={{ uri: specialist.imageUrl || serviceData.imageUrl }} style={styles.specialistImage} cachePolicy="disk" priority="high" />
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
          </View>
        ) : designId === 'design2' ? (
          <View style={styles.content}>
                        {/* Image and Info Container */}
                        <ScrollView contentContainerStyle={styles.containerr}>
                          <View style={styles.infoCard}>
                            <Image source={{ uri: serviceData.imageUrl }} style={styles.image} cachePolicy="disk" priority="high" />
                            <View style={styles.infoContainer}>
                              <Text style={[styles.infoTextt, styles.boldText]}>{serviceData.name}</Text>
                              <TouchableOpacity onPress={handleWishlistToggle}>
                            <AntDesign name={isWishlisted ? "heart" : "hearto"} size={24} color={isWishlisted ? "red" : "gray"} />
                          </TouchableOpacity>
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
                        {tagline ? (<Text style={styles.tagline}>{tagline}</Text>) : null}
            
                          {/* New Mobile Products Section */}
                          <View style={styles.productsGrid}>
                            {serviceData?.products?.map((product, index) => (
                              <View key={index} style={styles.productCard}>
                                {/* Product Image */}
                                <Image source={{ uri: product.imageUrl }} style={styles.productImage} cachePolicy="disk" priority="high" />
            
                                {/* Mobile Name */}
                                <Text style={styles.productName}>{product.name}</Text>
            
                                {/* Product Cost */}
                                <Text style={styles.productCost}>₹ {product.cost}</Text>
            
                                {/* Buy Now Button */}
                                <View style={styles.buttonContainer}>
                                  <TouchableOpacity style={styles.buyButton} onPress={handleButtonPress}>
                                    <Text style={styles.buyButtonText}>Buy Now</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </View>                        
            
                          
                        </ScrollView>
          </View>
        ) : designId === 'design3' ? (
          <View style={styles.content}>
           {/* Image and Info Container */}
                       <ScrollView contentContainerStyle={styles.containerr}>
                         <View style={styles.infoCard}>
                           <Image source={{ uri: serviceData.imageUrl }} style={styles.image} cachePolicy="disk" priority="high" />
                           <View style={styles.infoContainer}>
                             <Text style={[styles.infoTextt, styles.boldText]}>{serviceData.name}</Text>
                             <TouchableOpacity onPress={handleWishlistToggle}>
                                <AntDesign name={isWishlisted ? "heart" : "hearto"} size={24} color={isWishlisted ? "red" : "gray"} />
                              </TouchableOpacity>
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
                        {tagline ? (<Text style={styles.tagline}>{tagline}</Text>) : null}
           
                         {/* Product Scroll View */}
                         <ScrollView style={styles.specialistScrollContainer}>
                           {Array.isArray(serviceData.products) &&
                             serviceData.products.map((product, index) => (
                               <View key={index} style={styles.specialistCard}>
                                 <View style={styles.specialistContent}>
                                   <Image source={{ uri: product.imageUrl || serviceData.imageUrl }} style={styles.specialistImage} cachePolicy="disk" priority="high"  />
                                   <View style={styles.specialistTextContainer}>
                                     <Text style={styles.specialistTextM}>{product.name || 'N/A'}</Text>
                                     <Text style={styles.specialistTextS}>{product.specialty || 'General'}</Text>
                                   </View>
                                 </View>
                                 {/* Separator Line */}
                                 {index < serviceData.products.length - 1 && (
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
          </View>
        ) : designId === 'design4' ? (
          <View style={styles.content}>
            {/* Image and Info Container */}
                      <ScrollView contentContainerStyle={styles.containerr}>
                        <View style={styles.infoCard}>
                          <Image source={{ uri: serviceData.imageUrl }} style={styles.image} cachePolicy="disk" priority="high" />
                          <View style={styles.infoContainer}>
                            <Text style={[styles.infoTextt, styles.boldText]}>{serviceData.name}</Text>
                            <TouchableOpacity onPress={handleWishlistToggle}>
                              <AntDesign name={isWishlisted ? "heart" : "hearto"} size={24} color={isWishlisted ? "red" : "gray"} />
                            </TouchableOpacity>
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
                        {tagline ? (<Text style={styles.tagline}>{tagline}</Text>) : null}

            
                        {/* Experts Section */}
                        <View style={styles.ServiceContainer}>
                          {serviceData?.experts?.map((expert, index) => (
                            <View 
                              style={[
                                styles.ServiceRow,
                                index % 2 === 1 ? { borderRightWidth: 0 } : null, // Remove right border for last items in each row
                              ]}
                              key={index}
                            >
                              <View style={styles.column}>
                                <Image source={{ uri: expert.imageUrl }} style={styles.ServiceImage} cachePolicy="disk" priority="high" />
                                <Text style={styles.ServiceName}>{expert.name}</Text>
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
          </View>
        ) : (
          <Text style={styles.noData}>Invalid design or no content available.</Text>
        )}
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.bottomNav}>
        <NavIcon title="Home" iconSource={require('../assets/home.png')} onPress={() => navigation.navigate('Home')} />
        <NavIcon title="Notifications" iconSource={require('../assets/bell.png')} onPress={() => navigation.navigate('Notifications')} />
        <NavIcon title="Offers" iconSource={require('../assets/offer.png')} onPress={() => navigation.navigate('Offers')} />
        <NavIcon title="Favorites" iconSource={require('../assets/heart.png')} onPress={() => navigation.navigate('Favorites')} />
      </View>
    </View>
  );
};

const NavIcon = ({ title, iconSource, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Image source={iconSource} style={styles.navIcon} cachePolicy="disk" priority="high" />
    <Text style={styles.navText}>{title}</Text>
  </TouchableOpacity>
);

export default ServiceDetails;

const styles = StyleSheet.create({
  containerred: {
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
  specialistTextM: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
  },
  specialistTextS: {
    fontSize: 14,
    color: '#636262'
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
    marginTop: 10,
    alignItems: 'center',
    marginBottom:70,
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
  ServiceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
    
  ServiceRow: {
    width: '50%',
    padding: 10, // Padding around each order
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingRight: 15, // Padding to right separator
    paddingBottom: 15, // Padding to bottom separator
  },
  
  column: {
    alignItems: 'center',
    padding: 10, // Additional padding within each column item
  },
  
  ServiceImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  
  ServiceName: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  // ... (keep all your existing styles)
  skeletonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  skeletonContent: {
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});