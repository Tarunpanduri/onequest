import React, { useState, useEffect } from 'react';
import { View, Platform, Text, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth to get current user
import { app } from './firebaseConfig'; // Import Firebase config

const SelectAddress = () => {
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]); // Initialize an empty array for addresses
  const [loading, setLoading] = useState(true); // Loading state to handle data fetching
  const [userId, setUserId] = useState(null); // State to store userId dynamically

  // Fetch current user's ID using Firebase Authentication
  useEffect(() => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid); // Set user ID dynamically
    } else {
      console.error("User is not authenticated");
    }
  }, []);

  // Fetch addresses from Firebase when the component mounts
  useEffect(() => {
    if (!userId) return; // Don't fetch addresses until the user ID is available

    const db = getDatabase(app);
    const addressesRef = ref(db, `users/${userId}/addresses`);

    const unsubscribe = onValue(addressesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const addressList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAddresses(addressList);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [userId]); // Re-run effect when userId changes

  const handleSelectAddress = (id) => {
    setSelectedAddress(id);
  };

  const handleSaveSelectedAddress = async () => {
    if (!selectedAddress) return;

    const selectedAddressData = addresses.find((address) => address.id === selectedAddress);

    if (!selectedAddressData) return;

    try {
      const db = getDatabase(app);
      await set(ref(db, `SavedUsers/${userId}/SavedAddress`), selectedAddressData);
      console.log('Address successfully saved');
      alert('Address saved successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving address:', error);
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
        <Text style={styles.heading}>Address</Text>
        <View style={styles.emptyView}></View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {loading ? (
          <Text style={styles.noData}>Loading...</Text>
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressContainer,
                selectedAddress === address.id && styles.selectedContainer,
              ]}
              onPress={() => handleSelectAddress(address.id)}
            >
              {/* Top Section with Radio Button and User */}
              <View style={styles.topSection}>
                <View style={styles.radioButton}>
                  {selectedAddress === address.id && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.userText}>User: {address.UserName}</Text>
              </View>

              {/* Horizontal Separator */}
              <View style={styles.separator} />

              {/* Address Details Section */}
              <View style={styles.addressDetails}>
                <Text style={styles.addressLabel}>Location:</Text>
                <Text style={styles.addressText}>{address.name}</Text>

                <Text style={styles.addressLabel}>Address:</Text>
                <Text style={styles.addressText}>{address.address}</Text>

                <Text style={styles.addressLabel}>Area:</Text>
                <Text style={styles.addressText}>{address.area}</Text>

                <Text style={styles.addressLabel}>City:</Text>
                <Text style={styles.addressText}>{address.city}</Text>

                <Text style={styles.addressLabel}>Phone:</Text>
                <Text style={styles.addressText}>{address.contactNumber}</Text>

                <Text style={styles.addressLabel}>Work Type:</Text>
                <Text style={styles.addressText}>{address.WorkType}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noData}>No addresses available</Text>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.addButton,
            selectedAddress ? styles.addButtonSmall : styles.addButtonFull,
          ]}
          onPress={() => navigation.navigate('ma')}
        >
          <Text style={styles.addButtonText}>+ Add New Address</Text>
        </TouchableOpacity>

        {selectedAddress && (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSaveSelectedAddress}
          >
            <Text style={styles.selectButtonText}>Select Address</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SelectAddress;

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
  backIcon: { width: 30, height: 30, tintColor: '#ffffff' },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', flex: 1, paddingLeft: 20 },
  emptyView: { width: 30 },
  container: { flex: 1, paddingHorizontal: 15 },
  addressContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedContainer: {
    borderColor: '#009688',
    borderWidth: 2,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#009688',
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  addressDetails: {
    marginTop: 8,
  },
  addressLabel: {
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 12,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#009688',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  addButtonFull: {
    flex: 1,
  },
  addButtonSmall: {
    flex: 0.5,
    marginRight: 8,
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#009688',
    padding: 12,
    borderRadius: 4,
    flex: 0.5,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    marginTop: 50,
  },
});
