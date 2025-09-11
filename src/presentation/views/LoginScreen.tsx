// src/presentation/views/LoginScreen.tsx
import React, {useRef, useState} from 'react';
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
import {RootStackParamList} from '../../navigation/RootNavigator';
import { authRN } from '../../core/config/firebase'; // ⬅️ quita db, storageRN
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const ONLY_DIGITS = /[^0-9]/g;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [numberError, setNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordRef = useRef<TextInput>(null);

  const onChangePhone = (txt: string) => {
    const digits = txt.replace(ONLY_DIGITS, '');
    setPhoneNumber(digits);
    if (numberError) setNumberError('');
  };

  const onChangePassword = (txt: string) => {
    setPassword(txt);
    if (passwordError) setPasswordError('');
  };

  const validate = () => {
    let ok = true;
    if (!phoneNumber || phoneNumber.length !== 9) {
      setNumberError('Ingresa un número de 9 dígitos');
      ok = false;
    }
    if (!password.trim()) {
      setPasswordError('Ingresa tu contraseña');
      ok = false;
    }
    return ok;
  };

  const login = async () => {
    if (loading) return;

    setNumberError('');
    setPasswordError('');

    if (!validate()) {
      Toast.show({
        type: 'error',
        text1: 'Campos inválidos',
        text2: 'Revisa tu número y contraseña.',
      });
      return;
    }

    // normaliza por si acaso
    const fakeEmail = `${phoneNumber}@conectape.pe`.toLowerCase().trim();

    try {
      setLoading(true);

      await authRN.signInWithEmailAndPassword(fakeEmail, password);

      Toast.show({
        type: 'success',
        text1: '¡Bienvenido!',
        text2: 'Has iniciado sesión correctamente',
      });

      // Puedes omitir este replace y dejar que RootNavigator cambie solo por onAuthStateChanged,
      // pero si te funciona así, está bien:
      navigation.replace('Main');
    } catch (err: unknown) {
      // typing seguro
      const code = typeof err === 'object' && err && 'code' in err ? (err as any).code as string : '';

      let message = 'Ocurrió un error. Inténtalo de nuevo.';

      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        message = 'Número o contraseña incorrectos';
      } else if (code === 'auth/user-disabled') {
        message = 'Tu acceso ha sido deshabilitado';
      } else if (code === 'auth/too-many-requests') {
        message = 'Demasiados intentos. Inténtalo más tarde.';
      } else if (code === 'auth/network-request-failed') {
        message = 'Problema de conexión. Verifica tu internet.';
      } else if (code === 'auth/invalid-email') {
        message = 'Formato de correo inválido';
      }

      Toast.show({
        type: 'error',
        text1: 'No pudimos iniciar sesión',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding', android: undefined})}
      accessible
      accessibilityLabel="Pantalla de inicio de sesión"
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Número de celular (9 dígitos)"
        value={phoneNumber}
        onChangeText={onChangePhone}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={9}
        style={[styles.input, numberError ? styles.inputError : null]}
        placeholderTextColor="#888"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="telephoneNumber"
        selectionColor="#b71c1c"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        editable={!loading}
        testID="input-phone"
      />
      {!!numberError && <Text style={styles.errorText}>{numberError}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordRef}
          placeholder="Contraseña"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          style={[
            styles.input,
            styles.passwordInput,
            passwordError ? styles.inputError : null,
          ]}
          placeholderTextColor="#888"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          selectionColor="#b71c1c"
          returnKeyType="done"
          onSubmitEditing={login}
          editable={!loading}
          autoComplete="off"
          testID="input-password"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(v => !v)}
          style={styles.eyeIcon}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
        </TouchableOpacity>
      </View>
      {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <TouchableOpacity
        onPress={login}
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Ingresar"
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#ffffff' },
  logo: { width: 150, height: 100, alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 26, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', color: '#b71c1c' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f7f7f7',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: '#000',
  },
  inputError: { borderColor: '#ff3b30' },
  errorText: { color: '#ff3b30', marginBottom: 10, marginLeft: 4, fontSize: 12 },
  passwordContainer: { position: 'relative', marginBottom: 10 },
  passwordInput: { paddingRight: 44, marginBottom: 0 },
  eyeIcon: { position: 'absolute', right: 12, top: 12 },
  button: {
    backgroundColor: '#b71c1c',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default LoginScreen;
