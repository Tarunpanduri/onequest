import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '549898333490-tt9aeq5b3aupb5g1tjje2o3shh1a7b3k.apps.googleusercontent.com',
    iosClientId: '549898333490-2l7413kfui3tt10935umreji6kbu4gqr.apps.googleusercontent.com',
    androidClientId: '549898333490-5n0cmi208lkcqbnig8q4ujckcdkbt2gt.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('User signed in with Google:', userCredential.user);
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error('Firebase Google Sign-In error:', error);
          setError('Google Sign-In failed.');
        });
    }
  }, [response]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
      if (isLoggedIn === 'true') {
        navigation.navigate('Home');
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      await SecureStore.setItemAsync('isLoggedIn', 'true');
      await SecureStore.setItemAsync('email', email);

      if (rememberMe) {
        await SecureStore.setItemAsync('password', password);
      } else {
        await SecureStore.deleteItemAsync('password');
      }

      setError('');
      navigation.navigate('Home');
    } catch (err) {
      console.error('Login failed:', err.message);
      setError('Invalid email or password.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: '#2c9d92' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={[styles.container, { backgroundColor: '#2c9d92' }]}>
            <View style={styles.header}>
              <Image source={require('../assets/proff.png')} style={styles.avatar} />
              <Text style={styles.appName}>ONE QUEST</Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError('')}>
                  <Ionicons name="close-circle" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.toggleVisibility}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <Text style={styles.checkboxLabel}>Remember me</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or sign in with</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity style={styles.iconRow} onPress={() => promptAsync()}>
                <Ionicons name="logo-google" size={40} color="#db4a39" style={styles.icon} />
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    paddingTop: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 16,
  },
  appName: {
    marginTop:10,
    fontSize: 20,
    color: '#FFA30F',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  passwordContainer: {
    position: 'relative',
  },
  toggleVisibility: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    color: '#fff',
  },
  forgotPassword: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#FFA30F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    marginHorizontal: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#fff',
  },
  signupLink: {
    fontWeight: 'bold',
    color: '#FFA30F',
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#ffcccc',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    flex: 1,
    marginRight: 10,
  },
});









// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import * as SecureStore from 'expo-secure-store';
// import { auth } from './firebaseConfig';
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import * as AuthSession from 'expo-auth-session';
// import { Ionicons } from '@expo/vector-icons';
// import { Checkbox } from 'react-native-paper';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [error, setError] = useState('');
//   const navigation = useNavigation();

//   // Check if the user is already logged in (on mount)
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       const storedEmail = await SecureStore.getItemAsync('email');
//       const storedPassword = await SecureStore.getItemAsync('password');
//       const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
//       console.log('isLoggedIn status:', isLoggedIn); // Debugging log
//       if (isLoggedIn === 'true') {
//         navigation.navigate('Home');
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in:', userCredential.user);

//       // Save login status
//       await SecureStore.setItemAsync('isLoggedIn', 'true');
//       await SecureStore.setItemAsync('email', email);

//       if (rememberMe) {
//         await SecureStore.setItemAsync('password', password);
//       } else {
//         await SecureStore.deleteItemAsync('password');
//       }

//       setError('');
//       navigation.navigate('Home'); // Navigate to the Home screen
//     } catch (err) {
//       console.error('Login failed:', err.message);
//       setError('Invalid email or password.');
//     }
//   };



//   const handleGoogleSignIn = async () => {
//     try {
//       // Step 1: Log the redirect URL
//       const redirectUrl = AuthSession.getRedirectUrl();
//       console.log('Redirect URL:', redirectUrl);  // Debugging: Check if it's valid
  
//       // Step 2: Define your Web Client ID
//       const clientId = '549898333490-tt9aeq5b3aupb5g1tjje2o3shh1a7b3k.apps.googleusercontent.com';  // Replace with your Firebase Web Client ID
//       const authUrl = https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=token&scope=profile;
  
//       // Step 3: Log the auth URL
//       console.log('Auth URL:', authUrl);  // Debugging: Check if the URL is correctly formed
  
//       // Step 4: Start the Auth session
//       const result = await AuthSession.startAsync({ authUrl });
  
//       // Step 5: Log the result to see if there's an issue
//       console.log('Auth result:', result);  // Debugging: Check if the result is returned
  
//       // Step 6: Handle success or failure
//       if (result.type === 'success') {
//         const { id_token } = result.params;
//         console.log('Received ID Token:', id_token);  // Log the received ID token
  
//         // Create Firebase credential with the ID token
//         const credential = GoogleAuthProvider.credential(id_token);
  
//         // Step 7: Sign in to Firebase with the credential
//         const userCredential = await signInWithCredential(auth, credential);
//         console.log('User signed in with Google:', userCredential.user);
  
//         // Navigate to home screen
//         navigation.navigate('Home');
//       } else {
//         // Log if the result type is not success
//         console.log('Auth failed or user canceled');
//         setError('Google Sign-In failed.');
//       }
//     } catch (error) {
//       console.error('Google Sign-In error:', error);
//       setError('An error occurred during Google Sign-In.');
//     }
//   };
  


//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: '#2c9d92' }}>
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView contentContainerStyle={[styles.container, { backgroundColor: '#2c9d92' }]}>
//             <View style={styles.header}>
//               <Image source={require('../assets/proff.png')} style={styles.avatar} />
//               {/* <Text style={styles.welcomeText}>Welcome to</Text> */}
//               <Text style={styles.appName}>ONE QUEST</Text>
//             </View>

//             {error ? (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity onPress={() => setError('')}>
//                   <Ionicons name="close-circle" size={20} color="red" />
//                 </TouchableOpacity>
//               </View>
//             ) : null}

//             <View style={styles.form}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 placeholderTextColor="#666"
//                 value={email}
//                 onChangeText={setEmail}
//                 accessibilityLabel="Email Input"
//               />

//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Password"
//                   placeholderTextColor="#666"
//                   secureTextEntry={!passwordVisible}
//                   value={password}
//                   onChangeText={setPassword}
//                   accessibilityLabel="Password Input"
//                 />
//                 <TouchableOpacity
//                   style={styles.toggleVisibility}
//                   onPress={() => setPasswordVisible(!passwordVisible)}
//                 >
//                   <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#666" />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.row}>
//                 <View style={styles.checkboxContainer}>
//                   <Checkbox
//                     status={rememberMe ? 'checked' : 'unchecked'}
//                     onPress={() => setRememberMe(!rememberMe)}
//                     style={styles.checkbox}
//                   />
//                   <Text style={styles.checkboxLabel}>Remember me</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.forgotPassword}>Forgot password?</Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity style={styles.button} onPress={handleLogin}>
//                 <Text style={styles.buttonText}>Log in</Text>
//               </TouchableOpacity>

//               <View style={styles.dividerContainer}>
//                 <View style={styles.divider} />
//                 <Text style={styles.dividerText}>Or sign in with</Text>
//                 <View style={styles.divider} />
//               </View>

//               <View style={styles.iconRow} onPress={handleGoogleSignIn}>
//                 <TouchableOpacity>
//                   <Ionicons name="logo-google" size={40} color="#db4a39" style={styles.icon} />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.signupContainer}>
//                 <Text style={styles.signupText}>Don't have an account? </Text>
//                 <TouchableOpacity onPress={() => navigation.navigate('signup')}>
//                   <Text style={styles.signupLink}>Sign Up</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default LoginPage;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     alignItems: 'center',
//     padding: 16,
//     paddingTop: 120,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   welcomeText: {
//     fontSize: 24,
//     color: '#fff',
//     marginTop: 16,
//   },
//   appName: {
//     marginTop:10,
//     fontSize: 20,
//     color: '#FFA30F',
//     fontWeight: 'bold',
//   },
//   form: {
//     width: '100%',
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   passwordContainer: {
//     position: 'relative',
//   },
//   toggleVisibility: {
//     position: 'absolute',
//     right: 10,
//     top: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   checkbox: {
//     marginRight: 8,
//   },
//   checkboxLabel: {
//     color: '#fff',
//   },
//   forgotPassword: {
//     color: '#fff',
//   },
//   button: {
//     backgroundColor: '#FFA30F',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#fff',
//   },
//   dividerText: {
//     color: '#fff',
//     marginHorizontal: 8,
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   icon: {
//     marginHorizontal: 20,
//   },
//   signupContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   signupText: {
//     color: '#fff',
//   },
//   signupLink: {
//     fontWeight: 'bold',
//     color: '#FFA30F',
//     marginLeft: 4,
//   },
//   errorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     backgroundColor: '#ffcccc',
//     padding: 10,
//     borderRadius: 5,
//   },
//   errorText: {
//     color: 'red',
//     flex: 1,
//     marginRight: 10,
//   },
// });