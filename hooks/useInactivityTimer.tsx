import { useState, useEffect, useRef } from "react";
import { useAppState } from "./useAppState";
import dayjs from "dayjs";

export const useInactivityTimer = (
  timeoutMinutes: number,
  onTimeout: () => void
) => {
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null);

  const timeWhenAppStoppedBeingActiveRef = useRef<string | null>(null);

  const appStatus = useAppState();

  const hasBeenInactiveForMoreThanTimeout = (
    inactiveTimeISO: string,
    timeoutMinutes: number
  ): boolean => {
    const inactiveTime = dayjs(inactiveTimeISO);
    const currentTime = dayjs();

    const diffInMinutes = currentTime.diff(inactiveTime, "minute");

    console.log(`App was inactive for ${diffInMinutes} minutes.`);

    return diffInMinutes > timeoutMinutes;
  };

  useEffect(() => {
    if (appStatus === "active") {
      const inactiveTimeISO = timeWhenAppStoppedBeingActiveRef.current;

      if (inactiveTimeISO) {
        const inactiveTresholdPassed = hasBeenInactiveForMoreThanTimeout(
          inactiveTimeISO,
          timeoutMinutes
        );

        if (inactiveTresholdPassed) {
          onTimeout();
        }
      }
    } else {
      const currentTime = dayjs().toISOString();
      timeWhenAppStoppedBeingActiveRef.current = currentTime;
    }
  }, [appStatus]);

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    const timer = setTimeout(
      () => {
        // onTimeout(); // Trigger the callback after inactivity
      },
      timeoutMinutes * 60 * 1000
    ); // Convert minutes to milliseconds

    setInactivityTimer(timer as unknown as number); // Save the timer ID
  };

  // Return the reset function so it can be called manually (e.g., on user interaction)
  return { resetInactivityTimer };
};
