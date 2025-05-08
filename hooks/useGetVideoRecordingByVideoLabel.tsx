import { getRecordingByVideoLabel } from "@/lib/local-storage/videoRecordingStorageHelpers";
import { IRecording } from "@/types/recording";
import { useEffect, useState } from "react";

export default function useGetVideoRecordingByVideoLabel(videoLabel: string) {
  const [paragraphRecording, setParagraphRecording] =
    useState<IRecording | null>(null);

  useEffect(() => {
    (async () => {
      const recording = await getRecordingByVideoLabel(videoLabel);
      if (recording) {
        setParagraphRecording(recording);
      }
    })();
  }, []);

  return paragraphRecording;
}
