// src/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import LoginScreen from '../presentation/views/LoginScreen';
import ContactListScreen from '../presentation/views/ContactListScreen';
import CongresalListScreen from '../presentation/views/CongresalListScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// --- TABS SOLO PARA ADMIN ---
function AdminTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Directorio"
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 60 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
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
          // 🔵 Azul cuando está activo
          tabBarActiveTintColor: '#0E4E99',
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
          // 🔴 Rojo cuando está activo
          tabBarActiveTintColor: '#a30000',
        }}
      />
    </Tab.Navigator>
  );
}

// --- ROOT PARA USUARIO BÁSICO (sin tabs, solo Directorio) ---
function BasicUserRoot() {
  return <ContactListScreen />;
}

// --- SWITCH SEGÚN ROL ---
function MainRoleSwitcher() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubAuth = auth().onAuthStateChanged((u: FirebaseAuthTypes.User | null) => {
      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      const ref = firestore().collection('usuarios').doc(u.uid);
      const unsubDoc = ref.onSnapshot(
        (snap) => {
          const rol = ((snap.data()?.rol ?? '') as string).toLowerCase().trim();
          setIsAdmin(rol === 'admin');
          setChecking(false);
        },
        () => {
          setIsAdmin(false);
          setChecking(false);
        },
      );
      return () => unsubDoc();
    });
    return () => unsubAuth();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // clave distinta para remount al cambiar rol
  return isAdmin ? <AdminTabs key="admin" /> : <BasicUserRoot key="basic" />;
}

// --- NAVEGADOR PRINCIPAL ---
export default function AppNavigator() {
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {hasUser ? (
        <Stack.Screen name="Main" component={MainRoleSwitcher} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

