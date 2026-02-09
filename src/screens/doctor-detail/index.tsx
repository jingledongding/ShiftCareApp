import { View, ScrollView, Pressable } from "react-native";
import { Text } from '@/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/router';
import type { DoctorGroup } from '@/types/doctor';
import { appointmentStorage } from '@/storage/appointments';
import { useMemo, useState, useEffect } from 'react';
import {useNavigation} from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'DoctorDetail'>;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Parse time string like "9:00AM" or " 9:00AM" to minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  const trimmed = timeStr.trim();
  const match = trimmed.match(/(\d+):(\d+)(AM|PM)/i);
  if (!match) return 0;

  const [, hours, minutes, period] = match;
  let hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);

  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  return hour * 60 + minute;
}

// Generate all 30-minute time slots from 6AM to 8PM
function generateTimeSlots(): { time: string; minutes: number }[] {
  const slots: { time: string; minutes: number }[] = [];
  const startHour = 6;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minute of [0, 30]) {
      const totalMinutes = hour * 60 + minute;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const timeStr = `${displayHour}:${minute.toString().padStart(2, '0')}${period}`;
      slots.push({ time: timeStr, minutes: totalMinutes });
    }
  }

  return slots;
}

// Check if a specific time slot is available for a given day
function isSlotAvailable(
  day: string,
  slotMinutes: number,
  availabilities: DoctorGroup['availabilities']
): boolean {
  const dayAvailability = availabilities.find((a) => a.day_of_week === day);
  if (!dayAvailability) return false;

  const startMinutes = parseTimeToMinutes(dayAvailability.available_at);
  const endMinutes = parseTimeToMinutes(dayAvailability.available_until);

  return slotMinutes >= startMinutes && slotMinutes < endMinutes;
}

const CELL_WIDTH = 50;
const TIME_COLUMN_WIDTH = 70;

export function DoctorDetailScreen({ route }: Props) {
  const { doctor } = route.params;
  const navigation = useNavigation()
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  // Load booked appointments on mount
  useEffect(() => {
    loadBookedSlots();
  }, [doctor.name]);

  const loadBookedSlots = () => {
    const appointments = appointmentStorage.getAll();
    const doctorBookings = appointments
      .filter((a) => a.doctorName === doctor.name)
      .map((a) => `${a.dayOfWeek}-${a.time}`);
    setBookedSlots(new Set(doctorBookings));
  };

  const handleSlotPress = (day: string, time: string, available: boolean) => {
    if (!available) return;

    const slotKey = `${day}-${time}`;
    // If already booked, don't allow navigation
    if (bookedSlots.has(slotKey)) return;

    // Navigate directly to confirmation screen
    (navigation as any).navigate('BookingConfirmation', {
      doctorName: doctor.name,
      doctorTimezone: doctor.timezone,
      dayOfWeek: day,
      time: time,
    });
  };

  const getSlotKey = (day: string, time: string) => `${day}-${time}`;

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Doctor Info Header */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{doctor.name}</CardTitle>
              <Text className="text-muted-foreground">Timezone: {doctor.timezone}</Text>
            </CardHeader>
          </Card>

          {/* Weekly Schedule Calendar */}
          <Text className="text-xl font-semibold mb-2 px-1">Weekly Availability</Text>
          <Text className="text-sm text-muted-foreground mb-4 px-1">
            Tap an available time slot to book an appointment
          </Text>

          <Card>
            <CardContent className="p-0">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* Calendar Header - Days of Week */}
                  <View className="flex-row border-b border-border bg-muted/50">
                    {/* Time column header */}
                    <View style={{ width: TIME_COLUMN_WIDTH }} className="p-2 border-r border-border">
                      <Text className="text-xs font-semibold text-center">Time</Text>
                    </View>
                    {/* Day headers */}
                    {DAYS.map((day) => (
                      <View
                        key={day}
                        style={{ width: CELL_WIDTH }}
                        className="p-2 border-r border-border last:border-r-0"
                      >
                        <Text className="text-xs font-semibold text-center">{day}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Calendar Body - Time Slots */}
                  <ScrollView>
                    {timeSlots.map((slot) => (
                      <View key={slot.time} className="flex-row border-b border-border">
                        {/* Time column */}
                        <View
                          style={{ width: TIME_COLUMN_WIDTH }}
                          className="p-2 border-r border-border bg-muted/30 justify-center"
                        >
                          <Text className="text-xs text-center">{slot.time}</Text>
                        </View>

                        {/* Day cells */}
                        {FULL_DAYS.map((day) => {
                          const available = isSlotAvailable(
                            day,
                            slot.minutes,
                            doctor.availabilities
                          );
                          const slotKey = getSlotKey(day, slot.time);
                          const isBooked = bookedSlots.has(slotKey);

                          return (
                            <Pressable
                              key={`${day}-${slot.time}`}
                              style={{ width: CELL_WIDTH, height: 40 }}
                              className={`
                                border-r border-border last:border-r-0 justify-center items-center
                                ${available && !isBooked
                                  ? 'bg-primary/20 active:bg-primary/40'
                                  : isBooked
                                  ? 'bg-muted/50'
                                  : 'bg-muted/20'
                                }
                              `}
                              onPress={() => handleSlotPress(day, slot.time, available && !isBooked)}
                              disabled={!available || isBooked}
                            >
                              {available && !isBooked ? (
                                <Text className="text-emerald-600 text-xs font-semibold">Book</Text>
                              ) : isBooked ? (
                                <Text className="text-muted-foreground/50 text-xs font-semibold">Booked</Text>
                              ) : (
                                <Text className="text-muted/30 text-xs">—</Text>
                              )}
                            </Pressable>
                          );
                        })}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </CardContent>
          </Card>

          {/* Legend */}
          <View className="flex-row items-center justify-center gap-4 mt-4 mb-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-emerald-600 text-xs font-semibold">Book</Text>
              <Text className="text-xs text-muted-foreground">Available</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-muted-foreground/50 text-xs font-semibold">Booked</Text>
              <Text className="text-xs text-muted-foreground">Booked</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-muted/30 text-xs">—</Text>
              <Text className="text-xs text-muted-foreground">Unavailable</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
