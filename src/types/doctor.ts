export interface DoctorAvailability {
  name: string;
  timezone: string;
  day_of_week: string;
  available_at: string;
  available_until: string;
}

export interface DoctorGroup {
  name: string;
  timezone: string;
  availabilities: Array<{
    day_of_week: string;
    available_at: string;
    available_until: string;
  }>;
}
