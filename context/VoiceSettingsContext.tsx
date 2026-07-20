"use client";

import {
    createContext,
    useEffect,
    useState,
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

export function VoiceSettingsProvider({
    children,
}: VoiceSettingsProviderProps) {
    const [settings, setSettings] = useState<VoiceSettings>(() =>
        loadFromLocalStorage(
            VOICE_SETTINGS_STORAGE_KEY,
            DEFAULT_VOICE_SETTINGS
        )
    );

    useEffect(() => {
        saveToLocalStorage(
            VOICE_SETTINGS_STORAGE_KEY,
            settings
        );
    }, [settings]);

    const updateSettings = (
        updates: Partial<VoiceSettings>
    ) => {
        setSettings((prev) => ({
            ...prev,
            ...updates,
        }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_VOICE_SETTINGS);
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