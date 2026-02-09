import DoctorsScreen from '@/screens/doctors';
import BookingScreen from '@/screens/booking';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: DoctorsScreen,
    Booking: BookingScreen,
  },
  screenOptions: {
    headerShown: false,
  }
});

export default MyTabs;