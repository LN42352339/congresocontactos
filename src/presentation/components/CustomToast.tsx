// src/components/CustomToast.tsx
import React from 'react';
import {BaseToast, ErrorToast} from 'react-native-toast-message';
import {StyleSheet} from 'react-native';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={styles.success}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={styles.error}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  success: {
    borderLeftColor: '#4BB543',
    padding: 10,
  },
  error: {
    borderLeftColor: '#ff3333',
    padding: 10,
  },
  text1: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 16,
    color: '#333',
  },
});
