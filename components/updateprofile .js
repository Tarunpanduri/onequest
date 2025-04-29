import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, get, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { app } from "./firebaseConfig"; // Ensure firebaseConfig.js is correctly set up

const db = getDatabase(app);
const auth = getAuth(app);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user]);

  // Fetch user data from Realtime Database
  const fetchUserData = async (userId) => {
    try {
      const userRef = ref(db, `registeredUsers/${userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setEmail(userData.email || '');
        setPhone(userData.phone || '');
        setDob(userData.dob ? new Date(userData.dob) : new Date());
        setGender(userData.gender || '');
      } else {
        console.log("No user data found. Creating new entry...");
        createNewUser(userId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new user entry if no data is found
  const createNewUser = async (userId) => {
    try {
      const newUser = {
        firstName: '',
        lastName: '',
        email: user.email,
        phone: '',
        dob: dob.toISOString(),
        gender: ''
      };
      await set(ref(db, `registeredUsers/${userId}`), newUser);
      console.log("New user entry created.");
    } catch (error) {
      console.error("Error creating new user:", error);
    }
  };

  // Handle Date Change
  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  // Update User Profile
  const updateProfile = async () => {
    try {
      const userId = user.uid;
      await update(ref(db, `registeredUsers/${userId}`), {
        firstName,
        lastName,
        phone,
        dob: dob.toISOString(),
        gender,
      });
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate('profile'); // Navigate back to Profile.js
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

    // Copy User ID to Clipboard
    const copyUserIdToClipboard = async () => {
      if (user?.uid) {
        await Clipboard.setStringAsync(user.uid);
      Alert.alert("Copied!", "Code copied to clipboard.");
      }
    };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 , backgroundColor: '#009688'}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            {/* Header with Profile Image */}
            <View style={styles.header}>
              <View style={styles.profileContainer}>
                <Image source={require('../assets/proff.png')} style={styles.profileImage} />
              </View>
            </View>




            {/* Form Inputs */}
            <View style={styles.form}>
              {/* User ID Section */}
              <View style={styles.userIdContainer}>
                <Text style={styles.userIdLabel}>User ID:</Text>
                <Text style={styles.userIdText}>{auth.currentUser?.uid}</Text>
                <TouchableOpacity onPress={copyUserIdToClipboard} style={styles.copyButton}>
                  <Image source={require('../assets/copyy.png')} style={styles.copyButtonimg} />
                </TouchableOpacity>
              </View>



              <Text style={styles.label}>First Name</Text>
              <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

              <Text style={styles.label}>Last Name</Text>
              <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={email} editable={false} />

              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
                <Text >{dob.toDateString()}</Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              <Text style={styles.label}>Phone</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={gender} onValueChange={setGender}>
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Not Specified" value="Not Specified" />
                </Picker>
              </View>

              {/* Update Profile Button */}
              <TouchableOpacity style={styles.button} onPress={updateProfile}>
                <Text style={styles.buttonText}>UPDATE PROFILE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#white',
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 180,
    backgroundColor: '#009688',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'absolute',
    bottom: -50,
    width: 130,
    height: 130,
    borderRadius: 50,
    backgroundColor: '#D3D3D3',
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userIdContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  alignSelf: 'center',
  paddingHorizontal:2
},
userIdLabel: {
  fontSize: 15,
  color: 'black',
  fontWeight: 'bold',
},
userIdText: {
  fontSize: 15,
  color: '#009688',
  marginLeft: 5,
},
copyButton: {
  marginLeft: 10,
  backgroundColor: '#009688',
  paddingHorizontal: 5,
  paddingVertical: 2,
  borderRadius: 5,
},
copyButtonimg: {
width:10,
height:20,

},
  form: {
    marginTop: 60,
    paddingHorizontal: 20,
    gap: Platform.OS === 'ios' ? 6:0
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 8:5,
    color: 'black',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#009688',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom:30
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;



