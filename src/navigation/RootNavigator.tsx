// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoginScreen from '../presentation/views/LoginScreen';
import ContactListScreen from '../presentation/views/ContactListScreen';
import CongresalListScreen from '../presentation/views/CongresalListScreen';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// 👉 Exporta el tipo que usas en LoginScreen
export type RootStackParamList = {
  Login: undefined;
  Main: undefined; // para navigation.replace('Main')
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Tabs para ADMIN (Directorio + Congresales)
function AdminTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Directorio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#a30000',
      }}
    >
      <Tab.Screen
        name="Directorio"
        component={ContactListScreen}
        options={{
          tabBarLabel: 'Directorio',
          tabBarIcon: ({ color, size }) => (
            <Icon name="address-book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Congresales"
        component={CongresalListScreen}
        options={{
          tabBarLabel: 'Congresistas',
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Tabs para USUARIO normal (solo Directorio)
function UserTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Directorio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E4E99',
      }}
    >
      <Tab.Screen
        name="Directorio"
        component={ContactListScreen}
        options={{
          tabBarLabel: 'Directorio',
          tabBarIcon: ({ color, size }) => (
            <Icon name="address-book" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Componente que decide qué tabs mostrar según el rol.
 * Es el contenido de la pantalla "Main" del Stack.
 */
function MainTabsWrapper() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1) Suscribirse a cambios de auth
    const unsubAuth = auth().onAuthStateChanged((u: FirebaseAuthTypes.User | null) => {
      // Si no hay usuario => usuario normal (sin tabs de admin)
      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      // 2) Suscribirse al doc de Firestore para rol en vivo
      const userDocRef = firestore().collection('usuarios').doc(u.uid);
      const unsubDoc = userDocRef.onSnapshot(
        (snap) => {
          const rol = ((snap.data()?.rol ?? '') as string).toString().trim().toLowerCase();
          setIsAdmin(rol === 'admin');
          setChecking(false);
        },
        // En caso de error al leer (permisos, red, etc.)
        () => {
          setIsAdmin(false);
          setChecking(false);
        }
      );

      // Limpieza del snapshot cuando cambie el usuario o se desmonte
      return () => {
        unsubDoc();
      };
    });

    // Limpia el listener de auth al desmontar
    return () => {
      unsubAuth();
    };
  }, []);

  if (checking) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // 3) Forzar recreación del árbol de tabs si cambia el rol
  return isAdmin ? <AdminTabs key="admin" /> : <UserTabs key="user" />;
}

const RootNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const sub = auth().onAuthStateChanged((u) => {
      setHasUser(!!u);
      if (initializing) setInitializing(false);
    });
    return sub;
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasUser ? (
          <Stack.Screen name="Main" component={MainTabsWrapper} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
