import { createMMKV } from 'react-native-mmkv';
import type { Appointment, NewAppointment } from '@/types/appointment';

const STORAGE_ID = 'shiftcare-appointments';
const APPOINTMENTS_KEY = 'appointments';

const storage = createMMKV({ id: STORAGE_ID });

export const appointmentStorage = {
  // Get all appointments
  getAll(): Appointment[] {
    try {
      const data = storage.getString(APPOINTMENTS_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading appointments:', error);
      return [];
    }
  },

  // Save a new appointment
  save(newAppointment: NewAppointment): Appointment {
    const appointments = this.getAll();

    const appointment: Appointment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...newAppointment,
      createdAt: Date.now(),
    };

    appointments.push(appointment);
    storage.set(APPOINTMENTS_KEY, JSON.stringify(appointments));

    return appointment;
  },

  // Delete an appointment by ID
  delete(id: string): boolean {
    const appointments = this.getAll();
    const filtered = appointments.filter((a) => a.id !== id);

    if (filtered.length < appointments.length) {
      storage.set(APPOINTMENTS_KEY, JSON.stringify(filtered));
      return true;
    }

    return false;
  },

  // Clear all appointments
  clear(): void {
    storage.remove(APPOINTMENTS_KEY);
  },

  // Check if a specific slot is already booked
  isSlotBooked(doctorName: string, dayOfWeek: string, time: string): boolean {
    const appointments = this.getAll();
    return appointments.some(
      (a) =>
        a.doctorName === doctorName &&
        a.dayOfWeek === dayOfWeek &&
        a.time === time
    );
  },
};
