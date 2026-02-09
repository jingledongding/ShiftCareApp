import "../global.css"
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { Navigation } from '@/router';
import {persistor, store as reduxStore} from '@/redux/index';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PortalHost } from '@rn-primitives/portal';

export default function App() {
  return (
    <SafeAreaProvider className="flex flex-1">
      <GestureHandlerRootView className="flex flex-1">
        <ReduxProvider store={reduxStore}>
          <PersistGate persistor={persistor}>
            <Navigation />
            <PortalHost />
            <StatusBar translucent />
          </PersistGate>
        </ReduxProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
