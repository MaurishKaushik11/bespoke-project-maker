import { create } from 'zustand';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Profile {
  id: string;
  name: string;
  timezone: string;
}

export interface Event {
  id: string;
  profileIds: string[];
  timezone: string;
  startDate: string; // ISO string in UTC
  endDate: string; // ISO string in UTC
  title?: string;
  description?: string;
}

interface EventStore {
  profiles: Profile[];
  events: Event[];
  currentProfile: Profile | null;
  addProfile: (name: string) => void;
  setCurrentProfile: (profileId: string | null) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  getEventsForProfile: (profileId: string, viewTimezone: string) => Event[];
}

export const useEventStore = create<EventStore>((set, get) => ({
  profiles: [],
  events: [],
  currentProfile: null,

  addProfile: (name: string) => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name,
      timezone: 'America/New_York', // Default timezone
    };
    set((state) => ({
      profiles: [...state.profiles, newProfile],
      currentProfile: state.currentProfile || newProfile,
    }));
  },

  setCurrentProfile: (profileId: string | null) => {
    const profile = profileId ? get().profiles.find((p) => p.id === profileId) : null;
    set({ currentProfile: profile || null });
  },

  addEvent: (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
    };
    set((state) => ({
      events: [...state.events, newEvent],
    }));
  },

  updateEvent: (id: string, event: Partial<Event>) => {
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
    }));
  },

  getEventsForProfile: (profileId: string, viewTimezone: string) => {
    return get().events.filter((e) => e.profileIds.includes(profileId));
  },
}));
