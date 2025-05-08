import { VideoFile } from "./fileUtils";
import * as FileSystem from "expo-file-system";

export interface PresignedUrl {
  partNumber: number;
  uploadUrl: string;
  uploadId: string;
  key: string;
}

interface UploadedPart {
  id: number;
  etag: string;
  uploadId: string;
  key: string;
}

export const uploadMultipart = async (
  fileInfo: VideoFile,
  presignedUrls: PresignedUrl[],
  partSize: number,
  onProgress: (progress: number) => void
) => {
  const totalSize = fileInfo.size;
  const totalParts = Math.ceil(totalSize / partSize);

  let uploadedParts = 0;
  const uploadedPartsInfo: UploadedPart[] = [];

  for (let index = 0; index < totalParts; index++) {
    const start = index * partSize;
    const length = Math.min(partSize, totalSize - start);

    // Create a temporary file path
    const tempFileUri = `${FileSystem.cacheDirectory}chunk-${index}.tmp`;

    try {
      // Read chunk of the file as binary data
      const chunkData = await FileSystem.readAsStringAsync(fileInfo.uri, {
        encoding: FileSystem.EncodingType.Base64,
        position: start,
        length: length,
      });

      // Write the binary chunk to a temporary file
      await FileSystem.writeAsStringAsync(tempFileUri, chunkData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const presignedUrl = presignedUrls[index];

      // Upload the temporary file using FileSystem.uploadAsync
      const uploadResult = await FileSystem.uploadAsync(
        presignedUrl.uploadUrl,
        tempFileUri,
        {
          httpMethod: "PUT",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        }
      );

      if (uploadResult.status !== 200 && uploadResult.status !== 201) {
        throw new Error(`Failed to upload part: ${uploadResult.body}`);
      }

      const headers = uploadResult.headers;
      const etag = headers["Etag"] || headers["ETag"] || headers["etag"];

      if (!etag) {
        throw new Error("ETag header not found in response");
      }

      // Remove quotes from ETag
      const cleanedEtag = etag.replace(/"/g, "");

      uploadedParts += 1;
      if (onProgress) {
        onProgress((uploadedParts / totalParts) * 100);
      }

      uploadedPartsInfo.push({
        id: presignedUrl.partNumber,
        etag: cleanedEtag,
        uploadId: presignedUrl.uploadId,
        key: presignedUrl.key,
      });
    } catch (error) {
      console.error(`Error processing chunk ${index + 1}:`, error);
      throw error; // Re-throw the error to handle it outside the function if needed
    } finally {
      // Ensure the temporary file is deleted in all cases
      await FileSystem.deleteAsync(tempFileUri, { idempotent: true }).catch(
        (deleteError) => {
          console.warn(
            `Failed to delete temporary file ${tempFileUri}:`,
            deleteError
          );
        }
      );
    }
  }

  return uploadedPartsInfo;
};
