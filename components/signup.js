import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth } from './firebaseConfig'; // Ensure firebaseConfig.js is set up correctly

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);

const handleSignUp = async (firstName, lastName, email, phone, password, confirmPassword, navigation, setError) => {
  if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
    setError('All fields are required.');
    return;
  }
  if (!validateEmail(email)) {
    setError('Please enter a valid email address.');
    return;
  }
  if (!validatePhone(phone)) {
    setError('Phone number must be 10 digits.');
    return;
  }
  if (!validatePassword(password)) {
    setError('Password must be at least 6 characters long and include letters, numbers, and a special character.');
    return;
  }
  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  try {
    setError('');
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User created:', user);

    // Store user data in Firebase Realtime Database
    const db = getDatabase();
    const userRef = ref(db, `registeredUsers/${user.uid}`);
    
    const userData = {
      userId: user.uid,  // Save userId as well
      firstName,
      lastName,
      email,
      phone,
      createdAt: new Date().toISOString(),
    };

    await set(userRef, userData)
      .then(() => {
        console.log('User data saved successfully');
        navigation.replace('login'); // Redirect to login screen
      })
      .catch((dbError) => {
        console.error('Error saving user data:', dbError);
        setError('Failed to save user data. Please try again.');
      });

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      setError('User already exists with this email.');
    } else if (error.code === 'auth/weak-password') {
      setError('The password is too weak.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
    console.error('Signup error:', error);
  }
};

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const isFormValid =
    firstName &&
    lastName &&
    email &&
    phone &&
    password &&
    password === confirmPassword &&
    validateEmail(email) &&
    validatePhone(phone) &&
    validatePassword(password);

  return (
    <View style={styles.container} behavior="padding">


        <View style={styles.avatarContainer}>
          <Image source={require('../assets/proff.png')} style={styles.avatar} />
        </View>
        <Text style={styles.title}>Create Your Account</Text>
      
      <ScrollView contentContainerStyle={styles.scrollView}>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="First Name"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Last Name"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.passwordToggle}
          >
            <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={styles.passwordToggle}
          >
            <Ionicons name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.disabledButton]}
          onPress={() =>
            handleSignUp(firstName, lastName, email, phone, password, confirmPassword, navigation, setError)
          }
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('login')}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c9d92',
    padding: 16,
    paddingTop: 110,
  },
  scrollView: {
    alignItems: 'center',
    top:0
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '600',
    marginVertical: 20,
    textAlign:'center'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    
  },
  nameInput: {
    width: '48%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    color: '#FFA500',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
