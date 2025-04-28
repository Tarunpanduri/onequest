import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Back Navigation Icon */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="First Name" />
          <TextInput style={styles.input} placeholder="Last Name" />
          <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />
        </View>

        {/* Change Button */}
        <TouchableOpacity style={styles.changeButton}>
          <Text style={styles.changeButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
  },
  navBar: {
    paddingTop: Platform.OS === 'ios' ? 40 : 25,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  formContainer: {
    marginTop: 70,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
    paddingLeft: 10,
  },
  changeButton: {
    marginTop: 20,
    backgroundColor: '#ff6f01',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default EditProfileScreen;
