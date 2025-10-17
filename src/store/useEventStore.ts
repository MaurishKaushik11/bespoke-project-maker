import { create } from 'zustand';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { profileAPI, eventAPI } from '@/lib/api';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Profile {
  id: string;
  name: string;
  timezone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  profileIds: string[];
  timezone: string;
  startDate: string; // ISO string in UTC
  endDate: string; // ISO string in UTC
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updateLogs?: any[];
}

interface EventStore {
  profiles: Profile[];
  events: Event[];
  currentProfile: Profile | null;
  loading: boolean;
  error: string | null;

  // Profile actions
  fetchProfiles: () => Promise<void>;
  addProfile: (name: string, timezone?: string) => Promise<void>;
  setCurrentProfile: (profileId: string | null) => void;

  // Event actions
  fetchEvents: () => Promise<void>;
  fetchEventsForProfile: (profileId: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  getEventsForProfile: (profileId: string, viewTimezone: string) => Event[];

  // Utility actions
  clearError: () => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  profiles: [],
  events: [],
  currentProfile: null,
  loading: false,
  error: null,

  // Profile actions
  fetchProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const profiles = await profileAPI.getAll();
      set({ profiles, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addProfile: async (name: string, timezone: string = 'America/New_York') => {
    set({ loading: true, error: null });
    try {
      const newProfile = await profileAPI.create({ name, timezone });
      set((state) => ({
        profiles: [...state.profiles, newProfile],
        currentProfile: state.currentProfile || newProfile,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentProfile: (profileId: string | null) => {
    const profile = profileId ? get().profiles.find((p) => p.id === profileId) : null;
    set({ currentProfile: profile || null });
  },

  // Event actions
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const events = await eventAPI.getAll();
      set({ events, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchEventsForProfile: async (profileId: string) => {
    set({ loading: true, error: null });
    try {
      const events = await eventAPI.getByProfile(profileId);
      set({ events, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addEvent: async (event: Omit<Event, 'id'>) => {
    set({ loading: true, error: null });
    try {
      const newEvent = await eventAPI.create(event);
      set((state) => ({
        events: [...state.events, newEvent],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateEvent: async (id: string, eventData: Partial<Event>) => {
    set({ loading: true, error: null });
    try {
      const updatedEvent = await eventAPI.update(id, eventData);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getEventsForProfile: (profileId: string, viewTimezone: string) => {
    return get().events.filter((e) => e.profileIds.includes(profileId));
  },

  clearError: () => {
    set({ error: null });
  },
}));
