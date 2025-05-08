// useCountdownTimer.js
import { useEffect, useRef, useState } from "react";

type CountdownEndCallback = () => void;

const useCountdownTimer = (
  initialSeconds: number,
  onEnd?: CountdownEndCallback
) => {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Starts or resumes the timer.
   * - If the timer is inactive and not paused, it initializes the countdown.
   * - If the timer is paused, it resumes from the current `secondsLeft`.
   */
  const start = () => {
    if (isActive && !isPaused) return; // Prevent multiple intervals
    if (secondsLeft === null) {
      setSecondsLeft(initialSeconds); // Initialize the countdown
    }
    setIsActive(true);
    setIsPaused(false);
  };

  /**
   * Pauses the timer.
   * - Stops the countdown without resetting `secondsLeft`.
   */
  const pause = () => {
    if (!isActive) return; // If timer isn't active, no need to pause
    setIsPaused(true);
    setIsActive(false);
  };

  /**
   * Resets the timer to its initial state and starts the countdown.
   * - Stops the countdown.
   * - Resets `secondsLeft` to `initialSeconds`.
   * - Starts the countdown immediately.
   */
  const reset = () => {
    setIsPaused(false);
    setSecondsLeft(initialSeconds);
    setIsActive(true); // Start the countdown immediately after reset
  };

  /**
   * Effect to handle the countdown logic.
   * - Sets up an interval to decrement `secondsLeft` every second when the timer is active and not paused.
   * - Cleans up the interval when the component unmounts or when dependencies change.
   */
  useEffect(() => {
    // Only set up the interval if the timer is active and not paused
    if (isActive && !isPaused && secondsLeft !== null && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds !== null && prevSeconds > 0) {
            return prevSeconds - 1;
          }
          return null;
        });
      }, 1000);
    }

    return () => {
      // Cleanup interval on unmount or when dependencies change
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isPaused, secondsLeft]);

  /**
   * Effect to handle the end of the countdown.
   * - When `secondsLeft` reaches 0, it:
   *   - Stops the timer.
   *   - Sets `secondsLeft` to `null`.
   *   - Executes the `onEnd` callback if provided.
   */
  useEffect(() => {
    if (secondsLeft === 0) {
      setIsActive(false);
      setIsPaused(false);
      setSecondsLeft(null); // Set to null instead of 0
      if (onEnd) {
        onEnd();
      }
    }
  }, [secondsLeft, onEnd]);

  return {
    secondsLeft,
    isActive,
    isPaused,
    start,
    pause,
    reset,
  };
};

export default useCountdownTimer;
