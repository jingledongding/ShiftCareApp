import {createSlice} from '@reduxjs/toolkit';

interface AppStoreProps {
}

const initialAppStoreState: AppStoreProps = {
};

const appStoreReducer = createSlice({
  name: 'app',
  initialState: initialAppStoreState,
  reducers: {
  },
});

export const {
} = appStoreReducer.actions;

export default appStoreReducer.reducer;