import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
} from 'react-native';
import {db, auth} from '../../core/config/firebase'; // ✅ conexión centralizada a Firebase
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {Contacto} from '../../domain/entities/Contacto';
import Icon from 'react-native-vector-icons/FontAwesome';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ContactList'
>;

const ContactListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState<Contacto[]>([]);

  // Redirige al login si no hay usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        navigation.replace('Login');
      }
    });

    return unsubscribeAuth;
  }, [navigation]);

  // Escucha cambios en la colección de contactos
  useEffect(() => {
    const contactosRef = collection(db, 'contactos');

    const unsubscribe = onSnapshot(
      contactosRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Contacto[];
        setContactos(data);
        setFiltrados(data);
      },
      error => {
        Alert.alert('Error', 'No se pudieron cargar los contactos');
        console.error(error);
      },
    );

    return () => unsubscribe();
  }, [navigation]);

  // Filtrado en tiempo real
  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const resultados = contactos.filter(contacto =>
      [
        contacto.primerNombre,
        contacto.segundoNombre,
        contacto.primerApellido,
        contacto.segundoApellido,
        contacto.telefono,
        contacto.area,
        contacto.cargo,
      ]
        .join(' ')
        .toLowerCase()
        .includes(texto),
    );
    setFiltrados(resultados);
  }, [busqueda, contactos]);

  const llamar = (numero: string) => {
    Linking.openURL(`tel:${numero}`);
  };

  const abrirWhatsApp = (numero: string) => {
    const url = `whatsapp://send?phone=51${numero}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Error',
        'No se pudo abrir WhatsApp. Asegúrate de que esté instalado.',
      );
    });
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  const renderItem = ({item}: {item: Contacto}) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {[
          item.primerNombre,
          item.segundoNombre,
          item.primerApellido,
          item.segundoApellido,
        ]
          .filter(Boolean)
          .join(' ')}
      </Text>
      <Text style={styles.info}>📞 {item.telefono}</Text>
      <Text style={styles.info}>🧑‍💼 {item.cargo}</Text>
      <Text style={styles.info}>🏢 {item.area}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => llamar(item.telefono)}
          style={styles.btnCall}>
          <Icon name="phone" size={25} color="#fff" style={styles.icon} />
          <Text style={styles.btnText}>Llamar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => abrirWhatsApp(item.telefono)}
          style={styles.btnWhatsapp}>
          <Icon name="whatsapp" size={25} color="#fff" style={styles.icon} />
          <Text style={styles.btnText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📇</Text>
        <Text style={styles.headerTitle}>Directorio del Congreso</Text>
      </View>

      <TouchableOpacity onPress={cerrarSesion} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre, cargo, área..."
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#888"
      />

      {filtrados.length === 0 ? (
        <Text style={styles.emptyText}>No hay contactos encontrados.</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 26,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a30000',
  },
  logoutBtn: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  logoutText: {
    color: '#a30000',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a30000',
  },
  info: {
    fontSize: 15,
    marginTop: 6,
    color: '#333333',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 14,
    justifyContent: 'space-between',
  },
  btnCall: {
    backgroundColor: '#a30000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnWhatsapp: {
    backgroundColor: '#25D366',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 6,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999999',
  },
});

export default ContactListScreen;
