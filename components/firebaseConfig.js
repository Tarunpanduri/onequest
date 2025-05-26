// import { initializeApp } from 'firebase/app';


// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getDatabase } from 'firebase/database';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Your Firebase configuration
// export const firebaseConfig = {
//   apiKey: "AIzaSyAy_Lf6WnljttOxnjsdnHeJlk-hZsEKQJU",
//   authDomain: "onequestt.firebaseapp.com",
//   databaseURL: "https://onequestt-default-rtdb.firebaseio.com/",
//   projectId: "onequestt",
//   storageBucket: "onequestt.appspot.com",
//   messagingSenderId: "549898333490",
//   appId: "1:549898333490:web:a22f4b6e94176b11f33b2b",
//   measurementId: "G-YSTMPQZEEE"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase services
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
// const db = getFirestore(app);
// const storage = getStorage(app);
// const database = getDatabase(app);

// export { app, auth, db, storage, database };



// // Initialize Firebase with the config
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// } else {
//   firebase.app(); // if already initialized
// }





// import { initializeApp } from 'firebase/app';


// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getDatabase } from 'firebase/database';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Your Firebase configuration
// export const firebaseConfig = {
//   apiKey: "AIzaSyAy_Lf6WnljttOxnjsdnHeJlk-hZsEKQJU",
//   authDomain: "onequestt.firebaseapp.com",
//   databaseURL: "https://onequestt-default-rtdb.firebaseio.com/",
//   projectId: "onequestt",
//   storageBucket: "onequestt.appspot.com",
//   messagingSenderId: "549898333490",
//   appId: "1:549898333490:web:a22f4b6e94176b11f33b2b",
//   measurementId: "G-YSTMPQZEEE"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase services
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
// const db = getFirestore(app);
// const storage = getStorage(app);
// const database = getDatabase(app);

// export { app, auth, db, storage, database };


// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAy_Lf6WnljttOxnjsdnHeJlk-hZsEKQJU",
  authDomain: "onequestt.firebaseapp.com",
  databaseURL: "https://onequestt-default-rtdb.firebaseio.com/",
  projectId: "onequestt",
  storageBucket: "onequestt.appspot.com",
  messagingSenderId: "549898333490",
  appId: "1:549898333490:web:a22f4b6e94176b11f33b2b",
  measurementId: "G-YSTMPQZEEE"
};

// Only initialize if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// IMPORTANT: Use this guard to avoid crashing during SSR or wrong engine
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // This avoids the "Component auth has not been registered yet" crash
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, auth, db, storage, database };
