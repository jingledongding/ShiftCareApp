import { appointmentStorage } from '@/storage/appointments';
import type { Appointment, NewAppointment } from '@/types/appointment';

// Mock MMKV storage
const mockStorage = {
  set: jest.fn(),
  getString: jest.fn(),
  remove: jest.fn(),
};

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => mockStorage),
}));

describe('AppointmentStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return empty array when no appointments exist', () => {
      mockStorage.getString.mockReturnValueOnce(undefined);
      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual([]);
      expect(mockStorage.getString).toHaveBeenCalledWith('appointments');
    });

    it('should return parsed appointments when data exists', () => {
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          doctorName: 'Dr. Smith',
          doctorTimezone: 'America/New_York',
          dayOfWeek: 'Monday',
          time: '9:00AM',
          createdAt: 1234567890,
        },
        {
          id: '2',
          doctorName: 'Dr. Jones',
          doctorTimezone: 'America/Los_Angeles',
          dayOfWeek: 'Tuesday',
          time: '2:00PM',
          createdAt: 1234567891,
        },
      ];
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual(mockAppointments);
      expect(mockStorage.getString).toHaveBeenCalledWith('appointments');
    });

    it('should return empty array when JSON parse fails', () => {
      mockStorage.getString.mockReturnValueOnce('invalid json');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading appointments:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty JSON array', () => {
      mockStorage.getString.mockReturnValueOnce('[]');
      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual([]);
    });
  });

  describe('save', () => {
    const newAppointment: NewAppointment = {
      doctorName: 'Dr. Smith',
      doctorTimezone: 'America/New_York',
      dayOfWeek: 'Monday',
      time: '9:00AM',
    };

    it('should save new appointment with generated ID and timestamp', () => {
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.save(newAppointment);

      expect(result).toMatchObject(newAppointment);
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.createdAt).toBeDefined();
      expect(typeof result.createdAt).toBe('number');

      expect(mockStorage.getString).toHaveBeenCalledWith('appointments');
      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.stringContaining('"doctorName":"Dr. Smith"')
      );
    });

    it('should add appointment to existing list', () => {
      const existingAppointments: Appointment[] = [
        {
          id: '1',
          doctorName: 'Dr. Jones',
          doctorTimezone: 'America/Los_Angeles',
          dayOfWeek: 'Tuesday',
          time: '2:00PM',
          createdAt: 1234567890,
        },
      ];
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(existingAppointments));

      const result = appointmentStorage.save(newAppointment);

      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.stringContaining('"doctorName":"Dr. Smith"')
      );
      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.stringContaining('"doctorName":"Dr. Jones"')
      );
    });

    it('should generate unique IDs', () => {
      mockStorage.getString.mockReturnValueOnce('[]');
      mockStorage.getString.mockReturnValueOnce('[]');

      const appointment1 = appointmentStorage.save(newAppointment);
      const appointment2 = appointmentStorage.save(newAppointment);

      expect(appointment1.id).not.toBe(appointment2.id);
    });

    it('should generate timestamps close to current time', () => {
      const beforeSave = Date.now();
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.save(newAppointment);
      const afterSave = Date.now();

      expect(result.createdAt).toBeGreaterThanOrEqual(beforeSave);
      expect(result.createdAt).toBeLessThanOrEqual(afterSave);
    });
  });

  describe('delete', () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
        createdAt: 1234567890,
      },
      {
        id: '2',
        doctorName: 'Dr. Jones',
        doctorTimezone: 'America/Los_Angeles',
        dayOfWeek: 'Tuesday',
        time: '2:00PM',
        createdAt: 1234567891,
      },
      {
        id: '3',
        doctorName: 'Dr. Brown',
        doctorTimezone: 'America/Chicago',
        dayOfWeek: 'Wednesday',
        time: '10:00AM',
        createdAt: 1234567892,
      },
    ];

    it('should delete appointment by ID and return true', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.delete('2');

      expect(result).toBe(true);
      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.not.stringContaining('"id":"2"')
      );
      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.stringContaining('"id":"1"')
      );
      expect(mockStorage.set).toHaveBeenCalledWith(
        'appointments',
        expect.stringContaining('"id":"3"')
      );
    });

    it('should return false when appointment ID not found', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.delete('non-existent-id');

      expect(result).toBe(false);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });

    it('should return false when no appointments exist', () => {
      mockStorage.getString.mockReturnValueOnce(undefined);

      const result = appointmentStorage.delete('1');

      expect(result).toBe(false);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });

    it('should handle deleting from single appointment list', () => {
      const singleAppointment = [mockAppointments[0]];
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(singleAppointment));

      const result = appointmentStorage.delete('1');

      expect(result).toBe(true);
      expect(mockStorage.set).toHaveBeenCalledWith('appointments', '[]');
    });
  });

  describe('clear', () => {
    it('should remove appointments key from storage', () => {
      appointmentStorage.clear();

      expect(mockStorage.remove).toHaveBeenCalledWith('appointments');
    });

    it('should clear all appointments when appointments exist', () => {
      mockStorage.getString.mockReturnValueOnce(
        JSON.stringify([
          {
            id: '1',
            doctorName: 'Dr. Smith',
            doctorTimezone: 'America/New_York',
            dayOfWeek: 'Monday',
            time: '9:00AM',
            createdAt: 1234567890,
          },
        ])
      );

      appointmentStorage.clear();
      expect(mockStorage.remove).toHaveBeenCalledWith('appointments');
    });
  });

  describe('isSlotBooked', () => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
        createdAt: 1234567890,
      },
      {
        id: '2',
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '10:00AM',
        createdAt: 1234567891,
      },
      {
        id: '3',
        doctorName: 'Dr. Jones',
        doctorTimezone: 'America/Los_Angeles',
        dayOfWeek: 'Monday',
        time: '9:00AM',
        createdAt: 1234567892,
      },
    ];

    it('should return true when slot is booked for same doctor, day, and time', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '9:00AM');
      expect(result).toBe(true);
    });

    it('should return false when slot is not booked', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '11:00AM');
      expect(result).toBe(false);
    });

    it('should return false when different doctor on same day and time', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Brown', 'Monday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should return false when same doctor on different day', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Tuesday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should return false when no appointments exist', () => {
      mockStorage.getString.mockReturnValueOnce(undefined);

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should be case sensitive for doctor name', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('dr. smith', 'Monday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should be case sensitive for day of week', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'monday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should match exact time format', () => {
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '9:00 AM');
      expect(result).toBe(false);
    });

    it('should handle empty appointments list', () => {
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '9:00AM');
      expect(result).toBe(false);
    });

    it('should handle JSON parse errors gracefully', () => {
      mockStorage.getString.mockReturnValueOnce('invalid json');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = appointmentStorage.isSlotBooked('Dr. Smith', 'Monday', '9:00AM');
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error reading appointments:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in doctor name', () => {
      const specialName = "Dr. O'Brien-Smith Jr.";
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          doctorName: specialName,
          doctorTimezone: 'America/New_York',
          dayOfWeek: 'Monday',
          time: '9:00AM',
          createdAt: 1234567890,
        },
      ];
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked(specialName, 'Monday', '9:00AM');
      expect(result).toBe(true);
    });

    it('should handle Unicode characters in doctor name', () => {
      const unicodeName = 'Dr. Müller 北京';
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          doctorName: unicodeName,
          doctorTimezone: 'America/New_York',
          dayOfWeek: 'Monday',
          time: '9:00AM',
          createdAt: 1234567890,
        },
      ];
      mockStorage.getString.mockReturnValueOnce(JSON.stringify(mockAppointments));

      const result = appointmentStorage.isSlotBooked(unicodeName, 'Monday', '9:00AM');
      expect(result).toBe(true);
    });

    it('should handle very long doctor names', () => {
      const longName = 'Dr. ' + 'A'.repeat(1000);
      const newAppointment: NewAppointment = {
        doctorName: longName,
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
      };
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.save(newAppointment);
      expect(result.doctorName).toBe(longName);
    });

    it('should handle appointments with same ID from different instances', () => {
      // This tests the ID generation uniqueness
      mockStorage.getString.mockReturnValueOnce('[]');
      mockStorage.getString.mockReturnValueOnce('[]');

      const appointment1 = appointmentStorage.save({
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
      });

      const appointment2 = appointmentStorage.save({
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
      });

      expect(appointment1.id).not.toBe(appointment2.id);
    });

    it('should handle rapid consecutive saves', () => {
      mockStorage.getString.mockReturnValue('[]');

      const appointments = [];
      for (let i = 0; i < 100; i++) {
        const appointment = appointmentStorage.save({
          doctorName: 'Dr. Smith',
          doctorTimezone: 'America/New_York',
          dayOfWeek: 'Monday',
          time: '9:00AM',
        });
        appointments.push(appointment);
      }

      // All IDs should be unique
      const uniqueIds = new Set(appointments.map((a) => a.id));
      expect(uniqueIds.size).toBe(100);

      // All timestamps should be in reasonable range
      const timestamps = appointments.map((a) => a.createdAt);
      timestamps.forEach((ts) => {
        expect(ts).toBeGreaterThan(Date.now() - 10000); // Within last 10 seconds
        expect(ts).toBeLessThanOrEqual(Date.now());
      });
    });
  });

  describe('Negative Cases', () => {
    it('should handle empty string parameters in isSlotBooked', () => {
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.isSlotBooked('', '', '');
      expect(result).toBe(false);
    });

    it('should handle null-like storage values', () => {
      mockStorage.getString.mockReturnValueOnce(null);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual([]);

      consoleErrorSpy.mockRestore();
    });

    it('should handle malformed JSON in storage', () => {
      mockStorage.getString.mockReturnValueOnce('{invalid json}');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const appointments = appointmentStorage.getAll();
      expect(appointments).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle save with missing optional fields', () => {
      const minimalAppointment: NewAppointment = {
        doctorName: 'Dr. Smith',
        doctorTimezone: 'America/New_York',
        dayOfWeek: 'Monday',
        time: '9:00AM',
      };
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.save(minimalAppointment);
      expect(result).toMatchObject(minimalAppointment);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });

    it('should handle delete on empty storage', () => {
      mockStorage.getString.mockReturnValueOnce('[]');

      const result = appointmentStorage.delete('non-existent');
      expect(result).toBe(false);
      expect(mockStorage.set).not.toHaveBeenCalled();
    });
  });
});
