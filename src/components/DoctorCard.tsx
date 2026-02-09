import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { View, Pressable } from 'react-native';
import type { DoctorGroup } from '@/types/doctor';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/router';

interface DoctorCardProps {
  doctor: DoctorGroup;
  navigation: any;
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function DoctorCard({ doctor, navigation }: DoctorCardProps) {
  const sortedAvailabilities = [...doctor.availabilities].sort((a, b) => {
    return DAYS_ORDER.indexOf(a.day_of_week) - DAYS_ORDER.indexOf(b.day_of_week);
  });

  return (
    <Pressable
      onPress={() => navigation.navigate('DoctorDetail', { doctor })}
      className="mb-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{doctor.name}</CardTitle>
          <CardDescription>Timezone: {doctor.timezone}</CardDescription>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-3">
            {sortedAvailabilities.map((availability, index) => (
              <View
                key={`${availability.day_of_week}-${index}`}
                className="flex flex-row justify-between border-b border-border pb-2 last:border-0"
              >
                <View className="flex-1">
                  <Text className="font-medium text-foreground">{availability.day_of_week}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-muted-foreground">
                    {availability.available_at.trim()} - {availability.available_until.trim()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
