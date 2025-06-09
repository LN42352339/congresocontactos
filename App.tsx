// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/presentation/components/CustomToast'; // si estás usando configuración personalizada

const App = (): React.JSX.Element => {
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

export default App;
