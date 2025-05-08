import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import signTranslationService, {
  IPostPresignedUrlsRequestData,
} from "@/lib/api/signTranslationService";
import { uploadMultipart } from "@/lib/uploadMultipart";
import { VideoFile } from "@/lib/fileUtils";

export interface IMultipartUploadRequestData {
  file: VideoFile;
  key: string;
}

interface Props {
  data?: IMultipartUploadRequestData;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

const MAX_PARTS = 100;
const DEFAULT_PART_SIZE = 5 * 1024 * 1024; // 5MB

export default function useMultipart({
  data,
  onSuccess,
  onError,
  onProgress,
}: Props = {}) {
  const [progress, setProgress] = useState(0);

  const { mutateAsync, mutate, isPending, error } = useMutation({
    mutationFn: handleMultipartUpload,
    onSuccess: (): void => {
      onSuccess?.();
    },
    onError: (error: Error): void => {
      onError?.(error);
    },
  });

  const partSize = useMemo(() => {
    if (!data?.file) {
      return DEFAULT_PART_SIZE;
    }

    const threshold = 500 * 1024 * 1024; // 500MB
    if (data.file.size > threshold) {
      const partSizeInMB = Math.ceil(
        data.file.size / MAX_PARTS / (1024 * 1024)
      );
      return partSizeInMB * (1024 * 1024); // Convert MB back to bytes
    }

    return DEFAULT_PART_SIZE;
  }, [data?.file]);

  async function handleMultipartUpload(data?: IMultipartUploadRequestData) {
    if (!data?.file || data?.file.size === null) {
      throw new Error("Missing data to upload or file size not available");
    }

    const { file, key } = data;

    /**
     * * STEP 1: generate presigned urls
     */

    const body = generatePresignedUrlsRequestBody(data.file.size, key);

    console.log("numberOfParts:", body.numberOfParts);

    const presignedUrls = await signTranslationService.postPresignedUrls({
      data: body,
    });

    /**
     * * STEP 2: upload parts
     */
    if (!presignedUrls?.length) {
      throw new Error("Failed to get presigned urls");
    }

    const uploadMultipartResponse = await uploadMultipart(
      file,
      presignedUrls,
      partSize,
      (progress: any) =>
        onMultipartUploadProgressChange(progress, presignedUrls.length)
    );

    /**
     * * STEP 3: complete upload
     */
    await signTranslationService.postMultipartUploadComplete({
      data: { parts: uploadMultipartResponse },
    });
  }

  const onMultipartUploadProgressChange = (
    progress: number,
    totalParts: number
  ): void => {
    console.log("progressx:", progress);
    console.log("totalParts:", totalParts);

    // const newProgress = (progress / totalParts) * 100;
    const newProgress = Math.ceil(progress);

    if (onProgress) {
      onProgress(newProgress);
    } else {
      setProgress(newProgress);
    }
  };

  const getNumberOfPartsForFile = (fileSize: number): number => {
    return Math.ceil(fileSize / partSize);
  };

  const generatePresignedUrlsRequestBody = (
    fileSize: number,
    key: string
  ): IPostPresignedUrlsRequestData => ({
    fileKey: key,
    numberOfParts: getNumberOfPartsForFile(fileSize),
  });

  return {
    multipartUpload: mutate,
    multipartUploadAsync: mutateAsync,
    isPending,
    error,
    progress,
  };
}
