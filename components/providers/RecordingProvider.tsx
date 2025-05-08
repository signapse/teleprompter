import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Camera, CameraView } from "expo-camera";
import useTimer from "@/hooks/useTimer";
import useCountdownTimer from "@/hooks/useCountdownTimer";
import { saveRecording } from "@/lib/local-storage/videoRecordingStorageHelpers";
import { Alert } from "react-native";
import { IParagraph } from "@/types/paragraph";
import { useParagraphSelectionContext } from "./ParagraphSelectionProvider";
import { useParagraphs } from "./ParagraphsProvider";

interface RecordingContextType {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: (shouldSave: boolean) => void;
  isRecordingComplete: boolean;
  recordingTime: string;
  cameraRef: React.MutableRefObject<CameraView | null>;
  invalidateRecording: () => void;
  toggleRecording: () => void;
  setup: (fromFootPedal: boolean) => void;
  cleanup: () => void;
  recordingSessionFinished: boolean;
  //   recordedVideoUri: string | null;
  countdownSecondsLeft: number | null;
  isCountdownPaused: boolean;
  startCountdown: () => void;
  pauseCountdown: () => void;
  resetCountdown: () => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export const RecordingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordedVideoUriRef = useRef<string | null>(null);
  const shouldSaveRef = useRef(true);
  const fromFootPedalRef = useRef<boolean | null>(null);

  const [recordingSessionFinished, setRecordingSessionFinished] =
    useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const { refetch: refetchParagraphs } = useParagraphs();
  const { refetch: refetchRecordings } = useParagraphs();

  // Inside RecordingProvider
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    console.log("RecordingProvider: isRecordingRef updated to:", isRecording);
  }, [isRecording]);

  const {
    time: recordingTime,
    start: startTimer,
    stop: stopTimer,
    invalidate: invalidateTimer,
  } = useTimer();

  const { activeItem, hasNextAvailableItem, getNextItem } =
    useParagraphSelectionContext(); // TODO - get rid of this

  const {
    secondsLeft: countdownSecondsLeft,
    isPaused: isCountdownPaused,
    start: startCountdown,
    pause: pauseCountdown,
    reset: resetCountdown,
  } = useCountdownTimer(5, () => startRecording(activeItem));

  const setup = (fromFootPedal: boolean) => {
    fromFootPedalRef.current = fromFootPedal;
  };

  const cleanup = () => {
    fromFootPedalRef.current = null;
    setError(null);
    setIsRecording(false);
    invalidateRecording();
    setRecordingSessionFinished(false);
    cameraRef.current = null;
  };

  const startRecording = async (paragraph?: IParagraph) => {
    if (!paragraph) {
      // TODO - proper handling
      return;
    }

    setIsRecording(true); // Indicate that recording has started
    startTimer(); // Start the timer

    try {
      await recordVideo();
    } catch (error) {
      console.error("Error recording video (initRecording):", error);
    }

    stopTimer();
    setIsRecording(false);
  };

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording(false); // Decide whether to save or not based on your logic
    } else {
      startCountdown();
    }
  }, [isRecording, startCountdown, stopRecording]);

  async function recordVideo() {
    if (cameraRef.current) {
      try {
        shouldSaveRef.current = true; // Set the flag to save by default

        const video = await cameraRef.current.recordAsync();

        if (video?.uri) {
          try {
            await onRecordingSuccess(video.uri);
          } catch (error) {
            throw new Error("Error saving recording");
          }
        } else {
          throw new Error("No video URI");
        }
      } catch (error) {
        console.error("Error recording video:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred while recording the video.");
        }
      }
    }
  }

  async function onRecordingSuccess(videoUri: string) {
    recordedVideoUriRef.current = videoUri;

    const paragraph = activeItem!!;

    // After recording stops, decide based on shouldSaveRef
    if (shouldSaveRef.current && paragraph.videoLabel) {
      await saveRecording(
        paragraph.videoLabel,
        videoUri,
        paragraph.folder,
        paragraph.client.name,
        paragraph.client.id
      );

      console.log("IS FROM FOOTPEDAL:", fromFootPedalRef.current);

      // TODO -> move on save logic here
      if (fromFootPedalRef.current === true) {
        invalidateTimer();

        if (hasNextAvailableItem) {
          Alert.alert(
            "Video Successfully Saved!",
            `Video Label: ${paragraph.videoLabel}.`
          );

          recordedVideoUriRef.current = null;
          getNextItem();

          // refetchParagraphs();
          // refetchRecordings();
        } else {
          Alert.alert("All paragraphs were Successfully recording!");

          // remove controls
          setRecordingSessionFinished(true);
        }
      } else {
        // do that only if not from foot pedal as in footpedal on stop you navigate to next paragraph

        setIsRecordingComplete(true);
      }
    } else {
      Alert.alert(
        "Recording Discarded",
        "The recording was stopped without saving."
      );
    }
  }

  function stopRecording(shouldSave: boolean) {
    if (cameraRef.current && isRecordingRef.current) {
      shouldSaveRef.current = shouldSave; // Set whether to save or not
      cameraRef.current.stopRecording(); // This will resolve the `recordAsync` promise
      stopTimer(); // Stop the timer
    }
  }

  const invalidateRecording = () => {
    recordedVideoUriRef.current = null;
    setIsRecordingComplete(false);
  };

  return (
    <RecordingContext.Provider
      value={{
        // Recording
        startRecording: startCountdown,
        stopRecording,
        isRecording,
        isRecordingComplete,
        invalidateRecording,
        cameraRef,
        recordingTime,
        toggleRecording,
        setup,
        cleanup,
        recordingSessionFinished,

        // Countdown
        countdownSecondsLeft,
        isCountdownPaused,
        startCountdown,
        pauseCountdown,

        resetCountdown,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecordingContext = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error(
      "useRecordingContext must be used within a RecordingProvider"
    );
  }
  return context;
};