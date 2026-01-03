import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

export type ClassroomStatus = 'Available' | 'Occupied';
export type ClassroomType = 'Lecture Hall' | 'Lab' | 'Seminar Room';

export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  size: number; // in sq. ft
  type: ClassroomType;
  status: ClassroomStatus;
  occupiedBy?: string;
  timeSlot?: {
    start: string;
    end: string;
  };
  lastUpdated: Timestamp;
  usageHistory?: { date: string; time: string; event: string }[];
  imageUrl?: string;
}
