// src/navigation/AppNavigator.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContactListScreen from '../presentation/views/ContactListScreen';
import LoginScreen from '../presentation/views/LoginScreen';
import DashboardScreen from '../presentation/views/DashboardScreen';

// 👇 Agrega ContactList aquí
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ContactList: undefined; // ✅ Esta línea es la que te faltaba
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="ContactList"
        component={ContactListScreen}
        options={{headerShown: false}} // 👈 aquí ocultamos el título superior
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
