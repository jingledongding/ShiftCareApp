import { View, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { doctorApi } from '@/redux/query/api';
import { DoctorCard } from '@/components/DoctorCard';
import type { DoctorAvailability, DoctorGroup } from '@/types/doctor';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import DoctorJson from "@/assets/doctor.json";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/router';

export default function DoctorsScreen() {
  const { data, isLoading, isError, error, refetch } = doctorApi.useDoctorListQuery();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Group availabilities by doctor name
  const groupByDoctor = (availabilities: DoctorAvailability[]): DoctorGroup[] => {
    const grouped = availabilities.reduce((acc, availability) => {
      if (!acc[availability.name]) {
        acc[availability.name] = {
          name: availability.name,
          timezone: availability.timezone,
          availabilities: [],
        };
      }
      acc[availability.name].availabilities.push({
        day_of_week: availability.day_of_week,
        available_at: availability.available_at,
        available_until: availability.available_until,
      });
      return acc;
    }, {} as Record<string, DoctorGroup>);

    return Object.values(grouped);
  };

  const renderContent = () => {
    // if (isLoading) {
    //   return (
    //     <View className="flex-1 items-center justify-center p-6">
    //       <ActivityIndicator size="large" className="mb-4" />
    //       <Text className="text-muted-foreground text-lg">Loading doctors...</Text>
    //     </View>
    //   );
    // }

    // if (isError) {
    //   return (
    //     <View className="flex-1 items-center justify-center p-6">
    //       <Card className="w-full">
    //         <CardContent className="p-6">
    //           <View className="items-center">
    //             <Text className="text-destructive text-center text-lg font-semibold mb-2">
    //               Error Loading Doctors
    //             </Text>
    //             <Text className="text-muted-foreground text-center text-sm mb-6">
    //               {(error as any)?.message || 'Failed to load doctor data. Please check your connection and try again.'}
    //             </Text>
    //             <Button onPress={refetch} variant="default">
    //               <Text>Retry</Text>
    //             </Button>
    //           </View>
    //         </CardContent>
    //       </Card>
    //     </View>
    //   );
    // }

    // Use API data if available, otherwise fall back to local JSON
    const doctorData = data && data.length > 0 ? data : DoctorJson;
    const doctorGroups = groupByDoctor(doctorData);

    if (!doctorGroups || doctorGroups.length === 0) {
      return (
        <View className="flex-1 items-center justify-center p-6">
          <Card className="w-full">
            <CardContent className="p-6">
              <View className="items-center">
                <Text className="text-muted-foreground text-center text-lg mb-2">
                  No Doctors Available
                </Text>
                <Text className="text-muted-foreground text-center text-sm mb-6">
                  There are no doctors with availability at this time. Please check back later.
                </Text>
                <Button onPress={refetch} variant="outline">
                  <Text>Refresh</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      );
    }

    return (
        <FlashList
            data={doctorGroups}
            renderItem={({ item }) => <DoctorCard doctor={item} navigation={navigation} />}
            keyExtractor={(item) => item.name}
            contentContainerClassName='pt-safe px-4'
            ListHeaderComponent={FlashListHeader}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    );
  };

  return (
    <View className="flex-1 bg-background">
      {renderContent()}
    </View>
  );
}


const FlashListHeader = () => {
    return (
        <View className="pb-4 pt-2">
            <Text className="text-2xl font-bold">Doctors List</Text>
        </View>
    )
}