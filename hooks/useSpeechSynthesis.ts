"use client";

import { useState } from "react";

export function useSpeechSynthesis() {

    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (text: string) => {
        if (!("speechSynthesis" in window)) {
            console.error("Speech Synthesis is not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
        
    };

    const stop = () => {
        window.speechSynthesis.cancel();
    };

    return {
        speak,
        stop,
        isSpeaking,
    };
}