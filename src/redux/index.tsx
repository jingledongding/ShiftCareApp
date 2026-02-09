import createSagaMiddleware from '@redux-saga/core';
import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {useDispatch} from 'react-redux';
import {persistStore} from 'redux-persist';
import persistedRootReducer from './slices';
import rootSaga from './root-saga';

import {createNetworkMiddleware} from 'react-native-offline';
import { doctorApi } from './query/api';

const sagaMiddleware = createSagaMiddleware();

const networkMiddleware = createNetworkMiddleware({
  queueReleaseThrottle: 1000,
}) as any;
const middleware = [
  networkMiddleware,
  sagaMiddleware,
  doctorApi.middleware
];
//create store
const store = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middleware),

  // enhancers: __DEV__ ? [reactotron.createEnhancer?.()] : [],
  // devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

setupListeners(store.dispatch);

export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export {store, persistor};