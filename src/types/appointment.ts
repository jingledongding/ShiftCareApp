export interface Appointment {
  id: string;
  doctorName: string;
  doctorTimezone: string;
  dayOfWeek: string;
  time: string;
  createdAt: number;
}

export interface NewAppointment {
  doctorName: string;
  doctorTimezone: string;
  dayOfWeek: string;
  time: string;
}
