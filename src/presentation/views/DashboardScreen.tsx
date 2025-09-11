// src/presentation/views/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation, CommonActions } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;
  const phone = user?.email?.split('@')[0] || 'Invitado';

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' as never }], // 👈 forzamos el tipo
        }),
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Bienvenido: {phone}</Text>
      <Text style={styles.subtitle}>Estás en el Dashboard</Text>

      <Text style={styles.info}>Correo: {user?.email}</Text>
      <Text style={styles.info}>UID: {user?.uid}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Main' as never)} // 👈 ahora apunta a "Main"
        style={styles.navBtn}>
        <Text style={styles.navText}>Ir al Directorio</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#a30000',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  info: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
    color: '#555',
  },
  navBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  navText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#a30000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
