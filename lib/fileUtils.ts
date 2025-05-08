import * as FileSystem from "expo-file-system";
import { generateUniqueId } from "./utils";

type VideoFileMimeType =
  | "video/mp4"
  | "video/quicktime"
  | "application/octet-stream";

export interface VideoFile {
  id: string;
  uri: string;
  name: string;
  size: number;
  mime: VideoFileMimeType;
}

export const localRecordingToVideoFile = async (
  localUri: string,
  label: string
): Promise<VideoFile> => {
  // Extract the file name from the URI

  const fileInfo = await FileSystem.getInfoAsync(localUri);
  if (!fileInfo.exists) {
    throw new Error(`File at ${localUri} does not exist`);
  }

  // Extract the filename from the URI
  const fileName = localUri.split("/").pop() || `${label}.mp4`;

  // Determine the MIME type based on the file extension
  const extension = fileName.split(".").pop()?.toLowerCase();
  let mimeType: VideoFileMimeType = "application/octet-stream"; // Default MIME type

  if (extension === "mov") {
    mimeType = "video/quicktime";
  } else if (extension === "mp4") {
    mimeType = "video/mp4";
  }

  const uniqueId = await generateUniqueId();

  // Create and return the file object
  return {
    id: uniqueId,
    uri: localUri,
    size: fileInfo.size,
    name: `${label}.${extension}`,
    mime: mimeType,
  };
};

export const convertBytesToMB = (bytes: number): number => {
  return parseFloat((bytes / (1024 * 1024)).toFixed(2));
};
