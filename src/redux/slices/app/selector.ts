import { RootState } from '@/redux/slices';
import {createSelector} from '@reduxjs/toolkit';

const appStoreState = (state: RootState) => state.app;

export const appStoreTokenSelector = createSelector(
  appStoreState,
  state => state,
);
