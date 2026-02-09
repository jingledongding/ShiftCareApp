import { View, ScrollView, RefreshControl, Alert, ActivityIndicator } from "react-native";
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appointmentStorage } from '@/storage/appointments';
import type { Appointment } from '@/types/appointment';
import { useState, useEffect } from 'react';

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function BookingScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const allAppointments = appointmentStorage.getAll();
    // Sort by creation time (newest first) and then by day of week
    const sorted = allAppointments.sort((a, b) => {
      if (a.createdAt !== b.createdAt) {
        return b.createdAt - a.createdAt;
      }
      return DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek);
    });
    setAppointments(sorted);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadAppointments();
    setRefreshing(false);
  };

  const handleDeleteAppointment = (id: string, doctorName: string, day: string, time: string) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel the appointment with ${doctorName} on ${day} at ${time}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            appointmentStorage.delete(id);
            loadAppointments();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (appointments.length === 0) return;

    Alert.alert(
      'Clear All Appointments',
      'Are you sure you want to cancel all appointments?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            appointmentStorage.clear();
            loadAppointments();
          },
        },
      ]
    );
  };

  const renderContent = () => {
    if (appointments.length === 0) {
      return (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-muted-foreground text-center text-lg mb-4">No appointments booked yet</Text>
          <Text className="text-muted-foreground text-center text-sm">
            Go to the Doctors tab to book an appointment
          </Text>
        </View>
      );
    }

    // Group appointments by doctor
    const groupedByDoctor = appointments.reduce((acc, appointment) => {
      if (!acc[appointment.doctorName]) {
        acc[appointment.doctorName] = [];
      }
      acc[appointment.doctorName].push(appointment);
      return acc;
    }, {} as Record<string, Appointment[]>);

    return (
      <View className="pb-4 pt-safe">
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="text-lg font-semibold">Your Appointments</Text>
          <Button variant="destructive" size="sm" onPress={handleClearAll}>
            <Text>Clear All</Text>
          </Button>
        </View>

        {Object.entries(groupedByDoctor).map(([doctorName, doctorAppointments]) => (
          <Card key={doctorName} className="mb-4 mx-4">
            <CardHeader>
              <CardTitle className="text-xl">{doctorName}</CardTitle>
              <CardDescription>
                {doctorAppointments.length} appointment{doctorAppointments.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-3">
                {doctorAppointments.map((appointment) => (
                  <View
                    key={appointment.id}
                    className="flex flex-row items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <View className="flex-1">
                      <Text className="font-medium text-foreground">{appointment.dayOfWeek}</Text>
                      <Text className="text-sm text-muted-foreground">{appointment.time}</Text>
                      <Text className="text-xs text-muted-foreground">{appointment.doctorTimezone}</Text>
                    </View>
                    <Button
                      variant="destructive"
                      size="sm"
                      onPress={() =>
                        handleDeleteAppointment(
                          appointment.id,
                          appointment.doctorName,
                          appointment.dayOfWeek,
                          appointment.time
                        )
                      }
                    >
                      <Text>Cancel</Text>
                    </Button>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}
