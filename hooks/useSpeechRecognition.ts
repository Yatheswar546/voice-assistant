import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    // Configuration
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    // Event: Recognition Started
    recognition.onstart = () => {
      setIsListening(true);
    };

    // Event: Recognition Ended
    recognition.onend = () => {
      setIsListening(false);
    };

    // Event: Error
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    // Event: Speech Recognized
    recognition.onresult = (event) => {
      const lastResult =
        event.results[event.results.length - 1][0].transcript;

      setTranscript(lastResult);
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore cleanup errors
      }

      recognition.onstart = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;

      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setTranscript("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
}