import DoctorsScreen from '@/screens/doctors';
import BookingScreen from '@/screens/booking';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Stethoscope, Calendar } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#4ade80' : '#16a34a',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          borderTopColor: isDark ? '#333333' : '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Doctors"
        component={DoctorsScreen}
        options={{
          tabBarLabel: 'Doctors',
          tabBarIcon: ({ color, size }) => (
            <Stethoscope size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={BookingScreen}
        options={{
          tabBarLabel: 'My Bookings',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}