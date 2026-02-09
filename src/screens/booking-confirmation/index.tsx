import { View, ScrollView, ActivityIndicator, Modal, Pressable, useColorScheme } from "react-native";
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/router';
import { appointmentStorage } from '@/storage/appointments';
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, 'BookingConfirmation'>;

export interface BookingConfirmationParams {
  doctorName: string;
  doctorTimezone: string;
  dayOfWeek: string;
  time: string;
}

type DialogState = {
  open: boolean;
  title: string;
  description: string;
  showViewBookings?: boolean;
};

export function BookingConfirmationScreen({ route }: Props) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { doctorName, doctorTimezone, dayOfWeek, time } = route.params as BookingConfirmationParams;
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: '',
    description: '',
  });

  // Dynamic colors based on theme
  const isDark = colorScheme === 'dark';
  const modalColors = {
    background: isDark ? '#212121' : '#ffffff',
    title: isDark ? '#ffffff' : '#111827',
    description: isDark ? '#a1a1aa' : '#6b7280',
    border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
  };

  useEffect(() => {
    // Check if this slot is already booked
    const booked = appointmentStorage.isSlotBooked(doctorName, dayOfWeek, time);
    setIsAlreadyBooked(booked);

    if (booked) {
      setDialog({
        open: true,
        title: 'Slot Already Booked',
        description: 'This time slot has already been booked. Please select a different time.',
      });
    }
  }, [doctorName, dayOfWeek, time]);

  const handleConfirmBooking = () => {
    if (isAlreadyBooked) {
      setDialog({
        open: true,
        title: 'Error',
        description: 'This time slot is already booked.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save the appointment
      appointmentStorage.save({
        doctorName,
        doctorTimezone,
        dayOfWeek,
        time,
      });

      setDialog({
        open: true,
        title: 'Booking Confirmed',
        description: `Your appointment with ${doctorName} on ${dayOfWeek} at ${time} has been confirmed.`,
        showViewBookings: true,
      });
    } catch (error) {
      setDialog({
        open: true,
        title: 'Booking Failed',
        description: 'Failed to confirm your booking. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDialogClose = () => {
    setDialog({ ...dialog, open: false });
    if (isAlreadyBooked || dialog.title === 'Booking Failed') {
      navigation.goBack();
    } else if (dialog.showViewBookings && dialog.title === 'Booking Confirmed') {
      navigation.goBack();
    }
  };

  const handleViewBookings = () => {
    setDialog({ ...dialog, open: false });
    navigation.reset({
      index: 0,
      // @ts-ignore
      routes: [{ name: 'Tabs', params: { screen: 'Booking' } }],
    });
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-2">Confirm Booking</Text>
            <Text className="text-muted-foreground">
              Please review your appointment details before confirming
            </Text>
          </View>

          {/* Appointment Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Review your booking information</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-4">
                {/* Doctor Name */}
                <View className="flex flex-col gap-1">
                  <Text className="text-sm font-medium text-muted-foreground">Doctor</Text>
                  <Text className="text-lg font-semibold text-foreground">{doctorName}</Text>
                </View>

                {/* Day */}
                <View className="flex flex-col gap-1">
                  <Text className="text-sm font-medium text-muted-foreground">Day</Text>
                  <Text className="text-lg font-semibold text-foreground">{dayOfWeek}</Text>
                </View>

                {/* Time */}
                <View className="flex flex-col gap-1">
                  <Text className="text-sm font-medium text-muted-foreground">Time</Text>
                  <Text className="text-lg font-semibold text-foreground">{time}</Text>
                </View>

                {/* Timezone */}
                <View className="flex flex-col gap-1">
                  <Text className="text-sm font-medium text-muted-foreground">Timezone</Text>
                  <Text className="text-base text-foreground">{doctorTimezone}</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <View className="flex flex-row gap-3">
                <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-foreground mb-1">
                    Please arrive on time
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Be sure to arrive 5-10 minutes before your scheduled appointment time.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <View className="flex flex-col gap-3">
            <Button
              onPress={handleConfirmBooking}
              disabled={isLoading || isAlreadyBooked}
              className="w-full"
            >
              {isLoading ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="opacity-70">Confirming...</Text>
                </View>
              ) : (
                <Text>Confirm Booking</Text>
              )}
            </Button>

            <Button
              variant="outline"
              onPress={handleCancel}
              disabled={isLoading}
              className="w-full"
            >
              <Text>Cancel</Text>
            </Button>
          </View>

          {/* Disclaimer */}
          <View className="mt-6 px-2">
            <Text className="text-xs text-center text-muted-foreground">
              By confirming this booking, you agree to our terms and conditions.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dialog for success/error messages */}
      <Modal
        visible={dialog.open}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog({ ...dialog, open: false })}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
          onPress={() => setDialog({ ...dialog, open: false })}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: modalColors.background,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: modalColors.border,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: '100%',
              maxWidth: 350,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: modalColors.title, marginBottom: 8 }}>
              {dialog.title}
            </Text>
            <Text style={{ fontSize: 14, color: modalColors.description, marginBottom: 24 }}>
              {dialog.description}
            </Text>
            {dialog.showViewBookings ? (
              <View className="flex flex-row gap-3">
                <Button
                  variant="outline"
                  onPress={handleDialogClose}
                  className="flex-1"
                >
                  <Text>OK</Text>
                </Button>
                <Button
                  onPress={handleViewBookings}
                  className="flex-1"
                >
                  <Text>View Bookings</Text>
                </Button>
              </View>
            ) : (
              <Button onPress={handleDialogClose} className="w-full">
                <Text>OK</Text>
              </Button>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
