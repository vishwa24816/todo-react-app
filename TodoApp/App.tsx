/**
 * Todo App - React Native Task Management Application
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { checkAuthState } from './src/redux/authSlice';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants';

function App() {
  useEffect(() => {
    // Check authentication state on app start
    store.dispatch(checkAuthState());
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.primary}
        />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
