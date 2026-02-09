# ShiftCare Doctor Booking App

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.76.7-61dafb?logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0.33-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6?logo=typescript)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

A modern medical appointment booking application with a clean, healthcare-focused green theme.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### Core Functionality
- 🏥 **Doctor Directory** - Browse available healthcare providers with timezone information
- 📅 **Interactive Availability Calendar** - Weekly schedule grid with 30-minute time slots
- 📝 **Appointment Booking** - streamlined booking flow with confirmation screen
- 💾 **Local Persistence** - All bookings stored locally using MMKV for fast access
- 🔄 **Pull to Refresh** - Refresh appointment lists with native gestures

### User Experience
- 🎨 **Medical Healthcare Theme** - Professional green color scheme for trust and clarity
- 🌙 **Dark Mode Support** - Automatic theme switching based on system preferences
- 📱 **Native Performance** - Optimized lists with FlashList for smooth scrolling
- ♿ **Accessible Design** - High contrast ratios and clear visual indicators
- 🎯 **Direct Booking Flow** - One-tap booking from calendar to confirmation

### Technical Highlights
- ⚡ **Fast Navigation** - React Navigation v7 with stack and tab navigators
- 🗃️ **State Management** - Redux Toolkit with persistence
- 🎨 **Component System** - shadcn-style UI components with CVA variants
- 📐 **Type-Safe** - Full TypeScript coverage
- 🌿 **Styling** - NativeWind (Tailwind CSS) for React Native

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React Native | 0.76.7 |
| **Platform** | Expo | 54.0.33 |
| **Language** | TypeScript | 5.7.2 |
| **Styling** | NativeWind | 4.2.1 |
| **Navigation** | React Navigation | 7.x |
| **State** | Redux Toolkit + Persist | latest |
| **Storage** | MMKV | 4.1.2 |
| **Lists** | FlashList | 2.0.2 |
| **Components** | @rn-primitives | 1.x |

---

## 📁 Project Structure

```
src/
├── assets/                    # Static assets and mock data
│   └── doctor.json           # Doctor availability data
├── components/                # Reusable components
│   ├── ui/                   # Base UI components (shadcn-style)
│   │   ├── alert-dialog.tsx  # Modal dialogs
│   │   ├── button.tsx        # Button variants
│   │   ├── card.tsx          # Card containers
│   │   ├── dialog.tsx        # Dialog component
│   │   ├── label.tsx         # Form labels
│   │   └── text.tsx          # Typography
│   └── DoctorCard.tsx        # Doctor info card
├── lib/                      # Utility functions
│   └── utils.ts             # Helper functions
├── redux/                    # State management
│   ├── slices/              # Redux slices
│   ├── query/               # API queries
│   └── index.tsx            # Store configuration
├── router/                   # Navigation
│   ├── index.tsx            # Root navigator
│   └── tabs.tsx             # Bottom tabs
├── screens/                  # Screen components
│   ├── doctors/             # Doctor list (home)
│   ├── doctor-detail/       # Availability calendar
│   ├── booking-confirmation/# # Booking confirmation
│   └── booking/             # My bookings
├── storage/                  # Local storage
│   ├── appointments.ts      # MMKV storage service
│   └── index.tsx            # Redux persist storage
└── types/                    # TypeScript definitions
    ├── appointment.ts       # Appointment types
    └── doctor.ts            # Doctor types
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended) or npm/yarn
- **iOS Simulator** (macOS) or **Android Emulator**
- **Expo CLI**: `npm install -g expo-cli`

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/jingledongding/ShiftCareApp.git
cd ShiftCareApp

# Install dependencies
pnpm install
```

### Step 2: iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### Step 3: Start Development

```bash
# Start Metro bundler with cache cleared
pnpm start -c

# In another terminal, run on iOS
pnpm ios

# Or run on Android
pnpm android
```

### Alternative: Expo Go

```bash
# Start Expo dev server
npx expo start

# Scan QR code with Expo Go app on mobile device
```

---

## 📖 Usage

### 1. Browse Doctors

The app opens to the **Doctors** tab showing all available healthcare providers.

### 2. Check Availability

- Tap any doctor card to view their weekly availability
- Calendar shows:
  - **Green "Book"** - Available time slots
  - **Gray "Booked"** - Already reserved slots
  - **Dash (—)** - Outside availability

### 3. Book Appointment

1. Tap any available "Book" slot
2. Review appointment details on confirmation screen
3. Tap **Confirm Booking** to finalize

### 4. Manage Bookings

- Navigate to **My Bookings** tab
- View all scheduled appointments grouped by doctor
- Tap **Cancel** to remove individual appointments
- Use **Clear All** to remove all at once
- Pull down to refresh

---

## 🎨 Design System

### Color Palette

The app uses a healthcare-focused green theme:

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary | `hsl(142.1, 76.2%, 36.3%)` | `hsl(142.1, 70%, 50%)` |
| Background | `hsl(0, 0%, 100%)` | `hsl(222.2, 84%, 4.9%)` |
| Card | `hsl(0, 0%, 100%)` | `hsl(222.2, 84%, 4.9%)` |
| Border | `hsl(214.3, 31.8%, 91.4%)` | `hsl(217.2, 32.6%, 17.5%)` |

### Typography

- **Headings**: Bold, high contrast
- **Body**: Regular weight, readable sizes
- **Secondary**: Muted colors for supporting text

### Spacing

- Consistent 4px base unit
- Generous padding for touch targets (min 44px)
- Clear visual hierarchy with spacing scale

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Test Structure

```
src/__tests__/
└── storage/
    └── appointments.test.ts  # MMKV storage tests
```

---

## 🔧 Troubleshooting

### Metro bundler issues

```bash
# Clear cache and restart
pnpm start -c
```

### iOS build errors

```bash
# Reinstall pods
cd ios && pod install && cd ..

# Clean build folder
pnpm ios -- --clean
```

### Android build errors

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Rebuild
pnpm android
```

### TypeScript errors

```bash
# Type check
npx tsc --noEmit
```

### Storage not persisting

1. Ensure app has been rebuilt after installing MMKV
2. Check platform-specific setup:
   - iOS: Pods should be linked
   - Android: Gradle sync complete

---

## 🚧 Known Limitations

### Current Scope

1. **Local-Only Data**
   - No backend synchronization
   - Device-specific storage
   - No multi-user support

2. **No Authentication**
   - Demo purposes only
   - Anyone can book/cancel
   - No user accounts

3. **Timezone Display**
   - Shows doctor's timezone as-is
   - No automatic conversion
   - Manual calculation required

### Planned Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Timezone conversion
- [ ] Email/SMS confirmations
- [ ] Push notification reminders
- [ ] Rescheduling functionality
- [ ] Recurring appointments
- [ ] Waitlist feature
- [ ] Comprehensive E2E tests

---

## 📄 API Integration (Future)

The app is designed to integrate with:

```
GET https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json
```

**Expected Response:**
```json
[
  {
    "name": "Dr. Sarah Johnson",
    "timezone": "America/New_York",
    "day_of_week": "Monday",
    "available_at": "9:00AM",
    "available_until": "5:00PM"
  }
]
```

**Integration Steps:**
1. Replace local JSON loading in `src/screens/doctors/index.tsx`
2. Add error handling for network failures
3. Implement loading states
4. Add retry logic
5. Enable pull-to-refresh

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

---

## 📝 License

This project is licensed under the MIT License.

---

## 📮 Contact

For questions or support, please:
- Open an issue on [GitHub](https://github.com/jingledongding/ShiftCareApp/issues)
- Contact maintainers

---

<div align="center">

**Built with** ❤️ **using React Native and Expo**

[⬆ Back to Top](#shiftcare-doctor-booking-app)

</div>
