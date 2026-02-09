import * as React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyTabs from './tabs';
import { DoctorDetailScreen } from '@/screens/doctor-detail';
import { BookingConfirmationScreen, BookingConfirmationParams } from '@/screens/booking-confirmation';
import type { DoctorGroup } from '@/types/doctor';

export type RootStackParamList = {
  Tabs: undefined;
  DoctorDetail: { doctor: DoctorGroup };
  BookingConfirmation: BookingConfirmationParams;
};

const RootStack = createNativeStackNavigator({
  screens: {
    Tabs: {
      screen: MyTabs,
      options: {
        headerShown: false,
      }
    },
    DoctorDetail: {
      screen: DoctorDetailScreen,
      options: {
        headerShown: true,
        title: 'Doctor Availability',
      },
    },
    BookingConfirmation: {
      screen: BookingConfirmationScreen,
      options: {
        headerShown: true,
        title: 'Confirm Booking',
      },
    },
  },
  screenOptions: {
    // navigationBarHidden: true,
  }
});

export const Navigation = createStaticNavigation(RootStack);