// src/core/firebase.ts

// Importa las funciones necesarias desde el SDK modular de Firebase
import {initializeApp, getApps, getApp} from 'firebase/app'; // Manejo de la instancia de la app de Firebase
import {getAuth} from 'firebase/auth'; // Autenticación de usuarios
import {getFirestore} from 'firebase/firestore'; // Base de datos Firestore
import {getStorage} from 'firebase/storage'; // Almacenamiento en la nube

// Configuración de Firebase (extraída de tu consola de Firebase - NO compartir públicamente)
const firebaseConfig = {
  apiKey: 'AIzaSyDsAtvXK608p-qsJr6h5eukwNKcd0gsKYE', // Clave pública del proyecto
  authDomain: 'gestioncontactos-a145c.firebaseapp.com', // Dominio autorizado para autenticación
  projectId: 'gestioncontactos-a145c', // ID único del proyecto en Firebase
  storageBucket: 'gestioncontactos-a145c.appspot.com', // Ruta al bucket de almacenamiento
  messagingSenderId: '526517937231', // ID de envío para FCM (mensajería push)
  appId: '1:526517937231:web:2d45f0f12754d0d8e8b63a', // Identificador único de la app
};

// Inicializa Firebase solo si aún no ha sido inicializado
// Esto evita errores si el archivo se importa múltiples veces
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exporta las funcionalidades necesarias para usar en otras partes de la app
export const auth = getAuth(app); // Manejo de autenticación (login, registro, logout, etc.)
export const db = getFirestore(app); // Acceso a la base de datos Firestore
export const storage = getStorage(app); // Acceso al almacenamiento de archivos (imágenes, documentos, etc.)
