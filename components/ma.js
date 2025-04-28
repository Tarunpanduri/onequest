import React, { useState, useRef } from "react";
import {
  View,
  Platform,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from './firebaseConfig';
import { ref, set } from "firebase/database"; // <-- Correct way!

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AutocompleteMapScreen = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const [name, setName] = useState(""); // User's Name input state
  const [contact, setContact] = useState(""); // User's Contact Number input state
  const [workType, setWorkType] = useState(""); // State for Work Type

  const API_KEY = "AIzaSyA2JCMgl2RXOSgjPkObbvNcC8vR3yoy5qU"; // Replace with your Google Maps API key

  // Reverse Geocode: Get full address based on latitude and longitude
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const data = await response.json();

      console.log("Full API Response:", JSON.stringify(data, null, 2)); // Log the full response

      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const formattedAddress = data.results[0].formatted_address;

        let city = '';
        let area = '';

        // Extract city and area from address_components
        addressComponents.forEach((component) => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('sublocality')) {
            area = component.long_name;
          } else if (component.types.includes('neighborhood') && !area) {
            area = component.long_name;
          } else if (component.types.includes('administrative_area_level_2') && !area) {
            area = component.long_name;
          }
        });

        // Fallback to formatted_address if city or area is missing
        if (!city || !area) {
          const parts = formattedAddress.split(',');
          if (parts.length >= 3) {
            if (!city) {
              city = parts[parts.length - 2].trim();
            }
            if (!area) {
              area = parts[parts.length - 3].trim();
            }
          }
        }

        return {
          address: formattedAddress,
          city: city || "City not found",
          area: area || "Area not found",
        };
      } else {
        return { address: "Address not found", city: "City not found", area: "Area not found" };
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return { address: "Error fetching address", city: "City not found", area: "Area not found" };
    }
  };

  // Fetch suggestions from Google Maps Places API
  const fetchSuggestions = async (input) => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${API_KEY}`
      );
      const data = await response.json();

      console.log("Autocomplete API Response:", data); // Debug: Log the autocomplete response

      if (data && data.predictions) {
        console.log("Suggestions:", data.predictions); // Debug: Log fetched suggestions
        setSuggestions(data.predictions); // Update suggestions list
      } else {
        Alert.alert("No results found", "No locations found for your search.");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      Alert.alert("Error", "Something went wrong while fetching suggestions.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch coordinates (latitude and longitude) and address from Google Maps API
  const fetchCoordinates = async (placeId) => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
      );
      const data = await response.json();

      console.log("Place Details API Response:", data); // Debug: Log the place details response

      if (data && data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        const placeName = data.result.name || "Unknown Place";
        const formattedAddress = data.result.formatted_address || "No address available";

        // Reverse geocode to get city and area
        const { city, area } = await reverseGeocode(lat, lng);

        setSelectedPlace({
          lat,
          lng,
          name: placeName,
          address: formattedAddress,
          city, // Add city
          area, // Add area
        });

        // Move the map to the selected location
        moveToRegion(lat, lng);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      Alert.alert("Error", "Unable to fetch coordinates for the selected place.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Move the map to the selected location
  const moveToRegion = (latitude, longitude) => {
    console.log("Moving map to:", { latitude, longitude });
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  // Get current location and address
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log("Current Location Coordinates:", { latitude, longitude });

      // Reverse geocode to get address, city, and area
      const { address, city, area } = await reverseGeocode(latitude, longitude);

      setSelectedPlace({
        lat: latitude,
        lng: longitude,
        name: address.split(",")[0] || "Unknown Place",
        address,
        city, // Add city
        area, // Add area
      });

      moveToRegion(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Unable to fetch your current location.");
    } finally {
      setLoading(false);
    }
  };

  // Handle map press
  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    // Reverse geocode to get address, city, and area
    const { address, city, area } = await reverseGeocode(latitude, longitude);

    setSelectedPlace({
      lat: latitude,
      lng: longitude,
      name: address.split(",")[0] || "Unknown Place",
      address,
      city, // Add city
      area, // Add area
    });

    moveToRegion(latitude, longitude);
  };

  // Handle confirm location
  const handleConfirmLocation = async () => {
    if (selectedPlace && name && contact && workType) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const { address, city, area } = selectedPlace;

          const addressData = {
            latitude: selectedPlace.lat,
            longitude: selectedPlace.lng,
            name: selectedPlace.name,
            address: address || "",
            city: city || "City not found",
            area: area || "Area not found",
            UserName: name,
            contactNumber: contact,
            WorkType: workType,
            userId: userId,
          };

          // Store the address data in Firebase
          await set(ref(database, `users/${userId}/addresses/${new Date().getTime()}`), addressData);
          Alert.alert("Success", "Address and details saved successfully!");
          navigation.goBack();
        } else {
          Alert.alert("Error", "User not logged in.");
        }
      } catch (error) {
        console.error("Error saving address:", error);
        Alert.alert("Error", "Failed to save address and details.");
      }
    } else {
      Alert.alert("Missing Fields", "Please fill in all the fields.");
    }
  };

  // Show live location on map
  const showLiveLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access location was denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log("Live Location Coordinates:", { latitude, longitude });

      moveToRegion(latitude, longitude);
    } catch (error) {
      console.error("Error getting live location:", error);
      Alert.alert("Error", "Unable to fetch your live location.");
    }
  };

  // Clear the input field and suggestions after selection
  const handleSuggestionSelect = (item) => {
    setQuery(item.description);
    setSuggestions([]);
    fetchCoordinates(item.place_id);
    Keyboard.dismiss(); // Dismiss keyboard after selection
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar barStyle="light-content" backgroundColor="#009688" translucent={true} />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Select Address Location</Text>
          <View style={styles.emptyView}></View>
        </View>

        {/* Map */}
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {selectedPlace && (
            <Marker
              coordinate={{
                latitude: selectedPlace.lat,
                longitude: selectedPlace.lng,
              }}
              title={selectedPlace.name || "Selected Place"}
            />
          )}
        </MapView>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for a location"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (text.length > 2) fetchSuggestions(text);
            }}
          />
          {loading && <ActivityIndicator size="small" color="#009688" />}
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              style={styles.suggestion}
              onPress={() => handleSuggestionSelect(item)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Live Location Button */}
        <TouchableOpacity
          style={styles.liveLocationImageButton}
          onPress={showLiveLocation}
        >
          <Image
            source={require("../assets/llaa.png")} // Replace with your custom image
            style={styles.liveLocationImage}
          />
        </TouchableOpacity>

        {/* Use Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Use Current Location</Text>
          )}
        </TouchableOpacity>

        {/* Location Details Container */}
        {selectedPlace && (
          <View style={styles.detailsContainer}>
            <View style={styles.placeDetailsRow}>
              <Image
                source={require("../assets/ll.png")}
                style={styles.locationIcon}
              />
              <Text style={styles.placeName}>
                {selectedPlace.name || "Unknown Place"}
              </Text>
            </View>
            <Text style={styles.placeAddress}>
              {selectedPlace.address || "No address available"}
            </Text>

            {/* User's Contact Number Input Field */}
            <TextInput
              style={styles.inputt}
              placeholder="Enter your Contact Number"
              value={contact}
              onChangeText={(text) => setContact(text)}
              keyboardType="phone-pad"
            />

            {/* User's Name Input Field */}
            <TextInput
              style={styles.inputt}
              placeholder="Enter your Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            {/* Work Type Selectable Buttons */}
            <View style={styles.workTypeContainer}>
              {["Home", "Work", "Others"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.workTypeButton,
                    workType === type && styles.selectedButton,
                  ]}
                  onPress={() => setWorkType(type)}
                >
                  <Text style={styles.workTypeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
              <Text style={styles.confirmButtonText}>Confirm Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#009688",
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 22 : 70,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: "#ffffff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    paddingLeft: 10,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 130,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputt: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10, // Added margin for spacing
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  liveLocationButton: {
    position: "absolute",
    bottom: 80, // Adjusted for the space
    left: 10,
    right: 10,
    backgroundColor: "#00796b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    position: "absolute",
  },
  liveLocationImageButton: {
    position: "absolute",
    top: 175, // Adjust to place the image button below the search bar
    left: "92%",
    transform: [{ translateX: -25 }],
  },
  liveLocationImage: {
    width: 50,
    height: 50, // Adjust size as needed
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  placeDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 15 : 8,
  },
  locationIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
    marginBottom: 5,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  placeAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    marginBottom: Platform.OS === "ios" ? 25 : 15,
  },
  workTypeContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  workTypeButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: "center",
  },
  selectedButton: { backgroundColor: "#009688" },
  workTypeText: { color: "#000" },
  confirmButton: {
    backgroundColor: "#009688",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AutocompleteMapScreen;