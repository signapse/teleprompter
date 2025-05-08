import { useState, useRef } from "react";

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const pad = (num: number): string => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const useTimer = () => {
  const [time, setTime] = useState<number>(0); // Time in seconds
  const [isActive, setIsActive] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const invalidate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setTime(0);
      setIsActive(false);
      intervalRef.current = null;
    }
  };

  const start = () => {
    if (!isActive) {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const pause = () => {
    if (isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsActive(false);
    }
  };

  const stop = () => {
    if (isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
      setTime(0);
      setIsActive(false);
    }
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  return {
    time: formatTime(time),
    isActive,
    start,
    stop,
    reset,
    pause,
    invalidate,
  };
};

export default useTimer;
