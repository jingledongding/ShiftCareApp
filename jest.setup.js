// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock NativeWind
jest.mock('nativewind', () => ({
  create: () => ({}),
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#0000ff',
    'primary-foreground': '#ffffff',
    destructive: '#ff0000',
    muted: '#f3f4f6',
    'muted-foreground': '#6b7280',
    border: '#e5e7eb',
    input: '#f3f4f6',
    secondary: '#e5e7eb',
    accent: '#f3f4f6',
    card: '#ffffff',
  },
}));

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Global test setup
global.__TEST__ = true;
