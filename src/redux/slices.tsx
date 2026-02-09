import {persistCombineReducers} from 'redux-persist';
import appStoreReducer from '@/redux/slices/app/reducer'

import {reducer as network} from 'react-native-offline';
import { reduxStorage } from '@/storage';
import { doctorApi } from './query/api';

const reducers = {
  app: appStoreReducer,
  network,
  doctorApi: doctorApi.reducer,
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage(),
  timeout: 7 * 24 * 60 * 60 * 1000,
  whitelist: [
    'app',
  ],
  blacklist: ['doctorApi', 'network'], // RTK Query 和 network 状态不应该持久化
};

const persistedRootReducer = persistCombineReducers(persistConfig, reducers);

export type RootState = ReturnType<typeof persistedRootReducer>;

export default persistedRootReducer;