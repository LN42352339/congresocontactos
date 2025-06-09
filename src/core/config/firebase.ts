// src/core/firebase.ts
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDsAtvXK608p-qsJr6h5eukwNKcd0gsKYE',
  authDomain: 'gestioncontactos-a145c.firebaseapp.com',
  projectId: 'gestioncontactos-a145c',
  storageBucket: 'gestioncontactos-a145c.appspot.com',
  messagingSenderId: '526517937231',
  appId: '1:526517937231:web:2d45f0f12754d0d8e8b63a',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app); // ⬅️ Usa solo este
export const db = getFirestore(app);
export const storage = getStorage(app);
