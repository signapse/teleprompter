"use client";

import { useCallback, useRef, useState } from "react";
import signTranslationService from "@/lib/api/signTranslationService";
import useMultipart from "./useMultipart";
import { VideoFile } from "@/lib/fileUtils";
import { LogType } from "@/types/enums";

const generateUploadFileKey = (
  translationId: number,
  sentenceId?: number,
  paragraphId?: number
): string => {
  if (!paragraphId && !sentenceId) {
    throw new Error("Missing paragraphId or sentenceId");
  }
  if (sentenceId) {
    return `sentences/${translationId}/${sentenceId}.mp4`;
  }
  return `${translationId}/${paragraphId}.mp4`;
};

interface UploadFileParams {
  clientId: number;
  files: VideoFile[];
  replace: boolean;
  isSentenceTranslation?: boolean;
}

export type IFileMultiUploadStatuses = Record<string, number>;

interface Props {
  onSuccess?: (uploadedFileIds: string[]) => void;
}

export default function useBulkUploadVideoTranslations({
  onSuccess,
}: Props = {}) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [uploadStatuses, setUploadStatuses] =
    useState<IFileMultiUploadStatuses>({});

  const currentFileIndexRef = useRef<number>(0);

  const filesToUpload = useRef<VideoFile[]>([]);

  const { multipartUploadAsync } = useMultipart({
    onProgress: (progress) => {
      console.log("progress", progress);

      const fileUploadId =
        filesToUpload.current?.[currentFileIndexRef.current]?.id;
      setUploadStatuses((prevStatuses) => ({
        ...prevStatuses,
        [fileUploadId]: progress,
      }));
    },
  });

  const uploadFiles = useCallback(
    async ({
      clientId,
      files,
      replace,
      isSentenceTranslation,
    }: UploadFileParams) => {
      /**
       * * STEP 0: Invalidate state
       */
      // invalidate state
      setLogs([]);
      setUploadStatuses({});

      filesToUpload.current = files;

      let allSuccessful = true;

      setIsUploading(true);
      //   setIsSuccessForall(null);

      const logs: LogEntry[] = [];
      const uploadedFileIds: string[] = [];

      /**
       * * Iterate over each file
       */
      for (let index = 0; index < files.length; index++) {
        const fileToUpload = files[index];

        try {
          /**
           * * STEP 1: Create OR retroeve translation
           */
          // Step 1: Create or retrieve translation
          const translation = await createOrRetrieveTranslation(
            fileToUpload.name,
            clientId,
            replace,
            isSentenceTranslation || false
          );

          /**
           * * STEP 2: MULTIPART UPLOAD SIGNLE FILE
           */
          await uploadSingleFileForTranslation(fileToUpload, translation);

          /**
           * * STEP 3: complete upload translation - copy and update translation status
           */

          await signTranslationService.postTranslationUploadComplete(
            translation.id
          );

          uploadedFileIds.push(fileToUpload.name?.split(".")[0]); // TODO refactor this

          logs.push({
            type: LogType.SUCCESS,
            message: `File: ${fileToUpload.name} was successfully uploaded`,
          });

          setUploadStatuses((prevStatuses) => ({
            ...prevStatuses,
            [fileToUpload.id]: 100,
          }));
        } catch (error: any) {
          const errorMessage =
            `${fileToUpload.name}: ` +
            `${error instanceof Error ? error.message : "Unknown error"}`;

          logs.push({
            type: LogType.ERROR,
            message: errorMessage,
          });

          setUploadStatuses((prevStatuses) => ({
            ...prevStatuses,
            [fileToUpload.id]: -1,
          }));

          allSuccessful = false;
        }
      }

      setLogs(logs);
      setIsUploading(false);

      // TODO : remove uploaded
      // TODO : refetch paragraphs (they will have is_teleprompter = false)

      onSuccess?.(uploadedFileIds);
    },
    [multipartUploadAsync]
  );

  const createOrRetrieveTranslation = useCallback(
    async (
      fileName: string,
      clientId: number,
      replace: boolean,
      isSentenceTranslation: boolean
    ) => {
      const translation = await signTranslationService.postTranslationBulk({
        data: {
          fileName,
          clientId,
          replace,
          isSentenceTranslation,
        },
      });

      if (!translation) {
        throw new Error("Failed to create or retrieve translation");
      }

      return translation;
    },
    []
  );

  const uploadSingleFileForTranslation = useCallback(
    async (
      file: VideoFile,
      translation: {
        id: number;
        sentence?: { id: number };
        paragraph?: { id: number };
      }
    ) => {
      const uploadKey = generateUploadFileKey(
        translation.id,
        translation.sentence?.id,
        translation.paragraph?.id
      );

      await multipartUploadAsync({
        file,
        key: uploadKey,
      });
    },
    [multipartUploadAsync]
  );

  return {
    uploadFiles,
    isUploading,
    uploadStatuses,
    logs,
    // isSuccessForAll,
  };
}
