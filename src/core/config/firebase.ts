// src/core/firebase.ts
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// ✅ En RNFirebase no necesitas firebaseConfig ni initializeApp.
// Se configura con google-services.json (Android) y GoogleService-Info.plist (iOS).

export const authRN = auth();       // instancia de Firebase Auth
export const db = firestore();      // instancia de Firestore
export const storageRN = storage(); // instancia de Storage
