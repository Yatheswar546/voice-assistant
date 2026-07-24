"use client";

import {
  createContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { VoiceSettings } from "@/types/voice";
import {
  DEFAULT_VOICE_SETTINGS,
  VOICE_SETTINGS_STORAGE_KEY,
} from "@/constants/voice";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localStorage";

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (updates: Partial<VoiceSettings>) => void;
  resetSettings: () => void;
}

export const VoiceSettingsContext =
  createContext<VoiceSettingsContextType | null>(null);

interface VoiceSettingsProviderProps {
  children: ReactNode;
}

const SETTINGS_CHANGE_EVENT = "voice-settings-change";

let cachedSettings: VoiceSettings = DEFAULT_VOICE_SETTINGS;
let hasLoadedSettings = false;

function getClientSnapshot(): VoiceSettings {
  if (!hasLoadedSettings) {
    cachedSettings = loadFromLocalStorage(
      VOICE_SETTINGS_STORAGE_KEY,
      DEFAULT_VOICE_SETTINGS
    );
    hasLoadedSettings = true;
  }

  return cachedSettings;
}

function getServerSnapshot(): VoiceSettings {
  return DEFAULT_VOICE_SETTINGS;
}

function subscribe(onStoreChange: () => void) {
  const handleStorageChange = (event: StorageEvent) => {
    if (
      event.key === VOICE_SETTINGS_STORAGE_KEY ||
      event.key === null
    ) {
      cachedSettings = loadFromLocalStorage(
        VOICE_SETTINGS_STORAGE_KEY,
        DEFAULT_VOICE_SETTINGS
      );
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(
      SETTINGS_CHANGE_EVENT,
      onStoreChange
    );
  };
}

export function VoiceSettingsProvider({
  children,
}: VoiceSettingsProviderProps) {
  const settings = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    cachedSettings = {
      ...getClientSnapshot(),
      ...updates,
    };

    saveToLocalStorage(
      VOICE_SETTINGS_STORAGE_KEY,
      cachedSettings
    );

    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  };

  const resetSettings = () => {
    cachedSettings = DEFAULT_VOICE_SETTINGS;

    saveToLocalStorage(
      VOICE_SETTINGS_STORAGE_KEY,
      cachedSettings
    );

    window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
  };

  return (
    <VoiceSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </VoiceSettingsContext.Provider>
  );
}