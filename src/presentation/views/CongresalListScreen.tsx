// src/presentation/views/CongresalListScreen.tsx
// src/presentation/views/CongresalListScreen.tsx
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Linking, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

type Congresal = {
  id: string;
  primerNombre?: unknown;
  segundoNombre?: unknown;
  primerApellido?: unknown;
  segundoApellido?: unknown;
  telefono?: unknown;
  operador?: unknown; // <-- lo dejamos en el tipo por si existe en BD, pero no lo mostramos
};

const s = (v: unknown) => (v == null ? '' : String(v)).trim();
const toPeru9 = (raw: unknown) => {
  const digits = s(raw).replace(/\D/g, '');
  return digits.slice(-9);
};

const CongresalListScreen = () => {
  const [items, setItems] = useState<Congresal[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState<Congresal[]>([]);

  // Suscripción a "congresales"
  useEffect(() => {
    const unsub = firestore()
      .collection('congresales')
      .onSnapshot(
        (snap) => {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Congresal[];
          setItems(data);
          setFiltrados(data);
        },
        (err) => {
          console.error('[congresales] snapshot error:', err);
          Alert.alert('Error', 'No se pudieron cargar los contactos congresales.');
        },
      );
    return () => unsub();
  }, []);

  // Filtro memo (ya NO incluye operador)
  const filtradosMemo = useMemo(() => {
    const t = busqueda.toLowerCase();
    if (!t) return items;
    return items.filter((c) =>
      [s(c.primerNombre), s(c.segundoNombre), s(c.primerApellido), s(c.segundoApellido), s(c.telefono)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(t),
    );
  }, [busqueda, items]);

  useEffect(() => {
    setFiltrados(filtradosMemo);
  }, [filtradosMemo]);

  // Llamar
  const llamar = useCallback((numero: unknown) => {
    const num9 = toPeru9(numero);
    if (num9.length !== 9) {
      Alert.alert('Número inválido', 'El contacto no tiene un número válido.');
      return;
    }
    Linking.openURL(`tel:${num9}`).catch(() =>
      Alert.alert('Error', 'No se pudo iniciar la llamada.'),
    );
  }, []);

  // WhatsApp con fallback
  const abrirWhatsApp = useCallback((numero: unknown) => {
    const num9 = toPeru9(numero);
    if (num9.length !== 9) {
      Alert.alert('Número inválido', 'El contacto no tiene un número válido.');
      return;
    }
    const appUrl = `whatsapp://send?phone=51${num9}`;
    const webUrl = `https://wa.me/51${num9}`;
    Linking.openURL(appUrl).catch(() =>
      Linking.openURL(webUrl).catch(() =>
        Alert.alert('Error', 'No se pudo abrir WhatsApp ni el navegador.'),
      ),
    );
  }, []);

  // Cerrar sesión
  const cerrarSesion = useCallback(async () => {
    try {
      await auth().signOut();
    } catch {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  }, []);

  const LineaConIcono = ({
    iconName, iconColor, text,
  }: { iconName: string; iconColor: string; text: string }) => (
    <View style={styles.line}>
      <Icon name={iconName} size={16} color={iconColor} style={styles.lineIcon} />
      <Text style={styles.lineText}>{text}</Text>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: Congresal }) => {
    try {
      const nombre =
        [s(item.primerNombre), s(item.segundoNombre), s(item.primerApellido), s(item.segundoApellido)]
          .filter(Boolean)
          .join(' ')
          .toUpperCase() || '(SIN NOMBRE)';

      const telLabel = toPeru9(item.telefono) || '—';

      return (
        <View style={styles.card}>
          <Text style={styles.name}>{nombre}</Text>

          <LineaConIcono iconName="phone" iconColor="#333" text={telLabel} />
          {/* ⬇️ Se eliminó la línea del operador (icono 'signal' y texto) */}

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => llamar(item.telefono)}
              style={[styles.btn, styles.btnPrimary, styles.btnRightGap]}
              accessibilityRole="button"
              accessibilityLabel="Llamar"
            >
              <Icon name="phone" size={20} color="#fff" />
              <Text style={styles.btnText}>LLAMAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => abrirWhatsApp(item.telefono)}
              style={[styles.btn, styles.btnWhatsapp]}
              accessibilityRole="button"
              accessibilityLabel="Enviar WhatsApp"
            >
              <Icon name="whatsapp" size={20} color="#fff" />
              <Text style={styles.btnText}>WHATSAPP</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (e) {
      console.error('renderItem congresal error:', e, item);
      return (
        <View style={styles.card}>
          <Text style={styles.name}>(CONTACTO INVÁLIDO)</Text>
        </View>
      );
    }
  }, [abrirWhatsApp, llamar]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="users" size={22} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>CONTACTOS CONGRESALES</Text>
      </View>

      {/* Botón cerrar sesión */}
      <TouchableOpacity onPress={cerrarSesion} style={styles.logoutBtn} accessibilityRole="button">
        <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>

      {/* Buscador (placeholder actualizado) */}
      <TextInput
        style={styles.input}
        placeholder="BUSCAR POR NOMBRE O TELÉFONO"
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#888"
        selectionColor="#a30000"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {/* Lista */}
      {filtrados.length === 0 ? (
        <Text style={styles.emptyText}>NO HAY CONTACTOS.</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          // ⚙️ Rendimiento / estabilidad
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={50}
          windowSize={10}
          removeClippedSubviews
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: '#f2f2f7' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#a30000',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 0,
  },
  headerIcon: { marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

  logoutBtn: { alignSelf: 'flex-end', marginVertical: 10 },
  logoutText: { color: '#a30000', fontWeight: 'bold' },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#000',
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  name: { fontSize: 15, fontWeight: 'bold', color: '#a30000' },

  line: { position: 'relative', paddingLeft: 24, marginTop: 6 },
  lineIcon: { position: 'absolute', left: 0, top: 1 },
  lineText: { fontSize: 18, color: '#333', flexShrink: 1 },

  buttons: { flexDirection: 'row', marginTop: 12 },
  btn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    padding: 8, borderRadius: 8,
  },
  btnRightGap: { marginRight: 8 },
  btnPrimary: { backgroundColor: '#a30000' },
  btnWhatsapp: { backgroundColor: '#25D366' },
  btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 13 },

  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});

export default CongresalListScreen;
