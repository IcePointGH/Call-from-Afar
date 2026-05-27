import { create } from "zustand";

export interface Ticket {
  id: string;
  userNickname: string;
  targetCategory: string;
  targetNickname: string;
  duration: number;
  timestamp: string;
  message: string;
}

interface AppState {
  userNickname: string;
  targetCategory: string;
  targetNickname: string;
  callDuration: number;
  callStartTime: number | null;
  isCalling: boolean;
  isConnected: boolean;
  animationEnabled: boolean;
  soundEnabled: boolean;
  transitionEnabled: boolean;
  hasSeenPrivacyModal: boolean;
  ticketHistory: Ticket[];

  setUserInfo: (nickname: string, category: string, target: string) => void;
  startCall: () => void;
  endCall: () => void;
  updateDuration: () => void;
  setIsConnected: (connected: boolean) => void;
  setAnimationEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setTransitionEnabled: (enabled: boolean) => void;
  setHasSeenPrivacyModal: (seen: boolean) => void;
  addToHistory: (ticket: Ticket) => void;
  resetCallState: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userNickname: "",
  targetCategory: "",
  targetNickname: "",
  callDuration: 0,
  callStartTime: null,
  isCalling: false,
  isConnected: false,
  animationEnabled: true,
  soundEnabled: false,
  transitionEnabled: true,
  hasSeenPrivacyModal: false,
  ticketHistory: [],

  setUserInfo: (nickname, category, target) =>
    set({ userNickname: nickname, targetCategory: category, targetNickname: target }),

  startCall: () =>
    set({ isCalling: true, callStartTime: Date.now(), callDuration: 0 }),

  endCall: () =>
    set({ isCalling: false, isConnected: false }),

  updateDuration: () => {
    const { callStartTime } = get();
    if (callStartTime) {
      set({ callDuration: Math.floor((Date.now() - callStartTime) / 1000) });
    }
  },

  setIsConnected: (connected) => set({ isConnected: connected }),

  setAnimationEnabled: (enabled) => set({ animationEnabled: enabled }),

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  setTransitionEnabled: (enabled) => set({ transitionEnabled: enabled }),

  setHasSeenPrivacyModal: (seen) => set({ hasSeenPrivacyModal: seen }),

  addToHistory: (ticket) =>
    set((state) => ({ ticketHistory: [...state.ticketHistory, ticket] })),

  resetCallState: () =>
    set({ callDuration: 0, callStartTime: null, isCalling: false, isConnected: false }),
}));
