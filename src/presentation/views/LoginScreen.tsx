import React, {useState} from 'react';
import {
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {auth, db} from '../../core/config/firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [numberError, setNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const login = async () => {
    setNumberError('');
    setPasswordError('');

    if (!phoneNumber.trim() && !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: 'Debes ingresar tu número y contraseña',
      });
      return;
    }

    if (!phoneNumber.trim()) {
      setNumberError('Ingresa tu número');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Ingresa tu contraseña');
      return;
    }

    const fakeEmail = `${phoneNumber}@conectape.pe`;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      Toast.show({
        type: 'success',
        text1: 'Bienvenido',
        text2: 'Has iniciado sesión correctamente',
      });
      navigation.replace('ContactList');
    } catch (error: any) {
      console.log('🛠️ Código de error Firebase:', error.code);
      const ref = doc(db, 'contactos', phoneNumber);
      const snapshot = await getDoc(ref);

      let message = 'Ocurrió un error. Inténtalo de nuevo.';
      if (!snapshot.exists()) {
        message = 'Este número no está autorizado para acceder al directorio';
      } else {
        message = 'La contraseña es incorrecta';
      }

      Toast.show({
        type: 'error',
        text1: 'Error de inicio de sesión',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Número de celular"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={9}
        style={[styles.input, numberError ? styles.inputError : null]}
        placeholderTextColor="#888"
      />
      {numberError ? <Text style={styles.errorText}>{numberError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[
            styles.input,
            styles.passwordInput,
            passwordError ? styles.inputError : null,
          ]}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity
        onPress={login}
        style={styles.button}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#b71c1c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    color: '#000',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 12,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  passwordInput: {
    paddingRight: 40,
    marginBottom: 0,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#b71c1c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
