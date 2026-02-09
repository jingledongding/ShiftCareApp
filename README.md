# ShiftCare Doctor Booking App

A React Native mobile application for booking doctor appointments. View available doctors, check their weekly schedules, and manage your bookings locally.

## Features

- **Doctors List**: Browse all available doctors with their timezones
- **Doctor Availability**: Interactive calendar table showing weekly availability with 30-minute time slots
- **Appointment Booking**: Book appointments through a confirmation screen
- **My Bookings**: View and cancel your scheduled appointments
- **Local Persistence**: All data stored locally using MMKV storage
- **Pull to Refresh**: Refresh appointment lists on the bookings screen

## Tech Stack

- **React Native**: v0.76.7 with Expo v54
- **TypeScript**: Type-safe development
- **NativeWind**: Tailwind CSS for React Native (v4.2.1)
- **React Navigation**: v7 for navigation (Stack and Bottom Tabs)
- **Redux Toolkit**: State management with redux-persist
- **MMKV**: Fast local key-value storage (react-native-mmkv v4.1.2)
- **FlashList**: Optimized list rendering from Shopify
- **Class Variance Authority (CVA)**: Component variant management

## Project Structure

```
src/
├── assets/           # Static assets (doctor data)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (shadcn-style)
│   └── DoctorCard.tsx
├── lib/             # Utility functions
├── redux/           # Redux store and slices
├── router/          # Navigation configuration
├── screens/         # Screen components
│   ├── booking/                    # My Bookings screen
│   ├── booking-confirmation/       # Booking confirmation screen
│   ├── doctor-detail/              # Doctor availability calendar
│   └── doctors/                    # Doctors list screen
├── storage/         # Local storage services
│   ├── appointments.ts            # Appointment storage (MMKV)
│   └── index.tsx                  # Redux persist storage
└── types/           # TypeScript type definitions
    ├── appointment.ts
    └── doctor.ts
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- iOS Simulator (macOS only) or Android Emulator
- Expo CLI: `npm install -g expo-cli`

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShiftCareApp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start the development server**
   ```bash
   # Start Metro bundler
   npm start

   # In a separate terminal, run on iOS
   npm run ios

   # Or run on Android
   npm run android
   ```

5. **Using Expo** (alternative)
   ```bash
   npx expo start
   ```
   Then scan the QR code with Expo Go app on your mobile device.

## Usage

### Viewing Doctors

1. Launch the app
2. Navigate to the **Doctors** tab
3. Browse the list of available doctors
4. Tap on a doctor card to view their availability

### Booking an Appointment

1. From the **Doctors** tab, tap on a doctor
2. View their weekly availability calendar
3. Green dots indicate available time slots
4. Tap an available slot to select it
5. Tap the **Book** button to proceed to confirmation
6. Review the appointment details on the confirmation screen
7. Tap **Confirm Booking** to finalize

### Managing Bookings

1. Navigate to the **My Bookings** tab
2. View all your scheduled appointments grouped by doctor
3. Tap **Cancel** on any appointment to remove it
4. Use **Clear All** to remove all appointments at once
5. Pull down to refresh the list

## Screen Descriptions

### Doctors Screen (Home)
- Lists all available doctors
- Shows each doctor's timezone
- Tap to view detailed availability

### Doctor Detail Screen
- Displays doctor information
- Interactive calendar table with:
  - Days of week as columns (Mon-Sun)
  - Time slots as rows (6AM-8PM, 30-minute intervals)
- Visual indicators:
  - **Green dot**: Available slot
  - **White dot**: Selected slot
  - **Red "B"**: Already booked
  - **Dash (—)**: Outside availability

### Booking Confirmation Screen
- Shows appointment details to confirm
- Displays doctor name, day, time, and timezone
- Important notice about arrival time
- Confirm or cancel buttons

### My Bookings Screen
- Lists all booked appointments
- Grouped by doctor
- Cancel individual appointments
- Clear all appointments option
- Pull to refresh

## Design Decisions & Assumptions

### Time Handling

1. **Time Format**: All times displayed in 12-hour AM/PM format
2. **Timezone Handling**: Doctor's timezone is displayed but NOT converted to user's local timezone
   - Assumption: Users are in the same timezone as doctors
   - Future enhancement: Add timezone conversion using libraries like `date-fns-tz`

3. **Time Slots**: Generated from 6:00 AM to 8:00 PM in 30-minute intervals
   - Assumption: Standard business hours for most doctors
   - Can be customized based on API data

### Storage Strategy

1. **No Backend**: All data stored locally using MMKV
   - Appointments persist across app restarts
   - No authentication required (demo purposes)
   - Data is device-specific

2. **Doctor Data**: Currently loaded from local JSON file
   - File: `src/assets/doctor.json`
   - Future: Will be fetched from API endpoint

### Navigation Flow

1. **Two-Step Booking**: Confirmation screen between selection and booking
   - Prevents accidental bookings
   - Gives users a chance to review details
   - Allows cancellation before persistence

2. **Calendar Navigation**: Horizontal scrolling for time slots
   - Vertical scrolling for all time slots
   - Fixed day columns for easy comparison

### UI/UX Choices

1. **Calendar Table Format**: Used instead of vertical list
   - Easier to compare availability across days
   - Standard pattern for scheduling apps

2. **Visual Indicators**: Color-coded slot states
   - Green = available
   - White = selected
   - Red = booked
   - Gray = unavailable

3. **Grouped Bookings**: Appointments grouped by doctor
   - Easier to see all appointments per doctor
   - Reduces visual clutter

## Known Limitations

### Current Limitations

1. **No Real Backend**
   - All data stored locally on device
   - Appointments don't sync across devices
   - No multi-user support

2. **No Authentication**
   - Anyone can book/cancel appointments
   - No user accounts or profiles
   - No booking history tracking

3. **Timezone Support**
   - No automatic timezone conversion
   - Shows doctor's timezone as-is
   - User must manually calculate time differences

4. **Conflict Handling**
   - No real-time conflict detection
   - Double-booking possible if multiple users
   - No waitlist functionality

5. **Data Persistence**
   - Data lost if app is uninstalled
   - No cloud backup
   - No export/import functionality

6. **Error Handling**
   - Limited network error handling
   - No offline mode for API calls
   - Basic error messages only

### Future Enhancements

1. **Backend Integration**
   - Connect to real API server
   - User authentication and authorization
   - Real-time data synchronization

2. **Timezone Conversion**
   - Convert times to user's local timezone
   - Display multiple timezones
   - Timezone-aware notifications

3. **Enhanced Features**
   - Email/SMS confirmations
   - Push notification reminders
   - Rescheduling instead of cancel/rebook
   - Recurring appointments
   - Waitlist functionality

4. **Testing**
   - Unit tests for business logic
   - Integration tests for navigation
   - E2E tests for critical flows
   - Accessibility testing

5. **Performance**
   - Optimize for large doctor lists
   - Virtualize calendar rendering
   - Cache API responses

6. **Analytics**
   - Track booking patterns
   - Monitor popular time slots
   - User engagement metrics

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start -c
   ```
   The `-c` flag clears the Metro cache.

2. **iOS build errors**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **TypeScript errors**
   ```bash
   npm run type-check
   ```

4. **Storage not persisting**
   - Ensure MMKV is properly linked
   - Rebuild the app: `npm run ios` or `npm run android`

5. **Navigation not working**
   - Check that all screens are registered in `src/router/index.tsx`
   - Verify navigation types match route params

## API Integration (Future)

The app is designed to integrate with the following API endpoint:

```
GET https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json
```

Expected response format:
```json
[
  {
    "name": "Doctor Name",
    "timezone": "America/New_York",
    "day_of_week": "Monday",
    "available_at": "9:00AM",
    "available_until": "5:00PM"
  }
]
```

To integrate:
1. Replace local JSON loading with API fetch in `src/screens/doctors/index.tsx`
2. Add error handling for network failures
3. Implement loading states
4. Add pull-to-refresh for doctor list

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with** ❤️ **using React Native and Expo**
# ShiftCareApp
