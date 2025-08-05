
  
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';

export const saveIPToFile = async (ip: string) => {
  try {
    // ✅ Ruta válida para iOS y Android
    const filePath = `${RNFS.DocumentDirectoryPath}/ip.txt`;

    console.log('📁 Ruta usada para guardar IP:', filePath);

    // Guardar el archivo con contenido en formato UTF-8
    await RNFS.writeFile(filePath, ip, 'utf8');

    console.log('✅ Archivo guardado correctamente');
    
    Alert.alert(
      '✅ Guardado exitoso',
      `Archivo guardado en:\n${filePath}`
    );
  } catch (error: any) {
    console.error('❌ Error al guardar archivo:', error.message);

    Alert.alert(
      '❌ Error al guardar IP',
      error.message || 'Ocurrió un error desconocido.'
    );
  }
};
